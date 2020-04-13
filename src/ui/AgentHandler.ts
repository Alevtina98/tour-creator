import { connectSuccess } from "./actions/mainAction";
import { setCurrentSelector, setInspectDisabled, setInspectEnabled } from "./actions/inspectAction";
import injectDebugger from "./injectDebugger";
import port from "./port";
import { Dispatch } from "redux";
import { addErrorRunTour, setErrorsRunTour } from "./actions/selectedTourAction";

/*
 * agent -> content-script.js -> background.js -> **dev tools**
 */
class AgentHandler {
    dispatch: Dispatch;
    currentSelected: string | null = null;

    handlers: any = {
        connected: () => this.dispatch(connectSuccess()),

        reloaded: () => injectDebugger(),

        selected: (data: { id: string }) => {
            const { id } = data;
            this.dispatch(setCurrentSelector(id));
            this.currentSelected = id;
            console.log("Найден selector", data);
        },

        //enabledSelectMode: () => this.dispatch(setInspectEnabled()),
        disabledSelectMode: () => {
            this.dispatch(setInspectDisabled());
        },
        newError: (error: string) => {
            this.dispatch(addErrorRunTour(error));
            console.log("new error >> ", error);
        },
        clearError: () => {
            console.log("clear error ");
            this.dispatch(setErrorsRunTour([]));
        }
    };

    constructor(dispatch: Dispatch) {
        this.dispatch = dispatch;
        port!.onMessage.addListener(msg => {
            this.handleMessage(msg);
        });
    }
    handleMessage = (message: any) => {
        const handler = this.handlers[message.name];
        if (!handler) {
            console.warn("ОШИБКА: не найден обработчик для пришедшего сообщения " + message.name);
            return;
        }

        handler(message.data);
    };
}

export default AgentHandler;
