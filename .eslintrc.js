module.exports =  {
    "parserOptions": {
        "project": "./tsconfig.json",
        "tsconfigRootDir": "."
    },
    "extends": [
        "@krista/eslint-config"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".tsx",
                    ".ts"
                ]
            }
        }
    }
};