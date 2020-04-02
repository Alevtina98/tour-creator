export const getJsSettersNameAndDesc = (name: string, desc: string) => {
    const nameAssignment: string | null = `TourHelper.setNameTour('${name}');\n`;
    const descAssignment: string | null = `TourHelper.setDescTour('${desc}');\n\n`;
    return nameAssignment + descAssignment;
};
export const xmlToJs = (xmlCode: string | null) => {
    if (!xmlCode) return "";
    const xml: string = xmlCode;
    const xmlDom = Blockly.Xml.textToDom(xml);
    const workspace = new Blockly.Workspace();
    Blockly.setTheme(Blockly.Themes.Classic);
    Blockly.Xml.domToWorkspace(xmlDom, workspace);
    const jsFromXml: string = Blockly.JavaScript.workspaceToCode(workspace);
    return jsFromXml;
};
export const getCurrentJs = (
    currentName: string | null,
    currentDesc: string | null,
    currentXml: string | null,
    jsFromCurrentXml: string | null
) => {
    const name: string = currentName || "";
    const desc: string = currentDesc || "";
    const xml: string = currentXml || "";
    const currentJs: string = getJsSettersNameAndDesc(name, desc) + (jsFromCurrentXml || xmlToJs(xml));
    return currentJs;
};