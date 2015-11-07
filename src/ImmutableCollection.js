"use strict";

var Immutable;

const PropTypes = require("./PropTypes");
const ImmutableBase = require('./ImmutableBase');
const ImmutableDictionary = require("./ImmutableDictionary");

const createStaticSetter = require("./lib/createStaticSetter");
const parseCollection = require("./lib/parseCollection");
const Errors = require("./lib/Errors");
const symbols = require('./lib/symbols');

const ImmutableCollection = module.exports = ImmutableBase.extend("ImmutableCollection", function (objects) {

    Immutable = Immutable || require('immutable') || global.Immutable;
    if (Immutable == null) { throw Errors.immutableJsUnavailable(); }

    if (this.constructor[symbols.skipInit]) {
        return;
    }

    if (this.constructor.hasOwnProperty("type")) {
        let type = this.constructor.type;
        delete this.constructor.type;
        this.constructor.setType(type);
    }

    let dictionaryConstructor = this.constructor[symbols.dictionaryType];

    if (typeof dictionaryConstructor !== "function" || dictionaryConstructor.prototype instanceof ImmutableDictionary === false && dictionaryConstructor !== ImmutableDictionary) {
        throw Errors.iCollectionNoTypeDefined(this.constructor.name);
    }

    let parseResult = parseCollection(dictionaryConstructor, objects, this.constructor.name);
    if(parseResult instanceof Error) {
        if (this.constructor[symbols.serializing] === true) {
            this[symbols.serializationError] = parseResult;
        } else {
            throw parseResult;
        }
    } else {
        this[symbols.underlyingIterable] = Immutable.List(parseResult);
    }

});

ImmutableCollection[symbols.dictionaryType] = ImmutableDictionary;

ImmutableCollection.setType = createStaticSetter("setType", "type", symbols.dictionaryType, ImmutableCollection);

ImmutableCollection.getTypeChecker = function() {
    return PropTypes.immutableCollection(this);
};

ImmutableCollection.prototype.set = function(index, value, errorCallback) {

    let error = PropTypes.immutableDictionary(this.constructor.type)(arguments, 1, this.constructor.type.name);
    if (error) {
        typeof errorCallback === "function" && errorCallback(error);
        return this;
    }

    this.constructor[symbols.skipInit] = true;
    let newInstance = new this.constructor();
    this.constructor[symbols.skipInit] = false;
    newInstance[symbols.underlyingIterable] = this[symbols.underlyingIterable].set(index, arguments[1]);
    return newInstance;

};
