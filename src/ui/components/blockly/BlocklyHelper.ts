/**
 * @param {string} xml
 */
// import {DOMParser} from 'xmldom';

export default function parseWorkspaceXml(xml: any) {
    const arrayTags = ["name", "custom", "colour", "categories", "blocks"];
    let xmlDoc: any = null;

    try {
        xmlDoc = new DOMParser().parseFromString(xml, "text/xml");
    } catch (e) {
    } finally {
        new Error("cannot parse xml string!");
    }

    function isArray(o: any) {
        return Object.prototype.toString.apply(o) === "[object Array]";
    }

    /**
     * @param {string} xmlNode
     * @param {Array.<string>} result
     */
    function parseNode(xmlNode: any, result: any) {
        if (xmlNode.nodeName === "#text") {
            const v = xmlNode.nodeValue;
            if (v.trim()) {
                result["value"] = v;
            }
            return;
        }

        const jsonNode: any = {};
        const existing = result[xmlNode.nodeName];
        if (existing) {
            if (!isArray(existing)) {
                result[xmlNode.nodeName] = [existing, jsonNode];
            } else {
                result[xmlNode.nodeName].push(jsonNode);
            }
        } else if (arrayTags && arrayTags.includes(xmlNode.nodeName)) {
            result[xmlNode.nodeName] = [jsonNode];
        } else {
            result[xmlNode.nodeName] = jsonNode;
        }

        if (xmlNode.attributes) {
            for (let i = 0; i < xmlNode.attributes.length; i++) {
                const attribute = xmlNode.attributes[i];
                jsonNode[attribute.nodeName] = attribute.nodeValue;
            }
        }

        for (let i = 0; i < xmlNode.childNodes.length; i++) {
            parseNode(xmlNode.childNodes[i], jsonNode);
        }
    }

    const result = {};
    if (xmlDoc && xmlDoc.childNodes.length) {
        parseNode(xmlDoc.childNodes[0], result);
    }

    return transformed(result);
}

function transformed(result: any) {
    const filteredResult = [];
    const xml = result["xml"];
    const categories = xml["category"];
    for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const cNew: any = {};
        cNew.name = c.name;
        cNew.colour = c.colour;
        cNew.custom = c.custom;
        if (c.block) {
            cNew.blocks = parseBlocks(c.block);
        }
        filteredResult.push(cNew);
    }

    return filteredResult;
}

function parseBlocks(blocks: any) {
    const arr = ensureArray(blocks);

    const res: any = [];
    arr.forEach(block => {
        const obj: any = parseObject(block);
        obj.type = block.type;
        res.push(obj);
    });

    return res;
}

function parseFields(fields: any) {
    const arr = ensureArray(fields);

    const res: any = {};
    arr.forEach(field => {
        res[field.name] = field.value;
    });

    return res;
}

function parseValues(values: any) {
    const arr = ensureArray(values);

    const res: any = {};
    arr.forEach(value => {
        res[value.name] = parseObject(value);
    });

    return res;
}

function ensureArray(obj: any) {
    if (obj instanceof Array) {
        return obj;
    }

    return [obj];
}

function parseObject(obj: any) {
    let res: any = {};
    if (obj.shadow) {
        res = parseObject(obj.shadow);
        res.type = obj.shadow.type;
        res.shadow = true;
    } else if (obj.block) {
        res = parseObject(obj.block);
        res.type = obj.block.type;
        res.shadow = false;
    }

    if (obj.mutation) {
        res.mutation = {
            attributes: obj.mutation,
            innerContent: obj.mutation.value
        };
    }
    if (obj.field) {
        res.fields = parseFields(obj.field);
    }
    if (obj.value) {
        res.values = parseValues(obj.value);
    }
    if (obj.next) {
        res.next = parseObject(obj.next);
    }
    if (obj.statement) {
        res.statements = {
            [obj.statement.name]: parseObject(obj.statement)
        };
    }

    return res;
}
