
function getSerializationResult(Constructor: typeof Castle.AbstractImmutable, data: any): {
    error:         Error,
    instance:      Castle.AbstractImmutable,
    returnedValue: Castle.AbstractImmutable
} {

    let result = {
        error:         null,
        instance:      null,
        returnedValue: null
    };
    result.returnedValue = Constructor.serialize(
        data,
        (error: Error)     => result.error = error,
        (instance: Castle.AbstractImmutable) => result.instance = instance
    );
    return result;
}

export default {
    checkInitializationSuccess: (Constructor: typeof Castle.AbstractImmutable, data: any, okCallback: ((instance: Castle.AbstractImmutable) => void)) => {

        let result = getSerializationResult(Constructor, data);
        expect(result.error).toBeNull();
        expect(result.instance).toBe(result.returnedValue);

        let person;

        expect(() => {
            person = new Constructor(data);
            expect(person.deepEqual(result.instance)).toBeTruthy();
        }).not.toThrowError();

        okCallback && okCallback(person)

    },

    checkInitializationFail: (Constructor: typeof Castle.AbstractImmutable, data: any, errorText: string, safeInitializationErrorText: string) => {

        safeInitializationErrorText = safeInitializationErrorText || errorText;

        let result = getSerializationResult(Constructor, data);
        expect(result.error).toEqual(new Error(safeInitializationErrorText));
        expect(result.instance).toBeNull();
        expect(result.returnedValue).toBeNull();

        expect(() => new Constructor(data)).toThrowError(errorText);

    }
}
