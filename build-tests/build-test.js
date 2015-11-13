"use strict";

var Castle = require("../dist/castle");

describe("Castle", function() {

    it("should be bundled with Dictionary", function() {
        expect(typeof Castle.Dictionary).toEqual("function");
    });

    it("should be bundled with Collection", function() {
        expect(typeof Castle.Collection).toEqual("function");
    });

    it("should be bundled with PropTypes", function() {
        expect(typeof Castle.PropTypes).toEqual("object");
    });

    it("souldn't mangle Dictionary name with Uglify.js", function() {
        expect(Castle.Dictionary.name).toEqual("Dictionary");
    });

    it("souldn't mangle Collection name with Uglify.js", function() {
        expect(Castle.Collection.name).toEqual("Collection");
    });

});