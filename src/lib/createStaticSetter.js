
const Errors = require("./Errors");

module.exports = (name, valueName, valueSymbol, ownerClass) => {
    // TODO: Tests

    let flagSymbol = global.Symbol ? Symbol(`${valueName}_wasSet`) : `@@${valueName}_wasSet_s4yAMAsweUm6Nq`;

    return function(value) {
        if (value == null) {
            throw Errors.staticSetterNoArgument(this.name, name);
        } else if (this.hasOwnProperty(flagSymbol)) {
            throw Errors.staticSetterSecondCall(this.name, name);
        } else if (this.hasOwnProperty(valueName)) {
            throw Errors.staticSetterPropertyPresent(this.name, name, valueName);
        } else if (this === ownerClass) {
            throw Errors.staticSetterCalledOnBaseClass(this.name, name);
        } else {
            this[valueSymbol] = value;
            Object.defineProperty(this, flagSymbol, {
                value:        true,
                enumerable:   false,
                configurable: false,
                writable:     false
            });
        }


        // Validate static object extensions (not deep)

        let staticObject = this.constructor[valueSymbol];
        let superProtorype = Object.getPrototypeOf(this.constructor.prototype);
        let superStaticObject = superProtorype && superProtorype.constructor[valueSymbol];

        if (superStaticObject instanceof Object) {
            for (let key in superStaticObject) {
                if (superStaticObject.hasOwnProperty(key)) {
                    let staticValue = staticObject[key];
                    let superStaticValue = superStaticObject[key];
                    if (superStaticValue != null && staticValue == null) {
                        throw Errors.extensionNoKeyInChildStaticObject(
                            valueName,
                            key,
                            superProtorype.constructor.name,
                            this.constructor.name
                        );
                    }
                    if (typeof staticValue !== typeof superStaticValue) {
                        throw Errors.extensionDifferentTypeOfKeyInChildStaticObject(
                            valueName,
                            key,
                            typeof superStaticValue,
                            typeof staticValue,
                            superProtorype.constructor.name,
                            this.constructor.name
                        );
                    }
                    if (typeof superStaticValue === "function" && staticValue instanceof superStaticValue === false) {
                        throw Errors.extensionOwerridenKeyWithNotInstance(
                            valueName,
                            key,
                            superStaticObject.constructor.name,
                            superProtorype.constructor.name,
                            this.constructor.name
                        );
                    }
                }
            }
        }

        return this;
    };

};

