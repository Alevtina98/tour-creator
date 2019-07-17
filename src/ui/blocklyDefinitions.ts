import {any} from "prop-types";

Blockly.Blocks['dark'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("Затемнение");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

   /* console.log("container:",document.getElementById('blocklyDiv'));
    console.log("toolbox:",document.getElementById('toolbox') );
    const workspace: any = Blockly.inject(document.getElementById('blocklyDiv'), {toolbox: document.getElementById('toolbox')});

    console.log(workspace);

    workspace.registerButtonCallback("Inspector", function () {
        console.log("HELLO FROM FUNCTION")
    });
    console.log("workspace.registerButtonCallback");*/

Blockly.Blocks['desc'] = {
    init: function() {
        const t = this;
        this.appendDummyInput("Ins")
            .appendField("Inspector")
                .appendField(new Blockly.FieldCheckbox("TRUE", function(key: string){
                    t.changeKey(key);
                }), "dropdownkey");

        this.appendValueInput("selector")
            .setCheck(null)
            .appendField("Описание");


        this.appendValueInput("text")
            .setCheck("String");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
    changeKey: function (key: string) {
        console.log("key:", key);
        return key;
    }
};



