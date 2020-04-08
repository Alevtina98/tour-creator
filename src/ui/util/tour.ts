import { format } from "date-fns";

export interface TourType {
    id: number;
    name: string;
    desc: string | null;
    code: string | null;
    codeJS: string | null;
    dateCreate: string;
    dateChange: string;
}

export const getInitData = (data?: Partial<TourType>): TourType => ({
    id: -1,
    name: "Unnamed",
    code: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    codeJS: "",
    desc: "",
    dateCreate: "",
    dateChange: "",
    ...data
});

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

export const getDateClientFormat = (str: string) => {
    return format(getDate(str), "dd-MM-yyyy в HH:mm:ss");
};
export const getDate = (str?: string) => {
    //const dateServer = new Date.UTC(str)
    if (!str) {
        return new Date();
    }
    return new Date(str);
};
