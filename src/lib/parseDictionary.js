
const Errors = require("./Errors");

module.exports = function parseDictionary(schema, defaults, data, dictionaryName) {

    if (data == null || data instanceof Object === false) {
        throw Errors.dictionaryNoData(dictionaryName);
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

            let error = schema[prop](cleanedData, prop, dictionaryName);
            if (error) {
                return error;
            }
        }
    }

    return cleanedData;

};