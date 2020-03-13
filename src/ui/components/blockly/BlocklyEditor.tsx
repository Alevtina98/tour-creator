import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";

import BlocklyToolbox from "./BlocklyToolbox";
import BlocklyWorkspace from "./BlocklyWorkspace";

interface Block {
    type: string;
    shadow: boolean;
    fields: object;
    values: object;
    statements: object;
    next: object;
    mutation: {
        attributes: object;
        innerContent: string;
    };
}
export interface CategoryNonRecursive {
    type: string;
    name: string;
    custom: string;
    colour: string;
    blocks: any[];
}
export interface Category extends CategoryNonRecursive {
    categories: any[];
}
export interface BlocklyEditorProps extends Block, Category {
    toolboxBlocks: Block[];
    toolboxCategories: Category[];
    initialXml: string;
    workspaceConfiguration: object; // eslint-disable-line react/forbid-prop-types
    wrapperDivClassName: string;
    processToolboxCategory: any;
    onImportXmlError: any;
    xmlDidChange: any;
    workspaceDidChange: any;
}

class BlocklyEditor extends React.Component<BlocklyEditorProps> {
    toolbox = React.createRef<BlocklyToolbox>();
    workspace = React.createRef<BlocklyWorkspace>();
    static defaultProps: BlocklyEditorProps = {
        type: "",
        shadow: false,
        fields: {},
        values: {},
        statements: {},
        next: {},
        mutation: {
            attributes: {},
            innerContent: ""
        },
        name: "",
        custom: "",
        colour: "",
        blocks: [],
        categories: [],
        initialXml: "",
        workspaceConfiguration: {},
        wrapperDivClassName: "",
        toolboxBlocks: [],
        toolboxCategories: [],
        processToolboxCategory: null,
        onImportXmlError: null,
        xmlDidChange: null,
        workspaceDidChange: null
    };
    componentDidMount = () => {
        this.toolboxDidUpdate();

        if (this.xmlDidChange) {
            if (typeof console !== "undefined") {
                console.error(
                    "Warning: xmlDidChange is deprecated and will be removed in future versions! Please use workspaceDidChange instead."
                );
            }
        }
    };

    componentDidUpdate = (prevProps: any) => {
        if (
            (this.props.toolboxBlocks &&
                !Immutable.fromJS(this.props.toolboxBlocks).equals(Immutable.fromJS(prevProps.toolboxBlocks))) ||
            (this.props.toolboxCategories &&
                !Immutable.fromJS(this.props.toolboxCategories).equals(Immutable.fromJS(prevProps.toolboxCategories)))
        ) {
            this.toolboxDidUpdate();
        }
    };

    toolboxDidUpdate = () => {
        const workspaceConfiguration = this.props.workspaceConfiguration || {};
        if (this.workspace.current && !workspaceConfiguration && this.toolbox.current) {
            this.workspace.current.toolboxDidUpdate(this.toolbox.current.getRootNode());
        }
    };

    xmlDidChange = (newXml: any) => {
        if (this.props.xmlDidChange) {
            this.props.xmlDidChange(newXml);
        }
    };

    workspaceDidChange = (workspace: any) => {
        if (this.props.workspaceDidChange) {
            this.props.workspaceDidChange(workspace);
        }
    };

    importFromXml = (xml: any) => {
        this.workspace.current ? this.workspace.current.importFromXml(xml) : "";
    };

    resize = () => {
        this.workspace.current ? this.workspace.current.resize() : "";
    };

    render = () => {
        let toolboxMode;
        if (this.props.toolboxCategories) {
            toolboxMode = "CATEGORIES";
        } else if (this.props.toolboxBlocks) {
            toolboxMode = "BLOCKS";
        }

        return (
            <div className={this.props.wrapperDivClassName}>
                <BlocklyToolbox
                    categories={Immutable.fromJS(this.props.toolboxCategories)}
                    blocks={Immutable.fromJS(this.props.toolboxBlocks)}
                    didUpdate={this.toolboxDidUpdate}
                    processCategory={this.props.processToolboxCategory}
                    ref={this.toolbox}
                />
                <BlocklyWorkspace
                    ref={this.workspace}
                    initialXml={this.props.initialXml}
                    onImportXmlError={this.props.onImportXmlError}
                    toolboxMode={toolboxMode}
                    xmlDidChange={this.xmlDidChange}
                    workspaceDidChange={this.workspaceDidChange}
                    wrapperDivClassName={this.props.wrapperDivClassName}
                    workspaceConfiguration={this.props.workspaceConfiguration}
                />
            </div>
        );
    };
}

export default BlocklyEditor;
