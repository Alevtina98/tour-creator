const webpack = require("webpack");

const path = require("path");

module.exports = async ({ config, mode }) => {
    config.resolve.extensions.push(".ts", ".tsx",".css", ".less", ".md", ".json");

    config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules/],
        use: [
            "babel-loader?cacheDirectory=true"
        ],
    });
    config.module.rules.push({
        test: /\.(less)$/,
        use: [
            {
                loader: "style-loader",
            },
            {
                loader: "css-loader",
                options: {
                    url: false,
                },
            },
            {
                loader: "less-loader",
                options: {
                    lists: true
                }
            },
        ],
    });
    config.module.rules.push({
        test: /\.(css)$/,
        use: [
            {
                loader: "style-loader",
            },
            {
                loader: "css-loader",
                options: {
                    url: false,
                },
            }
        ],
    });

    return config;
};