"use strict";

var Immutable;

const PropTypes = require("./PropTypes");
const ImmutableBase = require('./ImmutableBase');

const Errors = require("./lib/Errors");
const createStaticSetter = require("./lib/createStaticSetter");
const parseDictionary = require("./lib/parseDictionary");
const symbols = require('./lib/symbols');

const ImmutableDictionary = module.exports = ImmutableBase.extend("ImmutableDictionary", function(data) {

    Immutable = Immutable || require('immutable') || global.Immutable;
    if (Immutable == null) { throw Errors.immutableJsUnavailable(); }

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
        this[symbols.underlyingIterable] = Immutable.Map(parseResult);
    }

});

ImmutableDictionary.setSchema = createStaticSetter("setSchema", "schema", symbols.schema, ImmutableDictionary);
ImmutableDictionary.setDefaults = createStaticSetter("setDefaults", "defaults", symbols.defaults, ImmutableDictionary);

ImmutableDictionary[symbols.schema] = {};
ImmutableDictionary[symbols.defaults] = {};

ImmutableDictionary.prototype.set = function(key, value, errorCallback) {
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

ImmutableDictionary.getTypeChecker = function() {
    return PropTypes.immutableDictionary(this);
};
