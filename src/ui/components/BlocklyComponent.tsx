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
    inspect: any
}
class BlocklyComponent extends React.Component<BlocklyProps, BlocklyState> {
    props: BlocklyProps = {
        selector: "selector",
        inspect: null
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
                        name: 'Tour',
                        blocks: [
                            { type: 'desc' , onChange: () => { console.log("HELLO WORLD")}},
                            { type: 'dark' },
                            { type: 'selector'}
                        ],
                    }
                    ]

                )
            });
        }, 1);
    };

    componentDidUpdate({ selector }: BlocklyProps): void {
        if (this.props.selector !== selector && this.state.blockId) {
            const workspaceSvg = this.blocklyRef.workspace.state.workspace;
            const block = workspaceSvg.getBlockById(this.state.blockId);
            const field =  block.getField("NAME");
            console.log("field >> ",field);
            if (field != "") {
                field.setText(this.props.selector);
                this.setState({
                    blockId: ""
                });
            }
            console.log("selector >> ",this.props.selector);
        }
    }

    setBlocklyRef = (ref: any) => {
        this.blocklyRef = ref;
    };

    /*onChangeCheckbox = (key: string) => {
        console.log("from FN", key);
    };*/

    /*onClickSVGEl = () => {
        console.log("CLICK ON ELEMENT", this);
    }*/

    workspaceDidChange = (workspace: any) => {

    };
    isCreated = false;

    onClickOnBlock = () => {
        const workspaceSvg = this.blocklyRef.workspace.state.workspace;
        const block= workspaceSvg.getBlockById(this.state.blockId);
        console.log("Block >> ",block);
        if (block) {
            this.props.inspect();
        }

    };

    render = () => {

        if (this.blocklyRef&&this.blocklyRef.workspace && !this.isCreated) {
            //console.log(this.blocklyRef.workspace);
            const self = this;
            const workspaceSVG = this.blocklyRef.workspace.state.workspace;

            function onFirstComment(event: WorkspaceEventType) {
                if (/*event.type == Blockly.Events.CHANGE ||*/ event.type === Blockly.Events.UI) {
                    console.log("event", event);
                    if (event.element !== "click") return;
                    const blockId = event.blockId || event.newValue || "";
                    self.setState({
                        blockId
                    });
                    if (blockId) {
                        const block= workspaceSVG.getBlockById(blockId);
                        console.log("block", block);
                        //console.log("IN EVENT CONDITION", workspaceSVG, self);
                        if (block.type === "selector") {
                            self.onClickOnBlock();
                        }
                    }
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

