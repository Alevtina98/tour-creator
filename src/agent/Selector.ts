function getDomPath(el: any): string {
    const stack = [];
    console.log("e.target >> ", el);
    //двигаемся вверх по дереву от самого вложенного (по которому произошел клик)
    while (el.parentNode != null) {
        // console.log(el.nodeName);
        let sibCount = 0;
        let sibIndex = 0;
        let hasBrothers = false;
        for (let i = 0; i < el.parentNode.childNodes.length; i++) {
            const sib = el.parentNode.childNodes[i];
            //если есть братья-элементы того же типа, считаем их количество
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                } else hasBrothers = true;
            }
            //не считаем ноды #text and #comment
            if (sib instanceof Element) {
                sibCount++;
                console.log("el.parentNode.childNodes", i, ">>", sib);
            }
        }
        if (el.hasAttribute("id") && el.id != "") {
            stack.unshift(el.nodeName.toLowerCase() + "#" + el.id);
        } else if (hasBrothers) {
            stack.unshift(el.nodeName.toLowerCase() + ":nth-child(" + (sibIndex + 1) + ")");
            console.log("sibIndex >> ", sibIndex);
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    const arrayOfEl = stack.slice(1);

    return arrayOfEl.join(">");
}

export default getDomPath;
