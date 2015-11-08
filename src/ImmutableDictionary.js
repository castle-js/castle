"use strict";

var Immutable;

const objectAssign = require("object-assign");

const PropTypes = require("./PropTypes");
const Dictionary = require("./Dictionary");

const Errors = require("./lib/Errors");
const symbols = require('./lib/symbols');
const immutableCommonMethods = require('./lib/immutableCommonMethods');
const createStaticSetter = require("./lib/createStaticSetter");
const parseDictionary = require("./lib/parseDictionary");


function ImmutableDictionary() {
    Dictionary.apply(this, arguments);
}
module.exports = ImmutableDictionary;


ImmutableDictionary.extend = require("./lib/extend");
ImmutableDictionary.serialize = require("./lib/serialize");

ImmutableDictionary.getTypeChecker = function() { return PropTypes.dictionary(this); };

ImmutableDictionary.setSchema = createStaticSetter("setSchema", "schema", symbols.schema, ImmutableDictionary);
ImmutableDictionary.setDefaults = createStaticSetter("setDefaults", "defaults", symbols.defaults, ImmutableDictionary);

ImmutableDictionary[symbols.schema] = {};
ImmutableDictionary[symbols.defaults] = {};


objectAssign(ImmutableDictionary.prototype, immutableCommonMethods);


ImmutableDictionary.prototype[symbols.saveValidatedData] = function(data) {
    Immutable = Immutable || require('immutable') || global.Immutable;
    if (Immutable == null) { throw Errors.immutableJsUnavailable(); }
    this[symbols.underlyingIterable] = Immutable.Map(data);
};


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
