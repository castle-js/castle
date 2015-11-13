
const Symbols = require('./Symbols');

module.exports = function(data, errorCallback, doneCallback) {

    this[Symbols.serializing] = true;
    let instance = new this(data);
    this[Symbols.serializing] = false;

    if (instance[Symbols.serializationError] != null) {
        typeof errorCallback === "function" && errorCallback(instance[Symbols.serializationError]);
        return null;
    } else {
        typeof doneCallback === "function" && doneCallback(instance);
        return instance;
    }

};