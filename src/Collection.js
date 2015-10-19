"use strict";

const Immutable = require("immutable");

const PropTypes = require("./PropTypes");

const CBase = require('./CBase');
const Dictionary = require("./Dictionary");

const createStaticSetter = require("./lib/createStaticSetter");

const symbols = {
    serializing:        require('./symbols').serializing,
    underlyingIterable: require('./symbols').underlyingIterable,
    serializationError: require('./symbols').serializationError,
    skipInit:           global.Symbol ? Symbol("skipInit") : "@@skipInit_sZVH9hN8JUZRJH",
    type:               global.Symbol ? Symbol("type")     : "@@type_RaW6LsdMQE9DcE"
};


const Collection = module.exports = CBase.extend(function Collection(objects) {

    if (this.constructor[symbols.skipInit]) {
        return;
    }

    if (this.constructor.hasOwnProperty("type")) {
        let type = this.constructor.type;
        delete this.constructor.type;
        this.constructor.setType(type);
    }

    // XXX
    let dictionaryConstructor = this.constructor[symbols.type] || {};

    let metError  = null;

    if (objects == null || Array.isArray(objects) === false) {
        throw new Error("No data provided in Collection constructor");
    }
    if (typeof dictionaryConstructor !== "function" || dictionaryConstructor.prototype instanceof Dictionary === false && dictionaryConstructor !== Dictionary) {
        throw new Error("`type` static propry must be a Dictionary constructor");
    }

    for (let i = 0; i < objects.length; i++) {

        switch(true) {
            case objects[i] instanceof dictionaryConstructor:
                break;
            default:
                if (objects.__environment != null) {
                    let e = objects.__environment;
                    metError = PropTypes.dictionary(dictionaryConstructor)(objects, i, e.componentName, e.location, `${e.propFullName}[${i}]`);
                } else {
                    metError = PropTypes.dictionary(dictionaryConstructor)(objects, i, this.constructor.name);
                }
                break;
        }

        if (metError != null) {
            break;
        }

    }

    if(metError) {
        if (this.constructor[symbols.serializing] === true) {
            this[symbols.serializationError] = metError;
        } else {
            throw metError;
        }
    } else {
        this[symbols.underlyingIterable] = Immutable.List(objects);
    }

});

Collection[symbols.type] = Dictionary;

Collection.setType = createStaticSetter("setType", "type", symbols.type, Collection);

Collection.prototype.set = function(index, value, errorCallback) {

    let error = PropTypes.dictionary(this.constructor.type)(arguments, 1, this.constructor.type.name);
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
