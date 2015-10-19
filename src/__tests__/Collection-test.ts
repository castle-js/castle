/// <reference path="../../typings/Castle.d.ts" />

import checkers from "./_castleCheckers";

import Castle from "castle";


describe("Collections", () => {

    describe("initialization", () => {

        class Car extends Castle.Dictionary {
            static schema = {
                wheels: Castle.PropTypes.number
            }
        }

        class Cars extends Castle.Collection {
            static type = Car;
        }

        const checkInitializationSuccess = checkers.checkInitializationSuccess.bind(null, Cars);
        const checkInitializationFail = checkers.checkInitializationFail.bind(null, Cars);

        it("should accept valid data", () => {
            checkInitializationSuccess(
                [{ wheels: 5 }],
                cars => expect(cars.get(0).get("wheels")).toEqual(5)
            );
        });

        it("should accept empty data", () => {
            checkInitializationSuccess([]);
        });

        it("should deny invalid data", () => {
            checkInitializationFail(
                [{ wheels: /2/ }],
                "Invalid prop `wheels` of type `regexp` supplied to `Car`, expected `number`."
            );
        });

        it("should throw on no argument", () => {
            expect(() => new Cars(null)).toThrowError(
                "No data provided in Collection constructor"
            );
            expect(() => Cars.serialize(null)).toThrowError(
                "No data provided in Collection constructor"
            );
        });

    });

});
