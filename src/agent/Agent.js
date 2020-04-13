import sendMessage from "./util/sendMessage";
import Selector from "./Selector";
import "./style/agentStyle.less";
import TourHelper from "./TourHelper/utils";
import { disposeEvent } from "./util/utils";

const _ = require("lodash");

const GAME_OBJECT_ID = "game_object";

export const getCodeEval = function(code) {
    const script = `${code.replace(`"`, "")}`;
    const scriptWithoutComments = script.split(/\/\/.*\n|\/\*\*\n.*\*.*\n.*\*\//g).join("");
    const scriptWithoutCommentsAndEnter = scriptWithoutComments.split(/\n/g).join("");
    return `eval("${scriptWithoutCommentsAndEnter}")`;
};
class Agent {
    /**
     * TODO: why is this even a Class? doesn't really do anything particularly ~object-oriented~
     * not sure what to refactor it into, tho
     */
    constructor(c) {
        //const helperClass = TourHelper.name;
        this.window = c;
        console.log("Agent constructor (c) >> ", c);
        // Agent state
        this.subscribedEntityId = null; //идентификатор события
        // Kick off debug loop and message handler
        this.initDevtoolsMessageListener();
        this.handlers = {
            // Broadcast when the dev tools are opened
            connect: function() {
                console.log("Browser connect handler -> connected");
                sendMessage("connected");
            },
            enableSelectMode: () => {
                console.log("режим инспекции включен");
                this.attachSelectClickHandler();
            },

            disableSelectMode: () => {
                this.clearAfterSelectMode();
            },
            runScript: code => {
                console.log("Код тура", code);
                const el = this.window.document.createElement("script");
                el.innerText = getCodeEval(code);
                try {
                    this.window.document.body.appendChild(el);
                    console.log(el);
                    console.log("скрипт тура добавлен");
                    TourHelper.showViewerInterface();
                } catch (e) {
                    console.log("ОШИБКА: не удалось добавить скрипт тура", e);
                }
            },
            disableRunScript: () => {
                TourHelper.endTour();
            }
        };
    }

    initDevtoolsMessageListener() {
        window.addEventListener("message", event => {
            // Only accept messages from same frame
            // event.source - источник события
            if (event.source !== window) {
                return;
            }

            const message = event.data;

            // Only accept messages of correct format (our messages)
            if (typeof message !== "object" || message === null || message.source !== "coquette-inspect-devtools") {
                return;
            }

            this.handleMessage(message);
        });
    }

    reportEntities() {
        const id = this.subscribedEntityId;
        sendMessage("selected", {
            id
        });
    }
    getClickElements() {
        return [...document.querySelectorAll("a"), ...document.querySelectorAll("button")];
    }
    //включен режим инспектора
    attachSelectClickHandler() {
        let savedCallback;
        let target;
        let outlineStyle;
        let outlineColor;
        let borderStyle;
        let borderColor;
        if (this._findTargetCb) {
            // already enabled
            return;
        }
        this._highlightTargetCb = e => {
            //target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            let el = e.target;
            while (el.parentNode && !el.hasAttribute("data-contol-type")) {
                el = el.parentNode;
            }
            if (!el.parentNode) {
                target = e.target;
            } else {
                target = el;
            }
            if (target.style.outlineStyle || (target.style.outlineStyle = "none")) {
                borderStyle = target.style.border;
                borderColor = target.style.borderColor;
                target.style.border = "solid";
                target.style.borderColor = "black";
            } else {
                outlineStyle = target.style.outlineStyle;
                outlineColor = target.style.borderColor;
                target.style.outlineStyle = "solid";
                target.style.outlineColor = "black";
            }

            /*if (target.onclick) {
                console.warn("123");
                savedCallback = target.onclick;
                target.onclick = () => {};
            }*/
        }; //обрабатываем НАВЕДЕНИЕ
        this._outTargetCb = e => {
            // target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            if (!target) {
                return;
            }
            target.style.outlineStyle = outlineStyle;
            target.style.border = borderStyle;
            target.style.outlineColor = outlineColor;
            target.style.borderColor = borderColor;

            if (target.onclick) {
                console.warn("вернули");
                target.onclick = savedCallback;
            }
            target = null;
        }; //обрабатываем вывод курсора из элемента
        this._closeOnEsc = event => {
            if (event.key == "Escape") {
                disposeEvent(event);
                this.clearAfterSelectMode();
                sendMessage("disabledSelectMode");
            }
        };
        this._findTargetCb = e => {
            if (!target) {
                return;
            }
            disposeEvent(event);
            // target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            //свойство data-control-type
            const str = Selector(target);
            const element = document.querySelector(str);
            const contol = element.classList.contains("data-contol-type");
            const layout = element.classList.contains("data-layout-type");
            /* if (!element.hasAttribute("data-contol-type") && !element.hasAttribute("data-layout-type")) {
                return;
                //data - layout - type;
            }*/
            this.subscribedEntityId = str; //matching.__inspect_uuid__;
            this.clearAfterSelectMode();
            sendMessage("disabledSelectMode");
            this.reportEntities();
        };
        this.clearAfterSelectMode = () => {
            if (target) {
                target.style.outlineStyle = outlineStyle;
                target.style.border = borderStyle;
                target.style.outlineColor = outlineColor;
                target.style.borderColor = borderColor;
                if (target.onclick) {
                    console.warn("вернули обработчик");
                    target.onclick = savedCallback;
                }
                target = null;
            }
            savedCallback = null;
            this.removeSelectClickHandler();
        };
        //sendMessage("enabledSelectMode");
        this.addSelectClickHandler();
    }

    addSelectClickHandler() {
        this.window.addEventListener("mouseover", this._highlightTargetCb);
        this.window.addEventListener("mouseout", this._outTargetCb);
        this.window.addEventListener("keypress", this._closeOnEsc, true);
        this.window.addEventListener("click", this._findTargetCb, true);
        this.getClickElements().forEach(el => {
            el.addEventListener("click", this._findTargetCb);
        });
        this.window.document.body.classList.add("__wait-for-select");
    }
    removeSelectClickHandler() {
        this.window.removeEventListener("mouseover", this._highlightTargetCb);
        this.window.removeEventListener("mouseout", this._outTargetCb);
        this.window.removeEventListener("keydown", this._closeOnEsc, true);
        this.window.removeEventListener("click", this._findTargetCb, true);
        this.getClickElements().forEach(el => {
            el.removeEventListener("click", this._findTargetCb);
        });
        delete this._findTargetCb;
        delete this._highlightTargetCb;
        this.window.document.body.classList.remove("__wait-for-select");
    }

    handleMessage(message) {
        const handler = this.handlers[message.name];
        if (!handler) {
            console.warn("No handler found for event " + name);
            this.removeSelectClickHandler();
            return;
        }

        handler.call(this, message.data);
    }
}

export default Agent;
