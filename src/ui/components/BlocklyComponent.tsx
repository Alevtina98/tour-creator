import React from 'react';
import ReactDOM from 'react-dom';
// import ReactBlocklyComponent from './blockly/index';
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from '../../initContent/content.jsx';
import parseWorkspaceXml from './blockly/BlocklyHelper';

// import Blockly from "node-blockly";

export interface BlocklyState {
    toolboxCategories: any[];
}

export interface BlocklyProps {
    selector: string;
}
class BlocklyComponent extends React.Component<{}, BlocklyState, BlocklyProps> {
    props: BlocklyProps = {
        selector: "selector"
    };
    blocklyRef: any | null = null;

    state: BlocklyState = {
        toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML)
    };
    componentDidMount(): void {
        window.setTimeout(() => {
            this.setState({
                toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML).concat([
                    {
                        name: 'Затемнение',
                        blocks: [
                            { type: 'desc' , onChange: () => { console.log("HELLO WORLD")}},
                            { type: 'dark' }

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

    workspaceDidChange = (workspace: any) => {
        // const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        // document.getElementById('generated-xml').innerText = newXml;
        //
        // const code = Blockly.JavaScript.workspaceToCode(workspace);
        // document.getElementById('code').value = code;
        //console.log(workspace);
    };

    render = () => {

        //console.log(this.blocklyRef);
        if (this.blocklyRef && this.blocklyRef.workspace &&this.blocklyRef.workspace.state&&this.blocklyRef.workspace.state.workspace&&this.blocklyRef.workspace.state.workspace.topBlocks_[0]) {
            console.log(">>",this.blocklyRef.workspace.state.workspace.topBlocks_[0].changeKey);
            // this.blocklyRef.workspace.state.workspace.registerButtonCallback("dropdownkey", () => {
            //
            //     console.log("Change!!!!!!!!!!!!!")
            // })
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

