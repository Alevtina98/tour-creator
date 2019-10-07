import React, { MutableRefObject } from "react";
import ReactBlocklyComponent from "react-blockly-component";
import ConfigFiles from "../../initContent/content.jsx";
import parseWorkspaceXml from "./blockly/BlocklyHelper";
import { connect } from "react-redux";
import { StoreType } from "../reducers";
import { Dispatch } from "redux";
import { setTourXML } from "../actions/selectedTourAction";
import { ScriptValue } from "../util/indexedDB";
import {setLoadBocklyDisabled} from "../actions/mainAction";

export interface BlocklyState {
    toolboxCategories: any[];
    blockId: string;
    selectedTour: ScriptValue;
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
    code: MutableRefObject<HTMLTextAreaElement | undefined>;
}

export type BlocklyProps = BlocklyExternalProps & BlocklyComponentConnectedDispatch & BlocklyComponentConnectedProps;

class BlocklyComponent extends React.PureComponent<BlocklyProps, BlocklyState> {
    blocklyRef: any | null = null;
    state: BlocklyState = {
        toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
        blockId: "",
        selectedTour: {
            name: "",
            date: Date(),
            desc: "newTour",
            code: ""
        }
    };
    componentDidMount(): void {
        //маппинг значений из store
        window.setTimeout(() => {
            this.setState({
                toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML).concat([
                    {
                        name: "Tour",
                        blocks: [
                            {
                                type: "desc"
                            },
                            { type: "dark" },
                            { type: "selector" }
                        ]
                    }
                ])
            });
           // this.props.dispatch(setLoadBocklyDisabled());
        }, 1);
        // this.props.dispatch(setLoadBocklyDisabled());

    }
    workspaceDidChange = (workspace: any) => {
        const code: string = Blockly.JavaScript.workspaceToCode(workspace);
        //console.log("code >> ", code);
        if (this.props.code && this.props.code.current) {
            this.props.code.current.value = code;
        }
        const s = new XMLSerializer();
        const newXmlStr = s.serializeToString(Blockly.Xml.workspaceToDom(workspace));
        this.props.dispatch(setTourXML(newXmlStr)); //Отправка экшена
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
                if (/*event.type == Blockly.Events.CHANGE ||*/ event.type === Blockly.Events.UI) {
                    //console.log("event", event);
                    if (event.element !== "click") return;
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
            console.log(" initialXml >> ", this.props.tourXML);
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
                initialXml={this.props.tourXML}
                wrapperDivClassName="fill-height"
                workspaceDidChange={this.workspaceDidChange}
            />
        );
    };
}
//ConfigFiles.INITIAL_XML
export interface BlocklyComponentConnectedDispatch {
    dispatch: Dispatch;
}
export interface BlocklyComponentConnectedProps {
    tourXML: string;
}
export default connect<
    BlocklyComponentConnectedProps,
    BlocklyComponentConnectedDispatch,
    BlocklyExternalProps,
    StoreType
>(
    ({ SelectedTourState }) => ({
        tourXML: SelectedTourState.tourXML
    }),
    dispatch => ({
        dispatch
    })
)(BlocklyComponent) as any;
