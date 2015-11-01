"use strict";

const Immutable = require('immutable');

const CBase = require('./CBase');

const validateExtentionStaticPropery = require("./lib/validateExtentionStaticPropery");
const createStaticSetter = require("./lib/createStaticSetter");

const symbols = {
    serializing:        require('./symbols').serializing,
    underlyingIterable: require('./symbols').underlyingIterable,
    serializationError: require('./symbols').serializationError,
    skipInit:           global.Symbol ? Symbol("skipInit")     : "@@skipInit_kafEW2P3GCenbu",
    schema:             global.Symbol ? Symbol("schema")       : "@@schema_wWacoLy2grQ4zh",
    defaults:           global.Symbol ? Symbol("defaults")     : "@@defaults_yiccdDv3wNTV3T"
};


const Dictionary = module.exports = CBase.extend("Dictionary", function(data) {

    if (this.constructor[symbols.skipInit]) {
        return
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

    validateExtentionStaticPropery.call(this.constructor.prototype, symbols.schema);
    validateExtentionStaticPropery.call(this.constructor.prototype, symbols.defaults);

    // XXX
    let schema   = this.constructor[symbols.schema] || {};
    let defaults = this.constructor[symbols.defaults] || {};

    if (schema instanceof Object === false) {
        throw new Error(`\`${this.name}\`: schema is undefined or not an object`);
    }

    if (data == null || data instanceof Object === false) {
        throw new Error("No data provided in Dictionary constructor");
    }

    let cleanedData = {};

    for (let prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            if (data[prop] == null) {
                if (defaults[prop] != null) {
                    cleanedData[prop] = defaults[prop];
                }
            } else {
                cleanedData[prop] = data[prop];
            }

            let error = schema[prop](cleanedData, prop, this.constructor.name);
            if (error) {
                if (this.constructor[symbols.serializing] === true) {
                    this[symbols.serializationError] = error;
                    return;
                } else {
                    throw error;
                }
            }
        }
    }

    this[symbols.underlyingIterable] = Immutable.Map(cleanedData);

});

Dictionary.setSchema = createStaticSetter("setSchema", "schema", symbols.schema, Dictionary);
Dictionary.setDefaults = createStaticSetter("setDefaults", "defaults", symbols.defaults, Dictionary);

Dictionary[symbols.schema] = {};
Dictionary[symbols.defaults] = {};

Dictionary.prototype.set = function(key, value, errorCallback) {
    let prop = this.constructor.schema[key];

    if (prop == null) {
        return this;
    }

    let error = prop([value], 0, this.constructor.name, null, key);
    if (error) {
        typeof errorCallback === "function" && errorCallback(error);
        return this;
    }

    this.constructor[symbols.skipInit] = true;
    let newInstance = new this.constructor();
    this.constructor[symbols.skipInit] = false;
    newInstance[symbols.underlyingIterable] = this[symbols.underlyingIterable].set(key, value);
    return newInstance;
};

