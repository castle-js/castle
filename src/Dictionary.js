
const deepEqual = require("deep-equal");

const PropTypes = require("./PropTypes");

const Errors = require("./utils/Errors");
const Symbols = require("./utils/Symbols");
const createStaticSetter = require("./utils/createStaticSetter");
const parseDictionary = require("./utils/parseDictionary");

const defineConvenienceGetters = (object, schema) => {
    for (let prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            Object.defineProperty(object, prop, {
                enumerable: true,
                get: function() { return this[Symbols.underlay][prop] },
                set: () => console.warn(Errors.attemptToMutateProp(object.constructor.name, prop))
            })
        }
    }
};

const clone = target => {
    target.constructor[Symbols.skipInit] = true;
    let newInstance = new target.constructor();
    target.constructor[Symbols.skipInit] = false;
    newInstance[Symbols.underlay] = {};
    Object.assign(newInstance[Symbols.underlay], target[Symbols.underlay]);
    return newInstance;
};

function Dictionary(data) {

    if (this.constructor[Symbols.skipInit]) {
        return;
    }

    if (this.constructor.hasOwnProperty("schema")) {
        let schema = this.constructor.schema;
        delete this.constructor.schema;
        this.constructor.setSchema(schema);
    }

    if (this.constructor.hasOwnProperty("defaults")) {
        let defaults = this.constructor.defaults;
        delete this.constructor.defaults;
        this.constructor.setDefaults(defaults);
    }

    let schema   = this.constructor[Symbols.schema];
    let defaults = this.constructor[Symbols.defaults] || {};

    if (schema instanceof Object === false) { console.log(this.constructor); throw Errors.iDictiomaryNoSchemaDefined(this.constructor.name); }
    if (defaults instanceof Object === false) { throw Errors.iDictiomaryDefaultsIsNotAnObject(this.constructor.name); }

    let parseResult = parseDictionary(schema, defaults, data, this.constructor.name);
    if (parseResult instanceof Error) {
        if (this.constructor[Symbols.serializing] === true) {
            this[Symbols.serializationError] = parseResult;
        } else {
            throw parseResult;
        }
    } else {
        this[Symbols.underlay] = parseResult;
        defineConvenienceGetters(this, schema);
    }

}

Dictionary.extend = require("./utils/extend");
Dictionary.serialize = require("./utils/serialize");
Dictionary.getTypeChecker = function() { return PropTypes.dictionary(this); };

Dictionary.setSchema = createStaticSetter("setSchema", "schema", Symbols.schema, Dictionary);
Dictionary.setDefaults = createStaticSetter("setDefaults", "defaults", Symbols.defaults, Dictionary);

Dictionary[Symbols.schema] = {};
Dictionary[Symbols.defaults] = {};

Dictionary.getTypeChecker = function() { return PropTypes.dictionary(this); };

Dictionary.prototype.get = function(key) {
    return this[Symbols.underlay][key];
};

Dictionary.prototype.set = function(key, value, errorCallback) {
    let prop = this.constructor[Symbols.schema][key];

    if (prop == null) {
        return this;
    }

    let error = prop([value], 0, this.constructor.name, null, key);
    if (error) {
        typeof errorCallback === "function" ? errorCallback(error) : console.warn(error);
        return this;
    }

    let newInstance = clone(this);
    newInstance[Symbols.underlay][key] = value;
    defineConvenienceGetters(newInstance, this.constructor[Symbols.schema]);
    return newInstance;
};

Dictionary.prototype.deepEqual = function(dictionary) {
    return deepEqual(this[Symbols.underlay], dictionary[Symbols.underlay]);
};

module.exports = Dictionary;