/// <reference path="../../typings/Castle.d.ts" />

import checkers from "./_castleCheckers";

import { ImmutableDictionary, ImmutableCollection, PropTypes } from "castle";

describe("Collections", () => {

    describe("initialization", () => {

        class Car extends ImmutableDictionary {
            static schema = {
                wheels: PropTypes.number
            }
        }

        class Cars extends ImmutableCollection {
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

        it("should throw error on no argument", () => {
            expect(() => new Cars(null)).toThrowError(
                "No data provided for “Cars” Collection"
            );
            expect(() => Cars.serialize(null)).toThrowError(
                "No data provided for “Cars” Collection"
            );
        });

    });

});
