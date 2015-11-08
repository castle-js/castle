
var Immutable;

const objectAssign = require("object-assign");

const PropTypes = require("./PropTypes");
const Collection = require("./Collection");
const ImmutableDictionary = require("./ImmutableDictionary");

const Errors = require("./lib/Errors");
const symbols = require('./lib/symbols');
const immutableCommonMethods = require('./lib/immutableCommonMethods');
const createStaticSetter = require("./lib/createStaticSetter");
const parseCollection = require("./lib/parseCollection");


function ImmutableCollection() {
    Collection.apply(this, arguments);
}
module.exports = ImmutableCollection;


ImmutableCollection.extend = require("./lib/extend");
ImmutableCollection.serialize = require("./lib/serialize");

ImmutableCollection[symbols.assertDictionaryTypeValid] = dictionaryConstructor => {
    if (typeof dictionaryConstructor !== "function"
        || dictionaryConstructor.prototype instanceof ImmutableDictionary === false
        && dictionaryConstructor !== ImmutableDictionary)
    {
        throw Errors.iCollectionNoTypeDefined(this.constructor.name);
    }
};

ImmutableCollection.getTypeChecker = function() { return PropTypes.collection(this); };

ImmutableCollection.setType = createStaticSetter("setType", "type", symbols.dictionaryType, ImmutableCollection);

ImmutableCollection[symbols.dictionaryType] = ImmutableDictionary;


objectAssign(ImmutableCollection.prototype, immutableCommonMethods);


ImmutableCollection.prototype[symbols.saveValidatedData] = function(data) {
    Immutable = Immutable || require('immutable') || global.Immutable;
    if (Immutable == null) { throw Errors.immutableJsUnavailable(); }
    this[symbols.underlyingIterable] = Immutable.List(data);
};


ImmutableCollection.prototype.set = function(index, value, errorCallback) {

    let error = PropTypes.immutableDictionary(this.constructor.type)(arguments, 1, this.constructor.type.name);
    if (error) {
        typeof errorCallback === "function" && errorCallback(error);
        return this;
    }

    this.constructor[symbols.skipInit] = true;
    let newInstance = new this.constructor();
    this.constructor[symbols.skipInit] = false;
    newInstance[symbols.underlyingIterable] = this[symbols.underlyingIterable].set(index, arguments[1]);
    return newInstance;

};
