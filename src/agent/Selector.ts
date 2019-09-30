function getDomPath(el: any): string {
    const stack = [];
    while (el.parentNode != null) {
        // console.log(el.nodeName);
        let sibCount = 0;
        let sibIndex = 0;
        for (let i = 0; i < el.parentNode.childNodes.length; i++) {
            const sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (el.hasAttribute("id") && el.id != "") {
            stack.unshift(el.nodeName.toLowerCase() + "#" + el.id);
        } else if (sibCount > 1) {
            stack.unshift(el.nodeName.toLowerCase() + ":nth-child(" + (sibIndex + 1) + ")");
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    const arrayOfEl = stack.slice(1);

    return arrayOfEl.join(">");
}

export default getDomPath;
