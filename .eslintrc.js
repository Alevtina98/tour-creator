module.exports =  {
    "parserOptions": {
        "project": "./tsconfig.json",
        "tsconfigRootDir": "."
    },
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