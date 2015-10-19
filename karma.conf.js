var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

delete webpackConfig.output;
delete webpackConfig.devServer;
delete webpackConfig.entry;
//webpackConfig.plugins.push(require("karma-webpack"))

module.exports = function (config) {
    config.set({

        browsers: [ "Chrome", "PhantomJS2" ],

        singleRun: true,

        frameworks: [ "jasmine" ],

        files: [
            "src/__tests__/*-test.*"
        ],

        preprocessors: {
            "src/__tests__/*": [ "webpack" ]
        },

        reporters: [ "progress" ],

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        }

    });
};
