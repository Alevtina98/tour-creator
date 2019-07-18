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
        /*this.appendDummyInput("Ins")
            .appendField("Inspector")
                .appendField(new Blockly.FieldCheckbox("TRUE", function(key: string){
                    t.changeKey(key);
                }), "dropdownkey");*/


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
Blockly.Blocks['selector'] = {
    init: function() {
        this.jsonInit({
            "type": "selector",
            "message0": "%1 %2",
            "args0": [
                {
                    "type": "field_image",
                    "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
                    "width": 15,
                    "height": 15,
                    "alt": "*",
                    "flipRtl": false
                },
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "default"
                }
            ],
            "inputsInline": true,
            "output": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        })
        /*this.appendDummyInput()
            //.appendField("Inspect")
            .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"), undefined, "myIconButton");
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("selector"), "selector");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");*/
    }
};

/*export const onClick = ()=> {
    console.log("Clicked");
    return 0;
};*/

/*

Blockly.Extensions.register('myIconButton', function () {
    debugger;
    this.getField('myIconButton').clickHandler_ = (() => {
        console.log(this.type + ' button clicked');
    });
});
*/
