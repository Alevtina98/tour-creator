const createVendorChunk = require("webpack-create-vendor-chunk");
const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        /* blockly: [
            "expose-loader?Blockly!exports-loader?Blockly,goog!google-blockly/blockly_compressed",
            "google-blockly/blocks_compressed",
            "expose-loader?google-blockly/javascript_compressed",
            "google-blockly/msg/js/ru"
        ],*/
        ui: "./src/ui/index.tsx",
        agent: "./src/agent/index.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less", ".cur"]
    },

    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "chrome-extension/build/"),
        publicPath: "build",
        filename: "[name].bundle.js"
    },

    // plugins: [
    //   createVendorChunk({
    //     name: 'vendor',
    //     chunks: ['ui'],
    //   }),
    // ],
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         test: /node_modules/,
    //         chunks: "initial",
    //         name: 'vendor',
    //         enforce: true
    //       },
    //     }
    //   }
    // },
    module: {
        rules: [
            {
                test: /\.(ts|js|tsx|jsx)?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },

            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /(?:\.woff2?$|\.ttf$|\.svg$|\.eot$)/,
                loader: "file-loader",
                query: {
                    name: "/build/font/[hash].[ext]"
                }
            }
        ]
    }
};
