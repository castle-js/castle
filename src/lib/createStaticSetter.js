
module.exports = (name, valueName, valueSymbol, ownerClass) => {

    let flagSymbol = global.Symbol ? Symbol(`${valueName}_wasSet`) : `@@${valueName}_wasSet_s4yAMAsweUm6Nq`;

    return function(value) {
        if (value === undefined) {
            throw new Error(`${this.name}.${name}: argument wasn't provided`);
        } else if (this.hasOwnProperty(flagSymbol)) {
            throw new Error(`Attempted to call \`${name}\` twice on \`${this.name}\``)
        } else if (value == null) {
            throw new Error(`${this.name}.${name}: no argument provided`);
        } else if (this.hasOwnProperty(valueName)) {
            throw new Error(`Attempted to call \`${name}\` on class \`${this.name}\` that aleady has \`shema\` static property`)
        } else if (this === ownerClass) {
            throw new Error(`Attempted to call \`${name}\` on \`${ownerClass.name}\` itself`)
        } else {
            this[valueSymbol] = value;
            Object.defineProperty(this, flagSymbol, {
                value:        true,
                enumerable:   false,
                configurable: false,
                writable:     false
            });
            return this;
        }
    };

};