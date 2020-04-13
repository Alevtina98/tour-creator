Blockly.FieldTextInput.SPELLCHECK = true;
Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = "";

const TOUR_BLOCK_COLOR: string = "#777785";
const COMMENT_BLOCK_COLOR: string = "#b6b6b7";
const SELECTOR_BLOCK_COLOR: string = "#94a5ea";
const TARGET_BLOCK_COLOR: string = "#0f75f3";

const helperClass = "TourHelper";

Blockly.Blocks["dark"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("Затемнить вокруг элемента", "NAME");
        this.appendValueInput("selector").setCheck("selector");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setStyle("procedure_blocks");
        //  this.setColour(TOUR_BLOCK_COLOR);
        this.setTooltip("Блок, затемняющий и блокирующий не выделяемые элементы страницы");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["desc"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("Показать", "NAME");
        this.appendValueInput("selector")
            .appendField("рядом с элементом", "NAME")
            .setCheck("selector");
        this.appendValueInput("text")
            .appendField("подсказку", "NAME")

            .setCheck("String");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("Блок, добавляющий подсказку к элементу");
        this.setHelpUrl("");
        //   this.setColour(TOUR_BLOCK_COLOR);
    }
};
Blockly.Blocks["step"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("Ожидать ", "NAME");
        this.appendValueInput("condition").setCheck("event");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        //this.appendField("step");
        this.setColour(230);
        this.setStyle("procedure_blocks");
        this.setTooltip("Блок, добавляющий условие окончания шага тура");
        this.setHelpUrl("");
        //   this.setColour(TOUR_BLOCK_COLOR);
    }
};
Blockly.Blocks["selector"] = {
    init: function() {
        this.appendDummyInput("selector")
            .appendField(new Blockly.FieldImage("../media/Magnifying_glass_icon.svg.png", 15, 15, "*"))
            .appendField(new Blockly.FieldTextInput(""), "NAME");
        this.setInputsInline(true);
        this.setOutput(true, "selector");
        this.setStyle("text_blocks");
        this.setTooltip("Селектор выбранного элемента. Нажатие на блок включает режим инспекции");
        this.setHelpUrl("");
        //  this.setColour(SELECTOR_BLOCK_COLOR);
        //  this.setColour(TOUR_BLOCK_COLOR);
    }
};
Blockly.Blocks["click"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("клик", "NAME");
        this.setInputsInline(true);
        this.setOutput(true, "event");
        this.setStyle("logic_blocks");
        // this.setColour(TARGET_BLOCK_COLOR);

        this.setTooltip("Блок ожидания совершения любого клика");
        this.setHelpUrl("");
        //   this.setColour(TOUR_BLOCK_COLOR);
    }
};
Blockly.Blocks["clickOn"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("клик по элементу", "NAME");
        this.appendValueInput("selector").setCheck("selector");
        //this.appendDummyInput("TOPROW").appendField("click", "NAME");
        this.setInputsInline(true);
        this.setOutput(true, "event");
        this.setStyle("logic_blocks");
        // this.setColour(TARGET_BLOCK_COLOR);

        this.setTooltip("Блок ожидания совершения клика по указанному элементу");
        this.setHelpUrl("");
        //  this.setColour(TOUR_BLOCK_COLOR);
    }
};
Blockly.Blocks["comment"] = {
    init: function() {
        this.appendDummyInput("TOPROW")
            .appendField("")
            // this.appendValueInput("text").setCheck("String");*/
            .appendField(new Blockly.FieldTextInput(""), "text");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        //this.appendField("step");
        this.setStyle("procedure_blocks");
        //  this.setColour(COMMENT_BLOCK_COLOR);

        this.setTooltip("Блок однострочного выделяющего комментария");
        this.setHelpUrl("");
    }
};
Blockly.Blocks["long_comment"] = {
    init: function() {
        this.appendDummyInput("TOPROW").appendField("", "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        //this.appendField("step");
        this.setCommentText(Blockly.Msg["PROCEDURES_DEFNORETURN_COMMENT"]);
        this.setStyle("procedure_blocks");
        this.setTooltip(
            `Блок с комментарием в одну или несколько строк. Нажатие на "?" открывает/закрывает поле ввода`
        );
        this.setHelpUrl("");
        // this.setColour(COMMENT_BLOCK_COLOR);
    }
};

Blockly.JavaScript["comment"] = function(block: any) {
    console.log(block);
    const arg = block.inputList[0].fieldRow[0].text_;
    // const arg: string = Blockly.JavaScript.valueToCode(block, "text", Blockly.JavaScript.ORDER_NONE);
    const code: string = "/**\n" + Blockly.JavaScript.prefixLines(arg.substring(0, arg.length) + "\n", "*") + "*/\n";
    return code;
};
Blockly.JavaScript["long_comment"] = function(block: any) {
    return "";
};
Blockly.JavaScript["selector"] = function(block: any) {
    const code = Blockly.JavaScript.quote_(block.getFieldValue("NAME"));
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["desc"] = function(block: any) {
    // Define a procedure with a return value.
    const funcName = helperClass + ".description";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const args2: string = Blockly.JavaScript.valueToCode(block, "text", Blockly.JavaScript.ORDER_NONE);
    const error1: string = args1 ? "" : "//! нет аргумента 1 (выделяемый элемент)\n";
    const error2: string = args2 ? "" : "//! нет аргумента 2 (описание к выделяемому элементу)\n";
    const code: string = error1 + error2 + funcName + "(" + args1 + ", " + args2 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
Blockly.JavaScript["dark"] = function(block: any) {
    const funcName = helperClass + ".blackout";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const error: string = args1 ? "" : "//! нет аргумента (выделяемый элемент)\n";
    const code: string = error + funcName + "(" + args1 + ");\n";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};
Blockly.JavaScript["step"] = function(block: any) {
    const funcName = helperClass + ".blocklyStep";
    const args1: string = Blockly.JavaScript.valueToCode(block, "condition", Blockly.JavaScript.ORDER_NONE);
    const error: string = args1 ? "" : "//! нет аргумента (условие исполнения следующего шага тура)\n";
    const code: string = error + funcName + "(" + args1 + ");\n";

    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return code;
};

Blockly.JavaScript["click"] = function(block: any) {
    const funcName = helperClass + ".click";
    const code: string = "function(){\n " + "   return " + funcName + "()\n" + "}";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript["clickOn"] = function(block: any) {
    const funcName = helperClass + ".clickOn";
    const args1: string = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_NONE);
    const errorClickOn = args1 ? "" : "//! нет аргумента (выделяемый элемент)\n";
    const code: string = "function(){ \n " + errorClickOn + "   return " + funcName + "(" + args1 + ")\n " + "}";
    // Add % so as not to collide with helper functions in definitions list.
    //Blockly.JavaScript.definitions_['%' + funcName] = code;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
