
const symbols = require('./symbols');

module.exports = function(data, errorCallback, doneCallback) {

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