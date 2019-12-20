import TourHelper from "../agent/TourHelper/utils";
import { argumentPlaceholder } from "@babel/types";

const helperClass = TourHelper.name;

Blockly.Blocks["dark"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("blackout", "NAME");
        this.appendValueInput("selector").setCheck("selector");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["desc"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("description", "NAME");
        this.appendValueInput("selector")
            //.appendField("селектор", "NAME")
            .setCheck("selector");
        this.appendValueInput("text")
            //.appendField("описание", "NAME")
            .setCheck("String");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["step"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("next step", "NAME");
        this.appendValueInput("condition")
            .appendField("after", "NAME")
            .setCheck("Boolean");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        //this.appendField("step");
        // this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["selector"] = {
    init: function() {
        this.appendDummyInput("selector")
            .appendField(
                new Blockly.FieldImage(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magnifying_glass_icon.svg/735px-Magnifying_glass_icon.svg.png",
                    15,
                    15,
                    "*"
                )
            )
            .appendField(new Blockly.FieldTextInput(""), "NAME");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setStyle("text_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["click"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("click", "NAME");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setStyle("logic_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["clickOn"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("click on", "NAME");
        this.appendValueInput("selector").setCheck("String");
        //this.appendDummyInput("TOPROW").appendField("click", "NAME");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setStyle("logic_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["comment"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("Add", "NAME");
        this.appendValueInput("text")
            .appendField("comment", "NAME")
            .setCheck("String");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        //this.appendField("step");
        // this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript["comment"] = function(block: any) {
    const arg: string = Blockly.JavaScript.valueToCode(block, "text", Blockly.JavaScript.ORDER_NONE);
    const code: string =
        "/**\n" + Blockly.JavaScript.prefixLines(arg.substring(1, arg.length - 1) + "\n", " * ") + " */\n";
    return code;
};
Blockly.JavaScript["selector"] = function(block: any) {
    /*// Generate JavaScript for setting the width.
    var width = Blockly.JavaScript.valueToCode(block, 'WIDTH',
        Blockly.JavaScript.ORDER_NONE) || '1';*/
    const code = Blockly.JavaScript.quote_(block.getFieldValue("NAME"));
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["desc"] = function(block: any) {
    // Define a procedure with a return value.
    const funcName = helperClass + ".description";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const args2: string = Blockly.JavaScript.valueToCode(block, "text", Blockly.JavaScript.ORDER_NONE);
    const error1: string = args1 ? "" : "// нет аргумента 1 (выделяемый элемент)\n";
    const error2: string = args2 ? "" : "// нет аргумента 2 (описание к выделяемому элементу)\n";
    const code: string = error1 + error2 + funcName + "(" + args1 + ", " + args2 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
Blockly.JavaScript["dark"] = function(block: any) {
    const funcName = helperClass + ".blackout";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const error: string = args1 ? "" : "// нет аргумента (выделяемый элемент)\n";
    const code: string = error + funcName + "(" + args1 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
let errorClickOn: string;
Blockly.JavaScript["step"] = function(block: any) {
    const funcName = helperClass + ".blocklyStep";
    const args1: string = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_NONE);
    const error: string = args1 ? "" : "// нет аргумента (условие исполнения следующего шага тура)\n";
    const code: string = error + errorClickOn + funcName + "(" + args1 + ");\n";
    console.log("errorClickOn >>", errorClickOn);
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};

Blockly.JavaScript["click"] = function(block: any) {
    const funcName = helperClass + ".click";
    console.log("click.to");
    const code: string = "function(){ return " + funcName + "()}";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    errorClickOn = "";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript["clickOn"] = function(block: any) {
    const funcName = helperClass + ".clickOn";
    console.log(funcName);
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    console.log(args1);
    errorClickOn = args1 ? "" : "// нет аргумента (выделяемый элемент)\n";
    const code: string = "(function(){ return " + funcName + "(" + args1 + ")})";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
