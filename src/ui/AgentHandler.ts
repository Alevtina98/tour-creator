import {connectSuccess, setCurrentSelector, setInspectDisabled, setInspectEnabled} from "./actions/mainAction";
import injectDebugger from "./injectDebugger";
import port from "./port";
import {Dispatch} from "redux";

class AgentHandler {
  dispatch: Dispatch;
  currentSelected: string | null = null;

  handlers: any = {
    connected: () => this.dispatch(connectSuccess()),

    reloaded: () => injectDebugger(),

    tick: (data: { id: string }) => {
      const { id } = data;
      if (this.currentSelected !== id) {
        this.dispatch(setCurrentSelector(id));
        this.currentSelected = id;
      }
      console.log("Selector",data);
    },

    enabledSelectMode: () => this.dispatch(setInspectEnabled()),
    disabledSelectMode: () => this.dispatch(setInspectDisabled())
  };

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;

    port.onMessage.addListener((msg) => {
      this.handleMessage(msg);
    });
  }



  handleMessage = (message: any) => {
    const handler = this.handlers[message.name];
    if (!handler) {
      console.warn('No handler found for event ' + message.name);
      return;
    }

    handler(message.data);
  }

}

export default AgentHandler;
