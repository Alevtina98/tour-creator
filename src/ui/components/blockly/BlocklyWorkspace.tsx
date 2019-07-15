import React from 'react';
// import Blockly from "google-blockly";
function debounce(func, wait) {
  let timeout;

  return function debouncedFunction(...args) {
    const context = this;
    const later = function later() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

class BlocklyWorkspace extends React.Component {

  static defaultProps = {
    initialXml: null,
    workspaceConfiguration: null,
    wrapperDivClassName: null,
    xmlDidChange: null,
    workspaceDidChange: null,
    onImportXmlError: null,
    toolboxMode: 'BLOCKS',
  };

  constructor(props) {
    super(props);

    this.state = {
      workspace: null,
      xml: this.props.initialXml,
    };
  }

  componentDidMount = () => {
    // TODO figure out how to use setState here without breaking the toolbox when switching tabs
    this.state.workspace = window.Blockly.inject(
      this.editorDiv,
      {
        ...this.props.workspaceConfiguration,
        toolbox: this.dummyToolbox,
      },
    );

    if (this.state.xml) {
      if (this.importFromXml(this.state.xml)) {
        this.xmlDidChange();
      } else {
        this.setState({ xml: null }, this.xmlDidChange);
      }
    }

    this.state.workspace.addChangeListener(this.workspaceDidChange);

    this.state.workspace.addChangeListener(debounce(() => {
      const newXml = BlocklyComponent.Xml.domToText(BlocklyComponent.Xml.workspaceToDom(this.state.workspace));
      if (newXml === this.state.xml) {
        return;
      }

      this.setState({ xml: newXml }, this.xmlDidChange);
    }, 200));
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.initialXml !== newProps.initialXml) {
      this.setState({ xml: newProps.initialXml });
    }
  }

  shouldComponentUpdate = () => false

  componentWillUnmount = () => {
    if (this.state.workspace) {
      this.state.workspace.dispose();
    }
  }

  importFromXml = (xml) => {
    try {
      BlocklyComponent.Xml.domToWorkspace(BlocklyComponent.Xml.textToDom(xml), this.state.workspace);
      return true;
    } catch (e) {
      if (this.props.onImportXmlError) {
        this.props.onImportXmlError(e);
      }
      return false;
    }
  }

  xmlDidChange = () => {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(this.state.xml);
    }
  }

  workspaceDidChange = () => {
    if (this.props.workspaceDidChange) {
      this.props.workspaceDidChange(this.state.workspace);
    }
  }

  toolboxDidUpdate = (toolboxNode) => {
    if (toolboxNode && this.state.workspace) {
      this.state.workspace.updateToolbox(toolboxNode);
    }
  }

  resize = () => {
    BlocklyComponent.svgResize(this.state.workspace);
  }

  render = () => {
    // We have to fool Blockly into setting up a toolbox with categories initially;
    // otherwise it will refuse to do so after we inject the real categories into it.
    let dummyToolboxContent;
    if (this.props.toolboxMode === 'CATEGORIES') {
      dummyToolboxContent = (
        <category name="Dummy toolbox" />
      );
    }

    return (
      <div className={this.props.wrapperDivClassName}>
        <div style={{ display: 'none' }} ref={(dummyToolbox) => { this.dummyToolbox = dummyToolbox; }}>
          {dummyToolboxContent}
        </div>
        <div
          className={this.props.wrapperDivClassName}
          ref={(editorDiv) => { this.editorDiv = editorDiv; }}
        />
      </div>
    );
  }
}

export default BlocklyWorkspace;
