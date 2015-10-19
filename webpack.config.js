var path = require("path");
var webpack = require("webpack");

var isProduction = process.argv.indexOf("-p") != -1;

module.exports = {
    context: __dirname + "/src",
    entry: {
        castle: [
            isProduction === false ? "webpack/hot/dev-server" : null,
            "./castle"
        ].filter(function(e) { return e != null})
    },
    output: {
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
    devtool: isProduction ? null : "source-map",
    debug: false,
    resolveLoader: {
        root:  path.join(__dirname, "node_modules")
    },
    externals: {},
    resolve: {
        root: root,
        modulesDirectories: ["node_modules", "."],
        extensions: ["", ".js", ".ts"]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__:       !isProduction,
            __PRODUCTION__: isProduction
        }),
        //new webpack.optimize.UglifyJsPlugin({
        //    mangle: false
        //})
    ],
    devServer: {
        stats: {
            cached: false,
            exclude: []
        },
        port: 8887
    }

};

