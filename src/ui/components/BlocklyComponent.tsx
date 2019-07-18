import React from 'react';
import ReactDOM from 'react-dom';
// import ReactBlocklyComponent from './blockly/index';
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from '../../initContent/content.jsx';
import parseWorkspaceXml from './blockly/BlocklyHelper';
// import Blockly from "node-blockly";

export interface BlocklyState {
    toolboxCategories: any[];
    blockId: string
}

export interface WorkspaceEventType {
    blockId: string;
    type: string;
    element: string
    group: string
    newValue: undefined;
    oldValue: undefined;
    recordUndo: false;
    workspaceId: string;
}

export interface BlocklyProps {
    selector: string;
}
class BlocklyComponent extends React.Component <{}, BlocklyState, BlocklyProps> {
    props: BlocklyProps = {
        selector: "selector"
    };
    blocklyRef: any | null = null;

    state: BlocklyState = {
        toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
        blockId: ""
    };
    componentDidMount(): void {
        window.setTimeout(() => {
            this.setState({
                toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML).concat([
                    {
                        name: 'Затемнение',
                        blocks: [
                            { type: 'desc' , onChange: () => { console.log("HELLO WORLD")}},
                            { type: 'dark' },
                            {
                                type: 'text',
                                message0: "%1 %2",
                                args0: [
                                    {
                                        "type": "inspector",
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
                                inputsInline: true,
                                output: null,
                                colour: 230,
                                tooltip: "",
                                helpUrl: "",
                                extensions: [ "my_button_extension" ]
                            }
                        ],
                    }
                    ]

                )
            });
        }, 1);

    };

    setBlocklyRef = (ref: any) => {
        this.blocklyRef = ref;
    };

    onChangeCheckbox = (key: string) => {
        console.log("from FN", key);
    };

    onClickSVGEl = () => {
        console.log("CLICK ON ELEMENT", this);
    }

    workspaceDidChange = (workspace: any) => {
        // if (this.blocklyRef&&this.blocklyRef.workspace) {
        //     console.log(this.blocklyRef.workspace);
        //     const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        //     function onFirstComment(event) {
        //         console.log("IN FUNCTION CALLBACK");
        //         if (event.type == Blockly.Events.CHANGE || event.type === Blockly.Events.UI) {
        //             console.log("IN EVENT CONDITION");
        //             workspace.removeChangeListener(onFirstComment);
        //         }
        //     }
        //     workspaceSVG.addChangeListener(onFirstComment);
            //
            // workspaceSVG.topBlocks_.forEach(el => {
            //     const svgEl = el.svgGroup_;
            //     console.log(">", svgEl);
            //     svgEl.removeEventListener("mousedown", this.onClickSVGEl);
            //     svgEl.addEventListener("mousedown", this.onClickSVGEl)
            // })
        // }

        // const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        // document.getElementById('generated-xml').innerText = newXml;
        //
        // const code = Blockly.JavaScript.workspaceToCode(workspace);
        // document.getElementById('code').value = code;
        //console.log(workspace);
    };
    isCreated = false;

    onClickOnBlock = () => {

    };

    render = () => {
    /*    if (this.blocklyRef && this.blocklyRef.workspace &&this.blocklyRef.workspace.state&&this.blocklyRef.workspace.state.workspace&&this.blocklyRef.workspace.state.workspace.topBlocks_[0]) {
            console.log(">>",this.blocklyRef.workspace.state.workspace.topBlocks_[0].changeKey);
        }
        console.log("this.blocklyRef",this.blocklyRef);
        */

        // Blockly.Extensions.register('my_button_extension', function () {
        //     this.getField('inspector').clickHandler_ = (() => {
        //         console.log(this.type + ' button clicked');
        //     });
        // });

        if (this.blocklyRef&&this.blocklyRef.workspace && !this.isCreated) {
            console.log(this.blocklyRef.workspace);
            const self = this;
            const workspaceSVG = this.blocklyRef.workspace.state.workspace;

            function onFirstComment(event: WorkspaceEventType) {
                if (event.type == Blockly.Events.CHANGE || event.type === Blockly.Events.UI) {
                    self.setState({
                        blockId: event.blockId
                    });
                    console.log("IN EVENT CONDITION", workspaceSVG, self);

                    self.onClickOnBlock();
                    // workspaceSVG.removeChangeListener(onFirstComment);
                }
            }
            this.isCreated = true;
            workspaceSVG.addChangeListener(onFirstComment);
        }
        return (
            <ReactBlocklyComponent.BlocklyEditor
                toolboxCategories={this.state.toolboxCategories}
                ref={this.setBlocklyRef}
                workspaceConfiguration={{
                    sounds: false,
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true
                    },
                }}
                initialXml="ConfigFiles.INITIAL_XML"
                wrapperDivClassName="fill-height"
                workspaceDidChange={this.workspaceDidChange}
            />
        );
    }

}

export default BlocklyComponent;

