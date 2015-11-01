
declare namespace Castle {

    class CBase  {

        constructor(data: {});

        static serialize(data: any, errorCb?: ((error: Error) => void), successCb?: (instance: CBase) => void): CBase;

        get: (a: String, b?: any) => any;

    }

    class Dictionary extends CBase {

        static setSchema: (schema: any) => any;

    }

    class Collection extends CBase {

        constructor(data: any[]);

    }


    /*********** PrpTypes ***********/

    interface Validator<T> {
        (object: T, key: string, componentName: string): Error;
    }

    interface CanBeOptional<T> extends Validator<T> {
        optional: Validator<T>;
    }

    var PropTypes: {
        array:        CanBeOptional<any>,
        bool:         CanBeOptional<any>,
        func:         CanBeOptional<any>,
        number:       CanBeOptional<any>,
        object:       CanBeOptional<any>,
        string:       CanBeOptional<any>,

        arrayOf:      (type: Validator<any>) => CanBeOptional<any>,
        instanceOf:   (expectedClass: {}) => CanBeOptional<any>,
        model:        (expectedDictionary: typeof Dictionary) => CanBeOptional<any>,
        collection:   (expectedCollection: typeof Collection) => CanBeOptional<any>,
    };

}

declare module "castle" {
    export = Castle;
}
