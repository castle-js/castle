
const symbols = require("./lib/symbols");
const createStaticSetter = require("./lib/createStaticSetter");

function Dictionary() {}

Dictionary.extend = require("./lib/extend");
Dictionary.serialize = require("./lib/serialize");
Dictionary.setSchema = createStaticSetter("setSchema", "schema", symbols.schema, Dictionary);
Dictionary.setDefaults = createStaticSetter("setDefaults", "defaults", symbols.defaults, Dictionary);

module.exports = Dictionary;