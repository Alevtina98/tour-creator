export default class CssSelectorGenerator {
    default_options = {
        // choose from 'tag', 'id', 'class', 'nthchild', 'attribute'
        selectors: ['id', 'class', 'tag', 'nthchild'],
        prefix_tag: false,
        attribute_blacklist: [],
        attribute_whitelist: [],
        quote_attribute_when_needed: false,
        id_blacklist: [],
        class_blacklist: []
    };

    constructor(options = {}) {
        this.options = {};
        this.setOptions(this.default_options);
        this.setOptions(options);
    }

    setOptions(options = {}) {
        var key, results, val;
        results = [];
        for (key in options) {
            val = options[key];
            if (this.default_options.hasOwnProperty(key)) {
                results.push(this.options[key] = val);
            } else {
                results.push(void 0);
            }
        }
        return results;
    }

    isElement(element) {
        return !!((element != null ? element.nodeType : void 0) === 1);
    }

    getParents(element) {
        var current_element, result;
        result = [];
        if (this.isElement(element)) {
            current_element = element;
            while (this.isElement(current_element)) {
                result.push(current_element);
                current_element = current_element.parentNode;
            }
        }
        return result;
    }

    getTagSelector(element) {
        return this.sanitizeItem(element.tagName.toLowerCase());
    }

    // escapes special characters in class and ID selectors
    sanitizeItem(item) {
        var characters;
        characters = (item.split('')).map(function(character) {
            // colon is valid character in an attribute, but has to be escaped before
            // being used in a selector, because it would clash with the CSS syntax
            if (character === ':') {
                return `\\${':'.charCodeAt(0).toString(16).toUpperCase()} `;
            } else if (/[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/.test(character)) {
                return `\\${character}`;
            } else {
                return escape(character).replace(/\%/g, '\\');
            }
        });
        return characters.join('');
    }

    // escapes special characters in attributes
    sanitizeAttribute(item) {
        var characters;
        if (this.options.quote_attribute_when_needed) {
            return this.quoteAttribute(item);
        }
        characters = (item.split('')).map(function(character) {
            // colon is valid character in an attribute, but has to be escaped before
            // being used in a selector, because it would clash with the CSS syntax
            if (character === ':') {
                return `\\${':'.charCodeAt(0).toString(16).toUpperCase()} `;
            } else if (/[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/.test(character)) {
                return `\\${character}`;
            } else {
                return escape(character).replace(/\%/g, '\\');
            }
        });
        return characters.join('');
    }

    quoteAttribute(item) {
        var characters, quotesNeeded;
        quotesNeeded = false;
        characters = (item.split('')).map(function(character) {
            // colon is valid character in an attribute, but has to be escaped before
            // being used in a selector, because it would clash with the CSS syntax
            if (character === ':') {
                quotesNeeded = true;
                return character;
            } else if (character === "'") {
                quotesNeeded = true;
                return `\\${character}`;
            } else {
                quotesNeeded = quotesNeeded || (escape(character === !character));
                return character;
            }
        });
        if (quotesNeeded) {
            return "'" + (characters.join('')) + "'";
        }
        return characters.join('');
    }

    getIdSelector(element) {
        var id, id_blacklist, prefix, sanitized_id;
        prefix = this.options.prefix_tag ? this.getTagSelector(element) : '';
        id = element.getAttribute('id');
        id_blacklist = this.options.id_blacklist.concat(['', /\s/, /^\d/]);
        // ID must... exist, not to be empty and not to contain whitespace
        // ...exist
        // ...not be empty
        if (id && (id != null) && (id !== '') && this.notInList(id, id_blacklist)) {
            // ...not contain whitespace
            // not (/\s/.exec id) and
            // ...not start with a number
            // not (/^\d/.exec id)
            sanitized_id = prefix + `#${this.sanitizeItem(id)}`;
            // ID must match single element
            if (element.ownerDocument.querySelectorAll(sanitized_id).length === 1) {
                return sanitized_id;
            }
        }
        return null;
    }

    notInList(item, list) {
        return !list.find(function(x) {
            if (typeof x === 'string') {
                return x === item;
            }
            return x.exec(item);
        });
    }

    getClassSelectors(element) {
        var class_string, item, k, len, ref, result;
        result = [];
        class_string = element.getAttribute('class');
        if (class_string != null) {
            // remove multiple whitespaces
            class_string = class_string.replace(/\s+/g, ' ');
            // trim whitespace
            class_string = class_string.replace(/^\s|\s$/g, '');
            if (class_string !== '') {
                ref = class_string.split(/\s+/);
                for (k = 0, len = ref.length; k < len; k++) {
                    item = ref[k];
                    if (this.notInList(item, this.options.class_blacklist)) {
                        result.push(`.${this.sanitizeItem(item)}`);
                    }
                }
            }
        }
        return result;
    }

    getAttributeSelectors(element) {
        var a, attr, blacklist, k, l, len, len1, ref, ref1, ref2, result, whitelist;
        result = [];
        whitelist = this.options.attribute_whitelist;
        for (k = 0, len = whitelist.length; k < len; k++) {
            attr = whitelist[k];
            if (element.hasAttribute(attr)) {
                result.push(`[${attr}=${this.sanitizeAttribute(element.getAttribute(attr))}]`);
            }
        }
        blacklist = this.options.attribute_blacklist.concat(['id', 'class']);
        ref = element.attributes;
        for (l = 0, len1 = ref.length; l < len1; l++) {
            a = ref[l];
            if (!((ref1 = a.nodeName, indexOf.call(blacklist, ref1) >= 0) || (ref2 = a.nodeName, indexOf.call(whitelist, ref2) >= 0))) {
                result.push(`[${a.nodeName}=${this.sanitizeAttribute(a.nodeValue)}]`);
            }
        }
        return result;
    }

    getNthChildSelector(element) {
        var counter, k, len, parent_element, prefix, sibling, siblings;
        parent_element = element.parentNode;
        prefix = this.options.prefix_tag ? this.getTagSelector(element) : '';
        if (parent_element != null) {
            counter = 0;
            siblings = parent_element.childNodes;
            for (k = 0, len = siblings.length; k < len; k++) {
                sibling = siblings[k];
                if (this.isElement(sibling)) {
                    counter++;
                    if (sibling === element) {
                        return prefix + `:nth-child(${counter})`;
                    }
                }
            }
        }
        return null;
    }

    testSelector(element, selector) {
        var is_unique, result;
        is_unique = false;
        if ((selector != null) && selector !== '') {
            result = element.ownerDocument.querySelectorAll(selector);
            if (result.length === 1 && result[0] === element) {
                is_unique = true;
            }
        }
        return is_unique;
    }

    testUniqueness(element, selector) {
        var found_elements, parent;
        parent = element.parentNode;
        found_elements = parent.querySelectorAll(selector);
        return found_elements.length === 1 && found_elements[0] === element;
    }

    // helper function that tests all combinations for uniqueness
    testCombinations(element, items, tag) {
        var item, k, l, len, len1, len2, len3, m, n, ref, ref1, ref2, ref3;
        if (tag == null) {
            tag = this.getTagSelector(element);
        }
        if (!this.options.prefix_tag) {
            ref = this.getCombinations(items);
            for (k = 0, len = ref.length; k < len; k++) {
                item = ref[k];
                if (this.testSelector(element, item)) {
                    return item;
                }
            }
            ref1 = this.getCombinations(items);
            for (l = 0, len1 = ref1.length; l < len1; l++) {
                item = ref1[l];
                if (this.testUniqueness(element, item)) {
                    return item;
                }
            }
        }
        ref2 = this.getCombinations(items).map(function(item) {
            return tag + item;
        });
        // if tag selector is enabled, try attaching it
        for (m = 0, len2 = ref2.length; m < len2; m++) {
            item = ref2[m];
            if (this.testSelector(element, item)) {
                return item;
            }
        }
        ref3 = this.getCombinations(items).map(function(item) {
            return tag + item;
        });
        for (n = 0, len3 = ref3.length; n < len3; n++) {
            item = ref3[n];
            if (this.testUniqueness(element, item)) {
                return item;
            }
        }
        return null;
    }

    getUniqueSelector(element) {
        var k, len, ref, selector, selector_type, selectors, tag_selector;
        tag_selector = this.getTagSelector(element);
        ref = this.options.selectors;
        for (k = 0, len = ref.length; k < len; k++) {
            selector_type = ref[k];
            switch (selector_type) {
                // ID selector (no need to check for uniqueness)
                case 'id':
                    selector = this.getIdSelector(element);
                    break;
                // tag selector (should return unique for BODY)
                case 'tag':
                    if (tag_selector && this.testUniqueness(element, tag_selector)) {
                        selector = tag_selector;
                    }
                    break;
                // class selector
                case 'class':
                    selectors = this.getClassSelectors(element);
                    if ((selectors != null) && selectors.length !== 0) {
                        selector = this.testCombinations(element, selectors, tag_selector);
                    }
                    break;
                // attribute selector
                case 'attribute':
                    selectors = this.getAttributeSelectors(element);
                    if ((selectors != null) && selectors.length !== 0) {
                        selector = this.testCombinations(element, selectors, tag_selector);
                    }
                    break;
                // if anything else fails, return n-th child selector
                case 'nthchild':
                    selector = this.getNthChildSelector(element);
            }
            if (selector) {
                return selector;
            }
        }
        return '*';
    }

    getSelector(element) {
        var item, k, len, parents, result, selector, selectors;
        selectors = [];
        parents = this.getParents(element);
        for (k = 0, len = parents.length; k < len; k++) {
            item = parents[k];
            selector = this.getUniqueSelector(item);
            if (selector != null) {
                selectors.unshift(selector);
                result = selectors.join(' > ');
                if (this.testSelector(element, result)) {
                    return result;
                }
            }
        }
        return null;
    }

    getCombinations(items = []) {
        var i, j, k, l, ref, ref1, result;
        // first item must be empty (seed), it will be removed later
        result = [[]];
        for (i = k = 0, ref = items.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
            for (j = l = 0, ref1 = result.length - 1; (0 <= ref1 ? l <= ref1 : l >= ref1); j = 0 <= ref1 ? ++l : --l) {
                result.push(result[j].concat(items[i]));
            }
        }
        // remove first empty item (seed)
        result.shift();
        // sort results by length, we want the shortest selectors to win
        result = result.sort(function(a, b) {
            return a.length - b.length;
        });
        // collapse combinations and add prefix
        result = result.map(function(item) {
            return item.join('');
        });
        return result;
    }

};

