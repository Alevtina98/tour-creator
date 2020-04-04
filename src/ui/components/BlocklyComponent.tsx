import React from "react";
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from "../../initContent/content.jsx";
import parseWorkspaceXml from "./blockly/BlocklyHelper";
import { connect } from "react-redux";
import { StoreType } from "../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { periodicallySave, setCurrentSelectedTour } from "../actions/selectedTourAction";
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
    clickOnSelectorBlockListener = (event: WorkspaceEventType) => {
        const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        if (event.type === Blockly.Events.UI) {
            //console.log("event", event);
            if (event.element !== "click") return;
            const blockId = event.blockId || event.newValue || "";
            this.setState({
                blockId
            });
            if (blockId) {
                const block = workspaceSVG.getBlockById(blockId);
                if (block.type === "selector") {
                    this.onClickOnBlock();
                }
            }
        }
    };
    componentDidMount(): void {
        //this.props.actions.periodicallySave();
        const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        workspaceSVG.addChangeListener(this.clickOnSelectorBlockListener);
    }
    workspaceDidChange = (workspace: any) => {
        const js: string = Blockly.JavaScript.workspaceToCode(workspace);
        const xmlSerialize = new XMLSerializer();
        const xml: string = xmlSerialize.serializeToString(Blockly.Xml.workspaceToDom(workspace));
        if (xml !== this.props.selectedTour.code) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this.props.dispatch(setCurrentSelectedTour(null, null, xml, js, null));
        }
    };

    componentDidUpdate({ selector }: BlocklyProps): void {
        if (this.props.selector !== selector && this.state.blockId) {
            const workspaceSvg = this.blocklyRef.workspace.state.workspace;
            const block = workspaceSvg.getBlockById(this.state.blockId);
            const field = block.getField("NAME");
            if (field != "") {
                field.setText(this.props.selector);
                this.setState({
                    blockId: ""
                });
                this.props.dispatch(setCurrentSelector(""));
            }
        }
    }

    setBlocklyRef = (ref: any) => {
        this.blocklyRef = ref;
    };

    isCreated = false;

    onClickOnBlock = () => {
        const workspaceSvg = this.blocklyRef.workspace.state.workspace;
        const block = workspaceSvg.getBlockById(this.state.blockId);
        if (block) {
            this.props.inspect();
        }
    };
    render = () => {
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
        selectedTour: SelectedTourState.selectedTour
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
