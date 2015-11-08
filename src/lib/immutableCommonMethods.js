
const symbols = require("./symbols");

module.exports = {

    get: function(key, notSetValue) {
        return this[symbols.underlyingIterable].get(key, notSetValue);
    },

    equals: function(c) {
        return this[symbols.underlyingIterable].equals(c[symbols.underlyingIterable]);
    },

    toMap: function() {
        return this[symbols.underlyingIterable].toMap();
    }

};
