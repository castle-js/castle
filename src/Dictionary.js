
const Errors = require("./lib/Errors");
const symbols = require("./lib/symbols");
const createStaticSetter = require("./lib/createStaticSetter");
const parseDictionary = require("./lib/parseDictionary");

function Dictionary(data) {

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

    let schema   = this.constructor[symbols.schema];
    let defaults = this.constructor[symbols.defaults] || {};

    if (schema instanceof Object === false) { throw Errors.iDictiomaryNoSchemaDefined(this.constructor.name); }
    if (defaults instanceof Object === false) { throw Errors.iDictiomaryDefaultsIsNotAnObject(this.constructor.name); }

    let parseResult = parseDictionary(schema, defaults, data, this.constructor.name);
    if (parseResult instanceof Error) {
        if (this.constructor[symbols.serializing] === true) {
            this[symbols.serializationError] = parseResult;
        } else {
            throw parseResult;
        }
    } else {
        Object.assign(this, parseResult);
    }

}


Dictionary.extend = require("./lib/extend");
Dictionary.serialize = require("./lib/serialize");


Dictionary.getTypeChecker = function() { return PropTypes.dictionary(this); };

Dictionary.setSchema = createStaticSetter("setSchema", "schema", symbols.schema, Dictionary);
Dictionary.setDefaults = createStaticSetter("setDefaults", "defaults", symbols.defaults, Dictionary);

Dictionary[symbols.schema] = {};
Dictionary[symbols.defaults] = {};


module.exports = Dictionary;