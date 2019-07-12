import sendMessage from "./util/sendMessage";
import Selector from "./Selector";
//import unique from 'unique-selector'
import serializeEntity from "./util/serializeEntity";

import deepUpdate from "../common/deepUpdate";

const _ = require('lodash');
const GAME_OBJECT_ID = 'game_object';

/**
 * TODO: why is this even a Class? doesn't really do anything particularly ~object-oriented~
 * not sure what to refactor it into, tho
 */
// c = window
const Agent = function (c) {
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
  this.initDebugLoop();
  this.initDevtoolsMessageListener();
};

Agent.prototype.initDebugLoop = function() {
  const debugLoop = () => {
    this.reportEntities();

    // Ensure that this isn't re-enqueued on the same frame, or the runner gets stuck in an endless
    // loop.
    // TODO: setTimeout() seems like a non-optimal way to do this, could end up missing frames
    // or hurting perf? :C
    setTimeout(debugLoop);
  };
  debugLoop();

  // this.c.runner.add(undefined, debugLoop);
};

Agent.prototype.initDevtoolsMessageListener = function() {
  window.addEventListener('message', function(event) {
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
  }.bind(this));
};

Agent.prototype.reportEntities = function() {
  // var entities = this.c.entities.all().concat(this.game);
  //
  // var entitiesList = entities.map((entity) => {
  //   return {
  //     displayName: entity.displayName || entity.constructor.name,
  //     entityId: entity.__inspect_uuid__
  //   };
  // });

  const id = this.subscribedEntityId;


  sendMessage('tick', {
    id
    //entities: entitiesList,
    //subscribedEntity: this.serializeSubscribedEntity(id, entities)
  });
};

Agent.prototype.serializeSubscribedEntity = function(id, entities) {
  if (this.subscribedEntityId === null) {
    return;
  }

  const entity = entities.filter((entity) => id === entity.__inspect_uuid__)[0];

  if (!entity) {
    this.subscribedEntityId = null;
    return;
  }

  return serializeEntity(entity, entities);
};

Agent.prototype.handlers = {

  // Broadcast when the dev tools are opened
  connect: function() {
    console.log("Browser connect handler -> connected")
    sendMessage('connected');
  },

  pause: function() {
    // this.c.ticker.stop();
    sendMessage('paused');
  },

  unpause: function() {
    // this.c.ticker.start();
    sendMessage('unpaused');
  },

  step: function() {
    // this.c.ticker.start();  // this sets a cb for the requestAnimationFrame() loop..
    // this.c.ticker.stop();   // ...and this unsets it, so that only one frame is run
  },

  updateProperty: function(data) {
    /* jshint evil: true */

    // find entity by UUID
    let entity;
    if (data.entityId === GAME_OBJECT_ID) {
      entity = this.game;
    } else {
      entity = this.c.entities.all()
        .filter((entity) => entity.__inspect_uuid__ === data.entityId)[0];
    }

    if (!entity) {
      throw new Error('No entity found with id ' + data.entityId);
    }

    let val;
    try {
      val = eval(data.value);
    } catch(e) {
      // Don't update anything if the passed expression is invalid
      return;
    }

    deepUpdate(entity, data.path, val);
  },

  subscribeToEntity: function(data) {
    this.subscribedEntityId = data.entityId;
  },

  unsubscribeFromEntity: function(/*data*/) {
    this.subscribedEntityId = null;
  },

  enableSelectMode: function() {
    this.attachSelectClickHandler();
  },

  disableSelectMode: function() {
    this.removeSelectClickHandler();
  }
};


Agent.prototype.attachSelectClickHandler = function() {
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
  };

  this.c.addEventListener('click', this._findTargetCb);
  // this.canvas.style.cursor = 'pointer';

  sendMessage('enabledSelectMode');
};

Agent.prototype.removeSelectClickHandler = function() {
  this.c.removeEventListener('click', this._findTargetCb);
  delete this._findTargetCb;
  // this.canvas.style.cursor = 'default';

  sendMessage('disabledSelectMode');
};

Agent.prototype.handleMessage = function(message) {
  const handler = this.handlers[message.name];
  if (!handler) {
    console.warn('No handler found for event ' + name);
    return;
  }

  handler.call(this, message.data);
};

export default Agent;
