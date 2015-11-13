"use strict";

const PropTypes = require("../PropTypes");
const Dictionary = require("../Dictionary");
const Collection = require("../Collection");

const requiredMessage = "Required prop `testProp` was not specified in `testComponent`.";

function typeCheckFail(declaration, value, message) {
    var props = {testProp: value};
    var error = declaration(
        props,
        "testProp",
        "testComponent",
        "prop"
    );
    expect(error instanceof Error).toBe(true);
    expect(error.message).toBe(message);
}

function typeCheckPass(declaration, value) {
    var props = {testProp: value};
    var error = declaration(
        props,
        "testProp",
        "testComponent",
        "prop"
    );
    expect(error).toBe(null);
}

describe("PropTypes", function() {

    describe("Primitive Types", function() {
        it("should warn for invalid strings", function() {
            typeCheckFail(
                PropTypes.string,
                [],
                "Invalid prop `testProp` of type `array` supplied to " +
                "`testComponent`, expected `string`."
            );
            typeCheckFail(
                PropTypes.string,
                false,
                "Invalid prop `testProp` of type `boolean` supplied to " +
                "`testComponent`, expected `string`."
            );
            typeCheckFail(
                PropTypes.string,
                0,
                "Invalid prop `testProp` of type `number` supplied to " +
                "`testComponent`, expected `string`."
            );
            typeCheckFail(
                PropTypes.string,
                {},
                "Invalid prop `testProp` of type `object` supplied to " +
                "`testComponent`, expected `string`."
            );
        });

        it("should fail date and regexp correctly", function() {
            typeCheckFail(
                PropTypes.string,
                new Date(),
                "Invalid prop `testProp` of type `date` supplied to " +
                "`testComponent`, expected `string`."
            );
            typeCheckFail(
                PropTypes.string,
                /please/,
                "Invalid prop `testProp` of type `regexp` supplied to " +
                "`testComponent`, expected `string`."
            );
        });

        it("should not warn for valid values", function() {
            typeCheckPass(PropTypes.array, []);
            typeCheckPass(PropTypes.bool, false);
            typeCheckPass(PropTypes.func, function() {});
            typeCheckPass(PropTypes.number, 0);
            typeCheckPass(PropTypes.string, "");
            typeCheckPass(PropTypes.object, {});
            typeCheckPass(PropTypes.object, new Date());
            typeCheckPass(PropTypes.object, /please/);
        });

        it("should warn for missing required values", function() {
            typeCheckFail(PropTypes.string.isRequired, null, requiredMessage);
            typeCheckFail(PropTypes.string.isRequired, undefined, requiredMessage);
        });
    });

    describe("ArrayOf Type", function() {
        it("should support the arrayOf propTypes", function() {
            typeCheckPass(PropTypes.arrayOf(PropTypes.number), [1, 2, 3]);
            typeCheckPass(PropTypes.arrayOf(PropTypes.string), ["a", "b", "c"]);
        });

        it("should support arrayOf with complex types", function() {
            function Thing() {}
            typeCheckPass(
                PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
                [new Thing(), new Thing()]
            );
        });

        it("should warn with invalid items in the array", function() {
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number),
                [1, 2, "b"],
                "Invalid prop `testProp[2]` of type `string` supplied to " +
                "`testComponent`, expected `number`."
            );
        });

        it("should warn with invalid complex types", function() {
            function Thing() {}
            var name = Thing.name || "<<anonymous>>";

            typeCheckFail(
                PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
                [new Thing(), "xyz"],
                "Invalid prop `testProp[1]` of type `String` supplied to " +
                "`testComponent`, expected instance of `" + name + "`."
            );
        });

        it("should warn when passed something other than an array", function() {
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number),
                {"0": "maybe-array", length: 1},
                "Invalid prop `testProp` of type `object` supplied to " +
                "`testComponent`, expected an array."
            );
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number),
                123,
                "Invalid prop `testProp` of type `number` supplied to " +
                "`testComponent`, expected an array."
            );
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number),
                "string",
                "Invalid prop `testProp` of type `string` supplied to " +
                "`testComponent`, expected an array."
            );
        });

        it("should not warn when passing an empty array", function() {
            typeCheckPass(PropTypes.arrayOf(PropTypes.number), []);
        });

        it("should not warn for optional values", function() {
            typeCheckPass(PropTypes.arrayOf(PropTypes.number).optional, null);
            typeCheckPass(PropTypes.arrayOf(PropTypes.number).optional, undefined);
        });

        it("should warn for missing required values", function() {
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number).isRequired,
                null,
                requiredMessage
            );
            typeCheckFail(
                PropTypes.arrayOf(PropTypes.number).isRequired,
                undefined,
                requiredMessage
            );
        });
    });

    describe("Instance Types", function() {
        it("should warn for invalid instances", function() {
            function Person() {}
            function Cat() {}
            var personName = Person.name || "<<anonymous>>";
            var dateName = Date.name || "<<anonymous>>";
            var regExpName = RegExp.name || "<<anonymous>>";

            typeCheckFail(
                PropTypes.instanceOf(Person),
                false,
                "Invalid prop `testProp` of type `Boolean` supplied to " +
                "`testComponent`, expected instance of `" + personName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(Person),
                {},
                "Invalid prop `testProp` of type `Object` supplied to " +
                "`testComponent`, expected instance of `" + personName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(Person),
                "",
                "Invalid prop `testProp` of type `String` supplied to " +
                "`testComponent`, expected instance of `" + personName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(Date),
                {},
                "Invalid prop `testProp` of type `Object` supplied to " +
                "`testComponent`, expected instance of `" + dateName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(RegExp),
                {},
                "Invalid prop `testProp` of type `Object` supplied to " +
                "`testComponent`, expected instance of `" + regExpName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(Person),
                new Cat(),
                "Invalid prop `testProp` of type `Cat` supplied to " +
                "`testComponent`, expected instance of `" + personName + "`."
            );
            typeCheckFail(
                PropTypes.instanceOf(Person),
                Object.create(null),
                "Invalid prop `testProp` of type `<<anonymous>>` supplied to " +
                "`testComponent`, expected instance of `" + personName + "`."
            );
        });

        it("should not warn for valid values", function() {
            function Person() {}
            function Engineer() {}
            Engineer.prototype = new Person();

            typeCheckPass(PropTypes.instanceOf(Person), new Person());
            typeCheckPass(PropTypes.instanceOf(Person), new Engineer());

            typeCheckPass(PropTypes.instanceOf(Date), new Date());
            typeCheckPass(PropTypes.instanceOf(RegExp), /please/);
        });

        it("should not warn for optional values", function() {
            typeCheckPass(PropTypes.instanceOf(String).optional, null);
            typeCheckPass(PropTypes.instanceOf(String).optional, undefined);
        });

        it("should warn for missing required values", function() {
            typeCheckFail(
                PropTypes.instanceOf(String).isRequired, null, requiredMessage
            );
            typeCheckFail(
                PropTypes.instanceOf(String).isRequired, undefined, requiredMessage
            );
        });
    });

    describe("Dictionary Types", function() {

        it("should warn for invalid instances", function() {
            let Person = Dictionary.extend("Person");
            let Cat = Dictionary.extend("Cat");
            let Car = Dictionary.extend("Car", {
                schema: {
                    weight: PropTypes.number.optional,
                    wheels: PropTypes.number
                }
            });
            var personName = Person.name || "<<anonymous>>";

            typeCheckFail(
                Person.getTypeChecker(),
                false,
                "Invalid prop `testProp` of type `Boolean` supplied to " +
                "`testComponent`, expected instance of `" + personName + "` or an `object`."
            );
            typeCheckFail(
                Person.getTypeChecker(),
                "",
                "Invalid prop `testProp` of type `String` supplied to " +
                "`testComponent`, expected instance of `" + personName + "` or an `object`."
            );
            typeCheckFail(
                Person.getTypeChecker(),
                new Cat({}),
                "Invalid prop `testProp` of type `Cat` supplied to " +
                "`testComponent`, expected instance of `" + personName + "` or an `object`."
            );
            typeCheckFail(
                Person.getTypeChecker(),
                Object.create(null),
                "Invalid prop `testProp` of type `<<anonymous>>` supplied to " +
                "`testComponent`, expected instance of `" + personName + "` or an `object`."
            );
            typeCheckFail(
                Car.getTypeChecker(),
                {},
                "Required prop `wheels` was not specified in `Car`."
            );
        });

        it("should not warn for valid values", function() {
            let Person = Dictionary.extend("Person");
            let Engineer = Person.extend("Engineer");

            typeCheckPass(Person.getTypeChecker(), new Person({}));
            typeCheckPass(Person.getTypeChecker(), new Engineer({}));
            typeCheckPass(Person.getTypeChecker(), {});
        });

        it("should not warn for optional values", function() {
            let Person = Dictionary.extend("Person");
            typeCheckPass(Person.getTypeChecker().optional, null);
            typeCheckPass(Person.getTypeChecker().optional, undefined);
        });

        it("should warn for missing required values", function() {
            let Person = Dictionary.extend("Person");
            typeCheckFail(
                Person.getTypeChecker().isRequired, null, requiredMessage
            );
            typeCheckFail(
                Person.getTypeChecker().isRequired, undefined, requiredMessage
            );
        });

    });


    describe("Collection Types", function() {

        it("should warn for invalid instances", function() {
            let Person = Dictionary.extend("Person");
            let People = Collection.extend("People", {
                type: Person
            });
            let Deers = Collection.extend("Deers");
            var peopleName = People.name || "<<anonymous>>";
            var personName = Person.name || "<<anonymous>>";

            typeCheckFail(
                People.getTypeChecker(),
                false,
                "Invalid prop `testProp` of type `Boolean` supplied to " +
                "`testComponent`, expected instance of `" + peopleName + "` or an `array`."
            );
            typeCheckFail(
                People.getTypeChecker(),
                "",
                "Invalid prop `testProp` of type `String` supplied to " +
                "`testComponent`, expected instance of `" + peopleName + "` or an `array`."
            );
            typeCheckFail(
                People.getTypeChecker(),
                new Deers([]),
                "Invalid prop `testProp` of type `Deers` supplied to " +
                "`testComponent`, expected instance of `" + peopleName + "` or an `array`."
            );
            typeCheckFail(
                People.getTypeChecker(),
                Object.create(null),
                "Invalid prop `testProp` of type `<<anonymous>>` supplied to " +
                "`testComponent`, expected instance of `" + peopleName + "` or an `array`."
            );

            var person = new Person({});
            var arr = [person, 2];
            typeCheckFail(
                People.getTypeChecker(),
                arr,
                "Invalid prop `testProp[1]` of type `Number` supplied to " +
                "`testComponent`, expected instance of `" + personName + "` or an `object`."
            );
        });

        it("should not warn for valid values", function() {
            let People = Collection.extend("People");
            let Engineers = People.extend("Engineers");

            typeCheckPass(People.getTypeChecker(), new People([]));
            typeCheckPass(People.getTypeChecker(), new Engineers([]));
            typeCheckPass(People.getTypeChecker(), []);
        });

        it("should not warn for optional values", function() {
            let People = Collection.extend("People");
            typeCheckPass(People.getTypeChecker().optional, null);
            typeCheckPass(People.getTypeChecker().optional, undefined);
        });

        it("should warn for missing required values", function() {
            let People = Collection.extend("People");
            typeCheckFail(
                People.getTypeChecker().isRequired, null, requiredMessage
            );
            typeCheckFail(
                People.getTypeChecker().isRequired, undefined, requiredMessage
            );
        });

    })

});
