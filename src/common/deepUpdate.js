const deepUpdate = function(root, path, value) {
    let obj = root;

    if (path.length > 1) {
        obj = path.slice(0, path.length - 1).reduce((last, piece) => {
            return last[piece];
        }, root);
    }

    const key = path[path.length - 1];
    obj[key] = value;
};

module.exports = deepUpdate;
