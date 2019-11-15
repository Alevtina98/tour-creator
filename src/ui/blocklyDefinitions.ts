import TourHelper from "../agent/utils";

const helperClass = TourHelper.name;

Blockly.Blocks["dark"] = {
    init: function() {
        this.appendValueInput("selector")
            .setCheck("selector")
            .appendField("blackout");
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
        this.appendValueInput("selector")
            .setCheck("selector")
            .appendField("description");
        this.appendValueInput("text").setCheck("String");
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
    const code: string =  funcName + "(" + args1 + ", " + args2 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
Blockly.JavaScript["dark"] = function(block: any) {
    const funcName = helperClass + ".blackout";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const code: string = funcName + "(" + args1 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
Blockly.JavaScript["step"] = function(block: any) {
    const funcName = helperClass + ".blocklyStep";
    const code: string = funcName + "();\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};

