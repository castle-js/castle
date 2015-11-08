"use strict";

const ImmutableDictionary = require("../ImmutableDictionary");

describe("extend", () => {

    var Person = ImmutableDictionary.extend(
        function PersonClass() {
            this.personProp = true;
        },
        {
            personStaticProp: true,
            // XXX
            schema: {}
        },
        {
            personProp2: true
        }
    );

    var Child = Person.extend("ChildClass");

    var NoName = Person.extend(
        {
            noNameStaticProp: true
        },
        {
            noNameProp: true
        }
    );

    var child = new Child({});
    var noName = new NoName({});

    it("should create and inherit properties", () => {
        expect(
            child.get
            && child.personProp
            && child.personProp2
            && noName.noNameProp
        ).toBeTruthy();
    });

    it("should create and inherit static properties", () => {
        expect(
            Child.serialize
            && Child.personStaticProp
            && NoName.noNameStaticProp
        ).toBeTruthy();
    });

    it("should be instance of parent classes", () => {
        expect(
            child instanceof Child
            && child instanceof Person
            && child instanceof ImmutableDictionary
        ).toBeTruthy()
    });

    it("should set constructor name as a given function argument name", () => {
        expect(Person.name).toEqual("PersonClass");
    });

    it("should set constructor name as a given string argument", () => {
        expect(Child.name).toEqual("ChildClass");
    });

    it("should set recognizable name if neither function-argument nor string-argument was given", () => {
        expect(NoName.name).toEqual("PersonClass__extended");
    });

});
