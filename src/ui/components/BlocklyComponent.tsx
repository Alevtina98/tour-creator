import React from "react";
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from "../../initContent/content.jsx";
import { connect } from "react-redux";
import { StoreType } from "../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { periodicallySave, setSelectedTour } from "../actions/selectedTourAction";
import { setCurrentSelector } from "../actions/inspectAction";
import { getInitData, getJsSettersNameAndDesc, TourType } from "../util/tour";
import parseWorkspaceXml from "../util/BlocklyHelper";

export interface Blockly {
    toolboxCategories: any[];
    blockId: string;
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
        selectedTour: getInitData()
    };
    clickOnSelectorBlockListener = (event: WorkspaceEventType) => {
        const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        if (event.type === Blockly.Events.UI) {
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
        // @ts-ignore
        const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        workspaceSVG.addChangeListener(this.clickOnSelectorBlockListener);
    }
    componentWillUnmount(): void {
        const workspaceSVG = this.blocklyRef.workspace.state.workspace;
        workspaceSVG.removeChangeListener(this.clickOnSelectorBlockListener);
    }
    workspaceDidChange = (workspace: any) => {
        const js: string = Blockly.JavaScript.workspaceToCode(workspace);
        const xmlSerialize = new XMLSerializer();
        const xml: string = xmlSerialize.serializeToString(Blockly.Xml.workspaceToDom(workspace));
        if (xml !== this.props.selectedTour.code) {
            const modifiedTour: TourType = {
                id: this.props.selectedTour.id,
                name: this.props.selectedTour.name,
                desc: this.props.selectedTour.desc,
                code: xml,
                codeJS: getJsSettersNameAndDesc(this.props.selectedTour.name, this.props.selectedTour.desc || "") + js,
                dateCreate: this.props.selectedTour.dateCreate,
                dateChange: ""
            };
            this.props.dispatch(setSelectedTour(modifiedTour));
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
                    },
                    zoom: { controls: true, startScale: 1.0, maxScale: 3, minScale: 0.5, scaleSpeed: 1.1 },
                    trashcan: true,
                    media: "../media/",
                    move: {
                        scrollbars: true,
                        drag: true,
                        wheel: true
                    }
                }}
                initialXml={this.props.selectedTour.code} //ConfigFiles.INITIAL_XML
                wrapperDivClassName="d-flex flex"
                workspaceDidChange={this.workspaceDidChange}
            />
        );
    };
}

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
