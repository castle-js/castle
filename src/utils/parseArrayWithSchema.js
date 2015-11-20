const Errors = require("./Errors");
const parseWithSchema = require("./parseWithSchema");

module.exports = function(schema, objects) {

    if (objects == null || Array.isArray(objects) === false) {
        return Errors.collectionNoData(collectionName);
    }

    let metError = null;

    for (let i = 0; i < objects.length; i++) {

        metError = parseWithSchema(schema, objects);

        if (metError) {
            return metError
        }

    }

    return objects;

};