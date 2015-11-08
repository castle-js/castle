var path = require("path");
var webpack = require("webpack");

var isProduction = process.env.isProduction === "true";

module.exports = {
    context: __dirname + "/src",
    entry: {
        castle: [
            isProduction === false ? "webpack/hot/dev-server" : null,
            "./castle"
        ].filter(function(e) { return e != null})
    },
    output: {
        library: "Castle",
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name].js",
        chunkFilename: "[name].js",
        sourceMapFilename: "debugging/[file].map",
        libraryTarget: "umd",
        pathinfo: !isProduction
    },
    target: "web",
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel?stage=0"
            },
            {
                test: /\.ts$/,
                include: [
                    path.join(__dirname, "src")
                ],
                loader: "ts"
            }
        ]
    },
    devtool: isProduction
        ? null
        : "source-map",
    debug: false,
    resolveLoader: {
        root:  path.join(__dirname, "node_modules")
    },
    externals: isProduction
        ? [ "immutable" ]
        : [],
    resolve: {
        root: root,
        modulesDirectories: ["node_modules", "."],
        extensions: ["", ".js", ".ts"]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__:       !isProduction,
            __PRODUCTION__: isProduction
        })
    ],
    devServer: {
        stats: {
            cached: false,
            exclude: []
        },
        host: process.env.host || "localhost",
        port: process.env.port || 8887
    }

};

if (process.argv.join().indexOf("--no-errors") >= 0) {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.NoErrorsPlugin()
    ]);
}

if (isProduction) {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: [ "ImmutableBase", "Collection", "Collection" ]
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
}
