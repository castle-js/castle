
module.exports = function() {

    let args = Array.prototype.slice.call(arguments);
    let superClass = this;
    let pureConstructor;
    let name;
    let staticProps;
    let props;

    if (typeof args[0] === "string") {
        name = args.splice(0, 1)[0];
    }
    if (typeof args[0] === "function") {
        pureConstructor = args.splice(0, 1)[0];
        name = name || pureConstructor.name;
    }
    if (typeof args[0] === "object") {
        staticProps = args.splice(0, 1)[0];
        if (typeof staticProps["props"] === "object") {
            props = staticProps["props"];
            staticProps["props"] = undefined;
        }
    }
    if (!props && typeof args[0] === "object") {
        props = args.splice(0, 1)[0];
    }

    pureConstructor = pureConstructor || function() {};
    name = name || ((superClass.name || "ANONYMOUS") + "__extended");
    props = props || {};
    staticProps = staticProps || {};

    if (args[0] !== undefined) {
        console.error("Too much arguments given in ")
    }

    let subClass = new Function(
        `return function (pureConstructor, superClass, props) {
            return function ${name} () {
                superClass.apply(this, arguments);
                pureConstructor.apply(this, arguments);
                for (var p in props) if (props.hasOwnProperty(p)) this[p] = props[p];
            };
        };`
    )()(pureConstructor, superClass, props);

    for (let p in superClass) { // TypeScript competible
        if (superClass.hasOwnProperty(p)) subClass[p] = superClass[p];
    }
    for (let p in staticProps) {
        if (staticProps.hasOwnProperty(p)) subClass[p] = staticProps[p];
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    return subClass;
};
