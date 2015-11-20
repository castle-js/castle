const Errors = require("./Errors");

module.exports = function(schema, data) {

    if (data == null || data instanceof Object === false) {
        return Errors.dictionaryNoData(schema._name);
    }

    for (let prop in schema._definition) {
        if (schema._definition.hasOwnProperty(prop)) {
            if (data[prop] == null && schema._defaults[prop] != null) {
                data[prop] = schema._defaults[prop];
            }

            let error = schema._definition[prop](data, prop, schema._name);
            if (error) {
                return error;
            }
        }
    }

    return data;

};