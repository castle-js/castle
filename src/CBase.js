
const symbols = require('./symbols');

function CBase() {}
module.exports = CBase;

CBase.extend = require('./lib/extend');

CBase.serialize = function(data, errorCallback, doneCallback) {

    this[symbols.serializing] = true;
    let instance = new this(data);
    this[symbols.serializing] = false;

    if (instance[symbols.serializationError] != null) {
        typeof errorCallback === "function" && errorCallback(instance[symbols.serializationError]);
        return null;
    } else {
        typeof doneCallback === "function" && doneCallback(instance);
        return instance;
    }

};

CBase.prototype.get = function(key, notSetValue) {
    return this[symbols.underlyingIterable].get(key, notSetValue);
};

CBase.prototype.equals = function(c) {
    return this[symbols.underlyingIterable].equals(c[symbols.underlyingIterable]);
};

CBase.prototype.toMap = function() {
    return this[symbols.underlyingIterable].toMap();
};
