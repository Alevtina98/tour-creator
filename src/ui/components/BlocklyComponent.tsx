
import React from 'react';
import ReactDOM from 'react-dom';
import ReactBlocklyComponent from './blockly/index';
import ConfigFiles from '../../initContent/content';
import parseWorkspaceXml from './blockly/BlocklyHelper';

// import Blockly from "node-blockly";

export interface BlocklyState {
    toolboxCategories: any[];
}

class BlocklyComponent extends React.Component<{}, BlocklyState> {
    state: BlocklyState = {
        toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML)
    };

    workspaceDidChange = (workspace: any) => {
       // const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
       // document.getElementById('generated-xml').innerText = newXml;
    }
    render = () => {
        return (
            <ReactBlocklyComponent.BlocklyEditor
                toolboxCategories={this.state.toolboxCategories}
                workspaceConfiguration={{
                    sounds: false,
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true,
                    },
                }}
                initialXml={ConfigFiles.INITIAL_XML}
                wrapperDivClassName="fill-height"
                workspaceDidChange={this.workspaceDidChange}
            />
        );
    }

}

export default BlocklyComponent;

