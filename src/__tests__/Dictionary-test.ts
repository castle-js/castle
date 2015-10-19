"use strict";

import checkers from "./_castleCheckers";
import Castle from "castle";

describe("Dictionary", function() {

    describe("initialization", () => {

        class Person extends Castle.Dictionary {
            static schema = {
                name: Castle.PropTypes.string
            }
        }

        const checkInitializationSuccess = checkers.checkInitializationSuccess.bind(null, Person);
        const checkInitializationFail    = checkers.checkInitializationFail.bind(null, Person);

        it("should accept valid data", () => {
            checkInitializationSuccess(
                { name: "Andrey" },
                person => expect(person.get("name")).toEqual("Andrey")
            );
        });

        it("should deny invalid data", () => {
            checkInitializationFail(
                { name: 5 },
                "Invalid prop `name` of type `number` supplied to `Person`, expected `string`."
            );
        });

        it("should deny incomplete data", () => {
            checkInitializationFail(
                {},
                "Required prop `name` was not specified in `Person`."
            );
        });

        it("should throw on no argument", () => {
            expect(() => new Person(null)).toThrowError(
                "No data provided in Dictionary constructor"
            );
            expect(() => Person.serialize(null)).toThrowError(
                "No data provided in Dictionary constructor"
            );
        });

    });

    describe("setShema method", () => {

        class Duck extends Castle.Dictionary {}

        let returnValue = Duck.setSchema({
            eyes: Castle.PropTypes.number
        });

        it("should return class constructor", () => {
            expect(returnValue).toBe(Duck);
        });

        it("should set shema", () => {
            expect((new Duck({ eyes: 2 })).get("eyes")).toEqual(2);
        });

        it("should throw on attempting when called twice", () => {
            expect(() => Duck.setSchema({})).toThrowError(
                "Attempted to call `setSchema` twice on `Duck`"
            );
        });

        it("should throw on attempting when called on class with `shema` static prop", () => {
            class DuckWithStatic extends Castle.Dictionary {
                static schema = {}
            }
            expect(() => DuckWithStatic.setSchema({})).toThrowError(
                "Attempted to call `setSchema` on class `DuckWithStatic` that aleady has `shema` static property"
            );
        });

        it("should throw error when calling on Dictionary itself", () => {
            expect(() => Castle.Dictionary.setSchema({})).toThrowError(
                "Attempted to call `setSchema` on `Dictionary` itself"
            );
        });

    });

});
