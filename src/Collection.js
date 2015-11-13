
const Dictionary = require("./Dictionary");
const PropTypes = require("./PropTypes");

const Errors = require("./utils/Errors");
const Symbols = require("./utils/Symbols");
const createStaticSetter = require("./utils/createStaticSetter");
const parseCollection = require("./utils/parseCollection");

const defineConvenienceGetters = object => {
    object[Symbols.underlay].forEach((_, i) => {
        Object.defineProperty(object, i, {
            enumerable: true,
            get: function() { return this[Symbols.underlay][i] },
            set: () => console.warn(Errors.attemptToMutateProp(object.constructor.name, prop))
        })
    });
    Object.defineProperty(object, "length", {
        value: object[Symbols.underlay].length
    });
};

const clone = target => {
    target.constructor[Symbols.skipInit] = true;
    let newInstance = new target.constructor();
    target.constructor[Symbols.skipInit] = false;
    newInstance[Symbols.underlay] = target[Symbols.underlay].slice();
    return newInstance;
};

function Collection(objects) {

    if (this.constructor[Symbols.skipInit]) {
        return;
    }

    if (this.constructor.hasOwnProperty("type")) {
        let type = this.constructor.type;
        delete this.constructor.type;
        this.constructor.setType(type);
    }

    let dictionaryConstructor = this.constructor[Symbols.dictionaryType];

    if (typeof dictionaryConstructor !== "function"
        || dictionaryConstructor.prototype instanceof Dictionary === false
        && dictionaryConstructor !== Dictionary)
    {
        throw Errors.iCollectionNoTypeDefined(this.constructor.name);
    }

    let parseResult = parseCollection(dictionaryConstructor, objects, this.constructor.name);
    if(parseResult instanceof Error) {
        if (this.constructor[Symbols.serializing] === true) {
            this[Symbols.serializationError] = parseResult;
        } else {
            throw parseResult;
        }
    } else {
        this[Symbols.underlay] = parseResult;
        defineConvenienceGetters(this);
    }

}

Collection.extend = require("./utils/extend");
Collection.serialize = require("./utils/serialize");

Collection.getTypeChecker = function() { return PropTypes.collection(this); };

Collection.setType = createStaticSetter("setType", "type", Symbols.dictionaryType, Collection);

// XXX
Collection[Symbols.dictionaryType] = Dictionary;

Collection.prototype.deepEqual = function(collection) {
    if (!collection || !collection.constructor || collection.constructor !== this.constructor) {
        return false;
    }
    for (let i in this[Symbols.underlay]) {
        if (this[Symbols.underlay][i].deepEqual(collection[Symbols.underlay][i]) === false) {
            return false;
        }
    }
    return true;
};

Collection.prototype.get = function(key) {
    return this[Symbols.underlay][key];
};

Collection.prototype.set = function(index, value, errorCallback) {
    if (index <= this.length === false) {
        typeof errorCallback === "function"
            ? errorCallback(Errors.collectionSetBadIndex(this.constructor.name, index, this.length))
            : console.warn(Errors.collectionSetBadIndex(this.constructor.name, index, this.length));
        return this;
    }

    let error = PropTypes.dictionary(this.constructor[Symbols.dictionaryType])(arguments, 1, this.constructor[Symbols.dictionaryType].name, null, `${this.constructor.name}[${index}]`);
    if (error) {
        typeof errorCallback === "function" ? errorCallback(error) : console.warn(error);
        return this;
    }

    let newInstance = clone(this);
    newInstance[Symbols.underlay][index] = value;
    defineConvenienceGetters(newInstance);
    return newInstance;
};

Collection.prototype.slice = function() {
    let newInstance = clone(this);
    newInstance[Symbols.underlay] = Array.prototype.slice.apply(newInstance[Symbols.underlay], arguments);
    defineConvenienceGetters(newInstance);
    return newInstance;
};

Collection.prototype.pop = function() {
    let newInstance = clone(this);
    newInstance[Symbols.underlay] = Array.prototype.pop.apply(newInstance[Symbols.underlay], arguments);
    defineConvenienceGetters(newInstance);
    return newInstance;
};

Collection.prototype.forEach = function() {
    return Array.prototype.forEach.apply(this[Symbols.underlay], arguments)
};

Collection.prototype.map = function() {
    return Array.prototype.map.apply(this[Symbols.underlay], arguments)
};

Collection.prototype.filter = function() {
    return Array.prototype.filter.apply(this[Symbols.underlay], arguments)
};

Collection.prototype.sort = function() {
    return Array.prototype.sort.apply(this[Symbols.underlay], arguments)
};

Collection.prototype.reduce = function() {
    return Array.prototype.reduce.apply(this[Symbols.underlay], arguments)
};

module.exports = Collection;


/*-----------------------------------------------------------------------*/

Dictionary.createCollection = function(name, staticProps, props) {
    name = name || (
            this.name.match(/_extended$/i)
                ? "Collection_extended"
                : this.name.match(/[^$_aeiou]y$/i) ? this.name.slice(0, -1) + "ies" : this.name + (this.name.match(/(s|x|ch|sh)$/i) ? "es" : "s") + "Collection"
        );
    return Collection.extend(name, staticProps, props).setType(this);
};