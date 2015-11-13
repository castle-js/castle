
module.exports = {
    attemptToMutateProp: (ownerName, prop) => Error(
        `Attempt to mutate property “${prop}” of immutable “${ownerName}”`
    ),
    collectionNoData: collectionName => new Error(
        `No data provided for “${collectionName}” Collection`
    ),
    collectionSetBadIndex: (collectionName, index, length) => new Error(
        `Can't set ${collectionName}[${index}] lower than (${length}), otherwise undefined elements would occur`
    ),
    dictionaryNoData: dictionaryName => new Error(
        `No data provided for “${dictionaryName}” Dictionary`
    ),
    iCollectionNoTypeDefined: collectionName => new Error(
        `“${collectionName}” class “type” static property must be instance of Dictionary constructor`
    ),
    iDictiomaryNoSchemaDefined: dictionaryName => new Error(
        `“${dictionaryName}” class “schema” static property must be an object`
    ),
    iDictiomaryDefaultsIsNotAnObject: dictionaryName => new Error(
        `“${dictionaryName}” class “defaults” static property must be an object or undefined`
    ),

    staticSetterNoArgument: (ownerName, setterName) => new Error(
        `Argument for “${setterName}” of class ${ownerName} wasn't provided`
    ),
    staticSetterSecondCall: (ownerName, setterName) => new Error(
        `Attempted to call “${setterName}” on class “${ownerName}” twice`
    ),
    staticSetterPropertyPresent: (ownerName, setterName, propertyName) => new Error(
        `Attempted to call “${setterName}” on class “${ownerName}” that aleady ` +
        `has “${propertyName}” static property`
    ),
    staticSetterCalledOnBaseClass: (ownerName, setterName) => new Error(
        `Attempted to call “${setterName}” on class “${ownerName}” itself`
    ),
    extensionNoKeyInChildStaticObject: (objectName, key, parentName, childName) => new Error(
        `Incorrect extension: didn't found key “${key}” in static propery object “${objectName}” ` +
        `of class “${childName}”, that extends class “${parentName}”`
    ),
    extensionDifferentTypeOfKeyInChildStaticObject:
        (objectName, key, parentKeyType, childKeyType, parentName, childName) => new Error(
            `Incorrect extension: tried to override property “${key}” of type type with property ` +
            `of type “${parentKeyType}” with property of type “${childKeyType}” type in static object ` +
            `“${objectName}” of class “${childName}”, that extends class “${parentName}”`
        ),
    extensionOwerridenKeyWithNotInstance:
        (objectName, key, parentObjectConstructorName, parentName, childName) => new Error(
            `Incorrect extension: tried to override property “${key}” with not an instance ` +
            `of “${parentObjectConstructorName}” type in static object “${objectName}” ` +
            `of class “${childName}”, that extends class “${parentName}”`
        )
};