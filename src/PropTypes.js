"use strict";

const parseWithSchema = require("./utils/parseWithSchema");

const PropTypes = {

    array:  createPrimitiveTypeChecker("array"),
    bool:   createPrimitiveTypeChecker("boolean"),
    func:   createPrimitiveTypeChecker("function"),
    number: createPrimitiveTypeChecker("number"),
    object: createPrimitiveTypeChecker("object"),
    string: createPrimitiveTypeChecker("string"),

    arrayOf:    createArrayOfTypeChecker,
    instanceOf: createInstanceTypeChecker,
    dictionary: createDictionaryTypeChecker,
    collection: createCollectionTypeChecher,
    schema:     createSchemaTypeChecker

};

const ReactPropTypeLocationNames = {
    prop: "prop",
    context: "context",
    childContext: "child context"
};

const ANONYMOUS = "<<anonymous>>";


function createChainableTypeChecker(validate) {
    function checkType(
        isOptional,
        props,
        propName,
        componentName,
        location,
        propFullName
    ) {
        componentName = componentName || ANONYMOUS;
        location = location || "prop";

        propFullName = propFullName || propName;
        if (props[propName] == null) {
            let locationName = ReactPropTypeLocationNames[location];
            if (isOptional === false) {
                return new Error(`Required ${locationName} \`${propFullName}\` was not specified in \`${componentName}\`.`);
            }
            return null;
        } else {
            return validate(props, propName, componentName, location, propFullName);
        }
    }

    let chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = chainedCheckType;
    chainedCheckType.optional = checkType.bind(null, true);

    return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName) {
        let propValue = props[propName];
        let propType = getPropType(propValue);
        if (propType !== expectedType) {
            let locationName = ReactPropTypeLocationNames[location];
            // `propValue` being instance of, say, date/regexp, pass the "object"
            // check, but we can offer a more precise error message here rather than
            // "of type `object`".
            let preciseType = getPreciseType(propValue);

            return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${preciseType}\` supplied to \`${componentName}\`, expected \`${expectedType}\`.`);
        }
        return null;
    }
    return createChainableTypeChecker(validate);
}

function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
        let propValue = props[propName];
        if (!Array.isArray(propValue)) {
            let locationName = ReactPropTypeLocationNames[location];
            return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${getPropType(propValue)}\` supplied to \`${componentName}\`, expected an array.`);
        }
        for (let i = 0; i < propValue.length; i++) {
            let error = typeChecker(propValue, i, componentName, location, `${propFullName}[${i}]`);
            if (error instanceof Error) {
                return error;
            }
        }
        return null;
    }
    return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
            let locationName = ReactPropTypeLocationNames[location];
            let expectedClassName = expectedClass.name || ANONYMOUS;
            return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${getClassName(props[propName])}\` supplied to \`${componentName}\`, expected instance of \`${expectedClassName}\`.`);
        }
        return null;
    }
    return createChainableTypeChecker(validate);
}


function createSchemaTypeChecker(schema) {
    function validate(props, propName, componentName, location, propFullName) {

        let propValue = props[propName];

        if (getClassName(propValue) == "Object") {
            return parseWithSchema(schema, propValue);
        } else {
            let locationName = ReactPropTypeLocationNames[location];
            return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${getClassName(propValue)}\` supplied to \`${componentName}\`, expected an \`object\`.`);
        }
    }

    return createChainableTypeChecker(validate);
}


function createDictionaryTypeChecker(dictionaryConstructor) {
    function validate(props, propName, componentName, location, propFullName) {

        let propValue = props[propName];

        switch (true) {
            case (propValue instanceof dictionaryConstructor):
                return null;
            case (getClassName(propValue) == "Object"):
                let validationErrorOrNull = null;
                dictionaryConstructor.serialize(
                    propValue,
                    (error) => validationErrorOrNull = error,
                    (dictionary) => props[propName] = dictionary
                );
                return validationErrorOrNull;
            default:
                let locationName = ReactPropTypeLocationNames[location];
                let expectedClassName = dictionaryConstructor.name || ANONYMOUS;
                return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${getClassName(propValue)}\` supplied to \`${componentName}\`, expected instance of \`${expectedClassName}\` or an \`object\`.`);
        }
    }

    return createChainableTypeChecker(validate);
}


function createCollectionTypeChecher(collectionConstructor) {
    function validate(props, propName, componentName, location, propFullName) {

        let propValue = props[propName];

        switch(true) {

            case propValue instanceof collectionConstructor:
                return null;

            case Array.isArray(propValue):
                let validationErrorOrNull = null;

                propValue.__environment = {
                    componentName: componentName,
                    location:      location,
                    propFullName:  propFullName
                };

                collectionConstructor.serialize(
                    propValue,
                    (error) => validationErrorOrNull = error,
                    (collection) => props[propName] = collection
                );

                return validationErrorOrNull;

            default:
                let locationName = ReactPropTypeLocationNames[location];
                let expectedClassName = collectionConstructor.name || ANONYMOUS;
                return new Error(`Invalid ${locationName} \`${propFullName}\` of type \`${getClassName(propValue)}\` supplied to \`${componentName}\`, expected instance of \`${expectedClassName}\` or an \`array\`.`);
        }

    }

    return createChainableTypeChecker(validate);
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
    let propType = typeof propValue;
    if (Array.isArray(propValue)) {
        return "array";
    }
    if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return "function" rather than
        // "object" for typeof a RegExp. We"ll normalize this here so that /bla/
        // passes PropTypes.object.
        return "object";
    }
    return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
    let propType = getPropType(propValue);
    if (propType === "object") {
        if (propValue instanceof Date) {
            return "date";
        } else if (propValue instanceof RegExp) {
            return "regexp";
        }
    }
    return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
        return "<<anonymous>>";
    }
    return propValue.constructor.name;
}

module.exports = PropTypes;


