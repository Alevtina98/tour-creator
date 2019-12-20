import { connectSuccess } from "./actions/mainAction";
import { setCurrentSelector, setInspectDisabled, setInspectEnabled } from "./actions/inspectAction";
import injectDebugger from "./injectDebugger";
import port from "./port";
import { Dispatch } from "redux";
import {addErrorRunTour} from "./actions/selectedTourAction";

/*
 * agent -> content-script.js -> background.js -> **dev tools**
 */
class AgentHandler {
    dispatch: Dispatch;
    currentSelected: string | null = null;

    //варианты обработчиков в зависимости от msg
    handlers: any = {
        connected: () => this.dispatch(connectSuccess()),

        reloaded: () => injectDebugger(),

        tick: (data: { id: string }) => {
            const { id } = data;
            //if (this.currentSelected !== id) {
            this.dispatch(setCurrentSelector(id));
            this.currentSelected = id;
            //}
            console.log("Selector", data);
        },

        enabledSelectMode: () => this.dispatch(setInspectEnabled()),
        disabledSelectMode: () => {
            this.dispatch(setInspectDisabled());
            //this.dispatch(setCurrentSelector(""));
        },
        newError: (error: string) => {
            this.dispatch(addErrorRunTour(error));
        }
    };

    constructor(dispatch: Dispatch) {
        this.dispatch = dispatch;

        port.onMessage.addListener(msg => {
            this.handleMessage(msg);
        });
    }
    handleMessage = (message: any) => {
        //выбираем обработчик по принятому сообщению
        const handler = this.handlers[message.name];
        if (!handler) {
            console.warn("No handler found for event " + message.name);
            return;
        }

        handler(message.data);
    };
}

export default AgentHandler;
