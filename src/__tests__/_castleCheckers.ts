/// <reference path="../../typings/Castle.d.ts" />

function getSerializationResult(Constructor: typeof Castle.ImmutableBase, data: any): {
    error:         Error,
    instance:      Castle.ImmutableBase,
    returnedValue: Castle.ImmutableBase
} {

    let result = {
        error:         null,
        instance:      null,
        returnedValue: null
    };
    result.returnedValue = Constructor.serialize(
        data,
        (error: Error)     => result.error = error,
        (instance: Castle.ImmutableBase) => result.instance = instance
    );
    return result;
}

export default {
    checkInitializationSuccess: (Constructor: typeof Castle.ImmutableBase, data: any, okCallback: ((instance: Castle.ImmutableBase) => void)) => {

        let result = getSerializationResult(Constructor, data);
        expect(result.error).toBeNull();
        expect(result.instance).toBe(result.returnedValue);

        let person;

        expect(() => {
            person = new Constructor(data);
            expect(person.equals(result.instance)).toBeTruthy();
        }).not.toThrowError();

        okCallback && okCallback(person)

    },

    checkInitializationFail: (Constructor: typeof Castle.ImmutableBase, data: any, errorText: string, safeInitializationErrorText: string) => {

        safeInitializationErrorText = safeInitializationErrorText || errorText;

        let result = getSerializationResult(Constructor, data);
        expect(result.error).toEqual(new Error(safeInitializationErrorText));
        expect(result.instance).toBeNull();
        expect(result.returnedValue).toBeNull();

        expect(() => new Constructor(data)).toThrowError(errorText);

    }
}
