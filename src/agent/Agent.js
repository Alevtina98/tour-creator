import sendMessage from "./util/sendMessage";
import Selector from "./Selector";
import "./style/agentStyle.less";
//import unique from 'unique-selector'
import serializeEntity from "./util/serializeEntity";
import deepUpdate from "../common/deepUpdate";

const _ = require("lodash");

const GAME_OBJECT_ID = "game_object";

class Agent {
    /**
     * TODO: why is this even a Class? doesn't really do anything particularly ~object-oriented~
     * not sure what to refactor it into, tho
     */
    constructor(c) {
        this.window = c;
        console.log(c);
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

            // subscribeToEntity: function (data) {
            //   this.subscribedEntityId = data.entityId;
            // },
            //
            // unsubscribeFromEntity: function (/*data*/) {
            //   this.subscribedEntityId = null;
            // },

            runScript: code => {
                const el = this.window.document.createElement("script");
                el.innerText = `eval("${code.replace(`"`, "")}")`;
                this.window.document.body.appendChild(el);

            },

            enableSelectMode: () => {
                this.attachSelectClickHandler();
            },

            disableSelectMode: () => {
                this.removeSelectClickHandler();
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
        sendMessage("tick", {
            id
        });
    }
    getClickElements() {
        return [...document.querySelectorAll("a"), ...document.querySelectorAll("button")];
    }
    //включен режим инспектора
    attachSelectClickHandler() {
        if (this._findTargetCb) {
            // already enabled
            return;
        }

        //обрабатываем КЛИК
        this._findTargetCb = e => {
            //event
            e.stopPropagation(); //Прекращает дальнейшую передачу текущего события
            e.preventDefault(); //запрещает исполнение метода по умолчанию, предназначенного для данного события
            const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            const str = Selector(target);
            console.log("str >> ", str);
            target.style.outlineStyle = "none";
            this.subscribedEntityId = str; //matching.__inspect_uuid__;

            this.removeSelectClickHandler();
            this.reportEntities();
        };
        //обрабатываем НАВЕДЕНИЕ
        this._highlightTargetCb = e => {
            //event
            const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            // target.style.backgroundColor = "#ffffff";
            target.style.outlineStyle = "solid";
        };
        //обрабатываем вывод курсора из элемента
        this._outTargetCb = e => {
            //event
            const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
            // target.style.backgroundColor = "#ffffff";
            target.style.outlineStyle = "none";
        };
        this.window.addEventListener("click", this._findTargetCb);
        this.window.addEventListener("mouseover", this._highlightTargetCb);
        this.window.addEventListener("mouseout", this._outTargetCb);
        this.getClickElements().forEach(el => {
            el.addEventListener("click", this._findTargetCb);
        });
        // this.canvas.style.cursor = 'pointer';
        //Window.setCursor("wait");
        this.window.document.body.classList.add("__wait-for-select");

        // window.applicationCache;

        sendMessage("enabledSelectMode");
    }

    removeSelectClickHandler() {
        this.window.removeEventListener("click", this._findTargetCb);
        this.window.removeEventListener("mouseover", this._highlightTargetCb);
        this.window.removeEventListener("mouseout", this._outTargetCb);
        this.getClickElements().forEach(el => {
            el.removeEventListener("click", this._findTargetCb);
        });
        delete this._findTargetCb;
        delete this._highlightTargetCb;
        this.window.document.body.classList.remove("__wait-for-select");

        sendMessage("disabledSelectMode");
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
