
const Errors = require("./Errors");

module.exports = function parseCollection(dictionaryConstructor, objects, collectionName) {

    if (objects == null || Array.isArray(objects) === false) {
        throw Errors.collectionNoData(collectionName);
    }

    let metError  = null;

    for (let i = 0; i < objects.length; i++) {

        switch(true) {
            case objects[i] instanceof dictionaryConstructor:
                break;
            default:
                if (objects.__environment != null) {
                    let e = objects.__environment;
                    metError = dictionaryConstructor.getTypeChecker()(objects, i, e.componentName, e.location, `${e.propFullName}[${i}]`);
                } else {
                    metError = dictionaryConstructor.getTypeChecker()(objects, i, collectionName);
                }
                break;
        }

        if (metError != null) {
            return metError
        }

    }

    return objects;

};