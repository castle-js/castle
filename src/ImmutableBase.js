
const symbols = require("./lib/symbols");

function ImmutableBase() {}

ImmutableBase.extend = require("./lib/extend");

ImmutableBase.serialize = require("./lib/serialize");

ImmutableBase.prototype.get = function(key, notSetValue) {
    return this[symbols.underlyingIterable].get(key, notSetValue);
};

ImmutableBase.prototype.equals = function(c) {
    return this[symbols.underlyingIterable].equals(c[symbols.underlyingIterable]);
};

ImmutableBase.prototype.toMap = function() {
    return this[symbols.underlyingIterable].toMap();
};

module.exports = ImmutableBase;
