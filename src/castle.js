const PropTypes  = require("./PropTypes");
const Dictionary = require("./Dictionary");
const Collection = require("./Collection");
require("./utils/Function.name.polyfill");

export default {
    PropTypes   : PropTypes,
    Dictionary  : Dictionary,
    Collection  : Collection
};

export {
    PropTypes,
    Dictionary,
    Collection
}
