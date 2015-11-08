
const Dictionary = require("./Dictionary");

const Errors = require("./lib/Errors");
const symbols = require("./lib/symbols");
const createStaticSetter = require("./lib/createStaticSetter");
const parseCollection = require("./lib/parseCollection");

function Collection(objects) {

    if (this.constructor.hasOwnProperty("type")) {
        let type = this.constructor.type;
        delete this.constructor.type;
        this.constructor.setType(type);
    }

    let dictionaryConstructor = this.constructor[symbols.dictionaryType];

    if (typeof dictionaryConstructor !== "function" || dictionaryConstructor.prototype instanceof Dictionary === false && dictionaryConstructor !== Dictionary) {
        throw Errors.iCollectionNoTypeDefined(this.constructor.name);
    }

    let parseResult = parseCollection(dictionaryConstructor, objects, this.constructor.name);
    if(parseResult instanceof Error) {
        if (this.constructor[symbols.serializing] === true) {
            this[symbols.serializationError] = parseResult;
        } else {
            throw parseResult;
        }
    } else {
        Object.assign(this, parseResult);
        this.length = parseResult.length; // ]:->
    }

}

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
Collection.setType = createStaticSetter("setType", "type", symbols.dictionaryType, Collection);

module.exports = Collection;