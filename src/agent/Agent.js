import sendMessage from "./util/sendMessage";
import Selector from "./Selector";
//import unique from 'unique-selector'
import serializeEntity from "./util/serializeEntity";

import deepUpdate from "../common/deepUpdate";

const _ = require('lodash');
const GAME_OBJECT_ID = 'game_object';

class Agent {
  /**
   * TODO: why is this even a Class? doesn't really do anything particularly ~object-oriented~
   * not sure what to refactor it into, tho
   */
  constructor(c) {
    this.c = c;
    // this.game = c.entities.game;
    // this.Coquette = c.constructor;
    // this.canvas = c.renderer._ctx.canvas;

    // Agent state
    this.subscribedEntityId = null;

    // Register a displayName and ID on the game object
    // if (!this.game.displayName) {
    //   this.game.displayName = '<Game object>';
    // }
    // this.game.__inspect_uuid__ = GAME_OBJECT_ID;

    // Kick off debug loop and message handler
    this.initDevtoolsMessageListener();
    this.handlers = {
      // Broadcast when the dev tools are opened
      connect: function () {
        console.log("Browser connect handler -> connected")
        sendMessage('connected');
      },

      subscribeToEntity: function (data) {
        this.subscribedEntityId = data.entityId;
      },

      unsubscribeFromEntity: function (/*data*/) {
        this.subscribedEntityId = null;
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
    window.addEventListener('message', (event) => {
      // Only accept messages from same frame
      if (event.source !== window) {
        return;
      }

      const message = event.data;

      // Only accept messages of correct format (our messages)
      if (typeof message !== 'object' || message === null ||
          message.source !== 'coquette-inspect-devtools') {
        return;
      }

      this.handleMessage(message);
    });
  }

  reportEntities() {

    const id = this.subscribedEntityId;


    sendMessage('tick', {
      id
    });
  }


  attachSelectClickHandler() {
    if (this._findTargetCb) {
      // already enabled
      return;
    }

    this._findTargetCb = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const target = e.target;
      // const selector = new Selector;
      const str = Selector(target);
      console.log("str >> ", str);

      this.subscribedEntityId = str;//matching.__inspect_uuid__;


      this.removeSelectClickHandler();
      this.reportEntities();
    };

    this.c.addEventListener('click', this._findTargetCb);
    // this.canvas.style.cursor = 'pointer';

    sendMessage('enabledSelectMode');
  }

  removeSelectClickHandler() {
    this.c.removeEventListener('click', this._findTargetCb);
    delete this._findTargetCb;
    // this.canvas.style.cursor = 'default';

    sendMessage('disabledSelectMode');
  }

  handleMessage(message) {
    const handler = this.handlers[message.name];
    if (!handler) {
      console.warn('No handler found for event ' + name);
      return;
    }

    handler.call(this, message.data);
  }
}


export default Agent;
