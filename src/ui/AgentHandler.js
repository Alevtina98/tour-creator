import {connectSuccess, setCurrentSelector, setInspectDisabled, setInspectEnabled} from "./actions/mainAction";
import injectDebugger from "./injectDebugger";
import port from "./port";

const AgentHandler = function (dispatch) {
  this.dispatch = dispatch;
  this.currentSelected = "";

  port.onMessage.addListener((msg) => {
    this.handleMessage(msg);
  });

  this.handlers = {
    connected: () => this.dispatch(connectSuccess()),

    reloaded: () => injectDebugger(),

    tick: (data) => {
      if (typeof data === "object") {
        return;
      }
      // this.flux.actions.entities.didGetEntities({
      //   entities: data.entities,
      //   subscribedEntity: data.subscribedEntity
      // });
      if (this.currentSelected !== data) {
        console.log("selector >>", data);
        this.dispatch(setCurrentSelector(data));
        this.currentSelected = data;
      }
      // this.selector = data;
      // this.flux.actions.game.didTick();
    },

    enabledSelectMode: () => this.dispatch(setInspectEnabled()),
    disabledSelectMode: () => this.dispatch(setInspectDisabled())
  };
};

AgentHandler.prototype.handleMessage = function(message) {
  var handler = this.handlers[message.name];
  if (!handler) {
    console.warn('No handler found for event ' + message.name);
    return;
  }

  handler(message.data);
};

export default AgentHandler;
