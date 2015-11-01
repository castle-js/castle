"use strict";

const isSupportedFunctionName = (() => {
    function test() {}
    return test.name === "test";
});

module.exports = isSupportedFunctionName
    ? function(fn) { return fn.name }
    : function(fn) { return (fn.toString().match(/^function\s*([^\s(]+)/) || [])[1]; };