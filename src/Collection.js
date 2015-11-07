
const symbols = require("./lib/symbols");
const createStaticSetter = require("./lib/createStaticSetter");

function Collection() {}

Collection.prototype = Object.create(Array.prototype, {
    constructor: {
        value: Collection,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
Collection.extend = require("./lib/extend");
Collection.serialize = require("./lib/serialize");
Collection.setType = createStaticSetter("setType", "type", symbols.type, Collection);

module.exports = Collection;