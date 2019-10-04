const path = require("path");

const blocklyEntry = [
    "underscore.js",
    "blockly_compressed.js",
    "blocks-compressed.js",
    "msg-en.js",
    "en.js",
    "javascript-compressed.js"
];
module.exports = async ({ config, mode }) => {
    config.resolve.extensions.push(".ts", ".tsx",".css", ".less", ".md", ".json");

    config.entry = {
        ...config.entry,
        // blockly: blocklyEntry.map(entry => path.resolve(__dirname, "../chrome-extension/blockly1/" + entry))
    };
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