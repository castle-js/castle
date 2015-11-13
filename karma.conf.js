"use strict";

module.exports = function (config) {
    config.set({

        browsers: process.env.browsers && process.env.browsers.split(',') || [ "PhantomJS2" ],

        singleRun: true,

        frameworks: [ "jasmine" ],

        files: [
            "src/__tests__/*-test.*"
        ],

        preprocessors: {
            "src/__tests__/*": [ "webpack" ]
        },

        reporters: [ "progress" ],

        webpack: require("./webpack.config.js"),

        webpackServer: {
            noInfo: true
        },

        customLaunchers: {
            'IE9': {
                base: 'VirtualBoxBrowser',
                config: {
                    vm_name: 'IE9 - Win7'
                }
            }
        }

    });
};
