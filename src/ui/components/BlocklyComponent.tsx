import React from "react";
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from "../../initContent/content.jsx";
import parseWorkspaceXml from "./blockly/BlocklyHelper";
import { connect } from "react-redux";
import { StoreType } from "../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { periodicallySave, editTourDB } from "../actions/selectedTourAction";
import { setCurrentSelector } from "../actions/inspectAction";
import { getInitData, TourType } from "../util/restClient/requestTour";

export interface Blockly {
    toolboxCategories: any[];
    blockId: string;
    reload: boolean;
}

export interface WorkspaceEventType {
    blockId: string;
    type: string;
    element: string;
    group: string;
    newValue: undefined;
    oldValue: undefined;
    recordUndo: false;
    workspaceId: string;
}
export interface BlocklyExternalProps {
    selector: string;
    inspect: any;
    code: any;
}

export type BlocklyProps = BlocklyExternalProps & BlocklyComponentConnectedDispatch & BlocklyComponentConnectedProps;
export type BlocklyState = Blockly & BlocklyComponentConnectedProps;

class BlocklyComponent extends React.PureComponent<BlocklyProps, BlocklyState> {
    blocklyRef: any | null = null;
    state: BlocklyState = {
        toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
        blockId: "",
        selectedTour: getInitData(),
        //tourXML: "",
        reload: false
    };

    componentDidMount(): void {
        //this.props.actions.periodicallySave();
    }
    workspaceDidChange = (workspace: any) => {
        const newJS: string = Blockly.JavaScript.workspaceToCode(workspace);
        const newXml = new XMLSerializer();
        const newXmlStr = newXml.serializeToString(Blockly.Xml.workspaceToDom(workspace));
        this.props.dispatch(editTourDB({ code: newXmlStr, codeJS: newJS, dateChange: "" }));
    };
    componentDidUpdate({ selector }: BlocklyProps): void {
        if (this.props.selector !== selector && this.state.blockId) {
            const workspaceSvg = this.blocklyRef.workspace.state.workspace;
            const block = workspaceSvg.getBlockById(this.state.blockId);
            const field = block.getField("NAME");
            //console.log("field >> ", field);
            if (field != "") {
                field.setText(this.props.selector);
                this.setState({
                    blockId: ""
                });
                this.props.dispatch(setCurrentSelector(""));
            }
            //console.log("selector >> ", this.props.selector);
        }
    }

    setBlocklyRef = (ref: any) => {
        this.blocklyRef = ref;
    };

    isCreated = false;

    onClickOnBlock = () => {
        const workspaceSvg = this.blocklyRef.workspace.state.workspace;
        const block = workspaceSvg.getBlockById(this.state.blockId);
        //console.log("Block >> ", block);
        if (block) {
            this.props.inspect();
        }
    };
    render = () => {
        if (this.blocklyRef && this.blocklyRef.workspace && !this.isCreated) {
            const workspaceSVG = this.blocklyRef.workspace.state.workspace;
            const onFirstComment = (event: WorkspaceEventType) => {
                if (event.type === Blockly.Events.UI) {
                    console.log("event", event);
                    if (event.element !== "click") return;
                    debugger;
                    const blockId = event.blockId || event.newValue || "";
                    this.setState({
                        blockId
                    });
                    if (blockId) {
                        const block = workspaceSVG.getBlockById(blockId);
                        //console.log("block", block);
                        //console.log("IN EVENT CONDITION", workspaceSVG, self);
                        if (block.type === "selector") {
                            this.onClickOnBlock();
                        }
                    }
                }
            };
            this.isCreated = true;
            workspaceSVG.addChangeListener(onFirstComment);
            //console.log(" initialXml >> ", this.props.tourXML);
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
                        colour: "#ccc",
                        snap: true
                    }
                }}
                initialXml={this.props.selectedTour.code}
                wrapperDivClassName="d-flex flex"
                workspaceDidChange={this.workspaceDidChange}
            />
        );
    };
}
//ConfigFiles.INITIAL_XML
export interface BlocklyComponentConnectedDispatch {
    dispatch: Dispatch;
    actions: {
        periodicallySave: typeof periodicallySave;
    };
}
export interface BlocklyComponentConnectedProps {
    selectedTour: TourType;
}
export default connect<
    BlocklyComponentConnectedProps,
    BlocklyComponentConnectedDispatch,
    BlocklyExternalProps,
    StoreType
>(
    ({ SelectedTourState }) => ({
        selectedTour: SelectedTourState.tourDB
    }),
    dispatch => ({
        dispatch,
        actions: bindActionCreators(
            {
                periodicallySave
            },
            dispatch
        )
    })
)(BlocklyComponent) as any;
