import React from "react";
import BlocklyToolbox from "./BlocklyToolbox";

//import Blockly from "google-blockly";

function debounce(func: any, wait: any) {
    let timeout: any;

    return function debouncedFunction(...args: any) {
        const context: any = this;
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export interface BlocklyWorkspaceProps {
    initialXml: any;
    workspaceConfiguration: any;
    wrapperDivClassName: any;
    xmlDidChange: any;
    workspaceDidChange: any;
    onImportXmlError: any;
    toolboxMode: string;
}

export interface BlocklyWorkspaceState {
    workspace: any;
    xml: any;
}

declare let Blockly: any;

class BlocklyWorkspace extends React.Component<BlocklyWorkspaceProps, BlocklyWorkspaceState> {
    defaultProps: BlocklyWorkspaceProps = {
        initialXml: null,
        workspaceConfiguration: null,
        wrapperDivClassName: null,
        xmlDidChange: null,
        workspaceDidChange: null,
        onImportXmlError: null,
        toolboxMode: "BLOCKS",
    };
    state: BlocklyWorkspaceState = {
        workspace: null,
        xml: this.props.initialXml,
    };

    editorDiv = React.createRef();
    dummyToolbox = React.createRef();

    componentDidMount = () => {
        debugger;
        // TODO figure out how to use setState here without breaking the toolbox when switching tabs
        this.state.workspace = Blockly.inject(this.editorDiv.current, {
            ...this.props.workspaceConfiguration,
            toolbox: this.dummyToolbox.current,
        });

        this.state.workspace.registerButtonCallback("Inspector", () => {
            console.log("HELLO FROM CALLBACK");
        });
        if (this.state.xml) {
            if (this.importFromXml(this.state.xml)) {
                this.xmlDidChange();
            } else {
                this.setState({ xml: null }, this.xmlDidChange);
            }
        }
        this.state.workspace.addChangeListener(this.workspaceDidChange);
        this.state.workspace.addChangeListener(
            debounce(() => {
                const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.state.workspace));
                if (newXml === this.state.xml) {
                    return;
                }

                this.setState({ xml: newXml }, this.xmlDidChange);
            }, 200),
        );
    };

    componentWillReceiveProps = (newProps: any) => {
        if (this.props.initialXml !== newProps.initialXml) {
            this.setState({ xml: newProps.initialXml });
        }
    };

    shouldComponentUpdate = () => false;

    componentWillUnmount = () => {
        if (this.state.workspace) {
            this.state.workspace.dispose();
        }
    };

    importFromXml = (xml: any) => {
        try {
            this.blockly.Xml.domToWorkspace(this.blockly.Xml.textToDom(xml), this.state.workspace);
            return true;
        } catch (e) {
            if (this.props.onImportXmlError) {
                this.props.onImportXmlError(e);
            }
            return false;
        }
    };

    xmlDidChange = () => {
        if (this.props.xmlDidChange) {
            this.props.xmlDidChange(this.state.xml);
        }
    };

    workspaceDidChange = () => {
        if (this.props.workspaceDidChange) {
            this.props.workspaceDidChange(this.state.workspace);
        }
    };

    toolboxDidUpdate = (toolboxNode: any) => {
        if (toolboxNode && this.state.workspace) {
            this.state.workspace.updateToolbox(toolboxNode);
        }
    };

    resize = () => {
        this.blockly.svgResize(this.state.workspace);
    };

    render = () => {
        // We have to fool Blockly into setting up a toolbox with categories initially;
        // otherwise it will refuse to do so after we inject the real categories into it.
        let dummyToolboxContent;
        if (this.props.toolboxMode === "CATEGORIES") {
            dummyToolboxContent = <category name="Dummy toolbox" />;
        }

        return (
            <div className={this.props.wrapperDivClassName}>
                <xml style={{ display: "none" }} ref={this.dummyToolbox}>
                    {dummyToolboxContent}
                </xml>
                <div className={this.props.wrapperDivClassName} ref={this.editorDiv} />
            </div>
        );
    };
}

export default BlocklyWorkspace;
