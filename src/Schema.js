
const PropTypes = require("./PropTypes");
const parseArrayWithSchema = require("./utils/parseArrayWithSchema");
const parseWithSchema = require("./utils/parseWithSchema");


function Schema(name, definition, defaults) {
    this._name = name;
    this._definition = definition;
    this._defaults = defaults;
};

Schema.prototype.parse = function(data) {

    let result = parseWithSchema(this, data);
    if (result instanceof Error) {
        throw result;
    } else {
        return result;
    }

};

Schema.prototype.parseList = function(data) {

    let result = parseArrayWithSchema(this, data);
    if (result instanceof Error) {
        throw result;
    } else {
        return result;
    }

};

module.exports = Schema;
