"use strict";

var Castle = require("../dist/castle");

describe("Castle", function() {

    it("should be bundled with ImmutableDictionary", function() {
        expect(typeof Castle.ImmutableDictionary).toEqual("function");
    });

    it("should be bundled with Collection", function() {
        expect(typeof Castle.Collection).toEqual("function");
    });

    it("should be bundled with PropTypes", function() {
        expect(typeof Castle.PropTypes).toEqual("object");
    });

    it("souldn't mangle ImmutableBase name with Uglify.js", function() {
        expect(Castle.ImmutableDictionary.prototype.__proto__.constructor.name).toEqual("ImmutableBase");
    });

    it("souldn't mangle ImmutableDictionary name with Uglify.js", function() {
        expect(Castle.ImmutableDictionary.name).toEqual("ImmutableDictionary");
    });

    it("souldn't mangle Collection name with Uglify.js", function() {
        expect(Castle.Collection.name).toEqual("Collection");
    });

    it("should work", function() {
        var C = Castle.ImmutableDictionary.extend({
           schema: {
               p: Castle.PropTypes.string
           }
        });
        var c = new C({ p: "ok" });
        expect(c.get("p")).toEqual("ok");
    });

});