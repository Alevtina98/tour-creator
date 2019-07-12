import {connectSuccess, setCurrentSelector, setInspectDisabled, setInspectEnabled} from "./actions/mainAction";
import injectDebugger from "./injectDebugger";
import port from "./port";

const AgentHandler = function (dispatch) {
  this.dispatch = dispatch;
  this.currentSelected = null;

  port.onMessage.addListener((msg) => {
    this.handleMessage(msg);
  });

  this.handlers = {
    connected: () => this.dispatch(connectSuccess()),

    reloaded: () => injectDebugger(),

    tick: (data) => {
      const { id } = data;
      // this.flux.actions.entities.didGetEntities({
      //   entities: data.entities,
      //   subscribedEntity: data.subscribedEntity
      // });
      if (this.currentSelected !== id) {
        console.log("selector >>", id);
        this.dispatch(setCurrentSelector(id));
        this.currentSelected = id;
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
