"use strict";

module.exports = function validateExtentionStaticPropery(objectKey) {

    let staticObject = this.constructor[objectKey];
    let superProtorype = Object.getPrototypeOf(this.constructor.prototype);

    if (superProtorype == null) {
        return;
    }

    let superStaticObject = superProtorype.constructor[objectKey];

    if (superStaticObject instanceof Object) {
        for (let key in superStaticObject) {
            if (superStaticObject.hasOwnProperty(key)) {
                let staticValue = staticObject[key];
                let superStaticValue = superStaticObject[key];
                if (superStaticValue != null && staticValue == null) {
                    throw new Error(`Incorrect extension: didn't found key “${key}” in static propery object “${objectKey}” of class “${this.constructor.name}”, that extends class “${superProtorype.constructor.name}”`);
                }
                if (typeof staticValue !== typeof superStaticValue) {
                    throw new Error(`Incorrect extension: tried to override key “${key}” of type ${typeof superStaticValue} with key of type ${typeof staticValue} in static propery object “${objectKey}” of class “${this.constructor.name}”, that extends class “${superProtorype.constructor.name}”`);
                }
                if (typeof superStaticValue === "object" && typeof superStaticObject.constructor === "function" && staticValue instanceof superStaticObject.constructor === false) {
                    throw new Error(`Incorrect extension: tried to override property “${key}” with not an instance of ${superStaticObject.constructor} in static propery object “${objectKey}” of class “${this.constructor.name}”, that extends class “${superProtorype.constructor.name}”`);
                }
                staticObject[key] = superStaticValue;
            }
        }
    }

    validateExtentionStaticPropery.call(superProtorype, objectKey);

};