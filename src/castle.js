require("./utils/Function.name.polyfill");

const PropTypes  = require("./PropTypes");
const Dictionary = require("./Dictionary");
const Collection = require("./Collection");
const Schema     = require("./Schema");

export default {
    PropTypes   : PropTypes,
    Dictionary  : Dictionary,
    Collection  : Collection,
    Schema      : Schema
};

export {
    PropTypes,
    Dictionary,
    Collection,
    Schema
}

