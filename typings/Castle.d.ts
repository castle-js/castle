
declare namespace Castle {

    class ImmutableBase  {

        constructor(data: {});

        static serialize(data: any, errorCb?: ((error: Error) => void), successCb?: (instance: ImmutableBase) => void): ImmutableBase;

        get: (a: String, b?: any) => any;

    }

    class ImmutableDictionary extends ImmutableBase {

        static setSchema: (schema: any) => any;

    }

    class ImmutableCollection extends ImmutableBase {

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
        array:  CanBeOptional<any>,
        bool:   CanBeOptional<any>,
        func:   CanBeOptional<any>,
        number: CanBeOptional<any>,
        object: CanBeOptional<any>,
        string: CanBeOptional<any>,

        arrayOf:             (type: Validator<any>) => CanBeOptional<any>,
        instanceOf:          (expectedClass: {}) => CanBeOptional<any>,
        //dictionary: (expectedDictionary: typeof Dictionary) => CanBeOptional<any>,
        //dollection: (expectedCollection: typeof Collection) => CanBeOptional<any>,
    };

}

declare module "castle" {
    export = Castle;
}
