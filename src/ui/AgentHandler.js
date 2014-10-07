var port = require('./port');

var AgentHandler = function(flux) {
  this.flux = flux;

  port.onMessage.addListener((msg) => { this.handleMessage(msg); });
};

AgentHandler.prototype.handleMessage = function(msg) {
  if (msg.name === 'connected') {
    // document.write('connected');
  } else if (msg.name === 'entities') {
    this.flux.actions.entities.didGetEntities(msg.data.entities);
  } else if (msg.name === 'paused') {
    this.flux.actions.game.didPauseGame();
  } else if (msg.name === 'unpaused') {
    this.flux.actions.game.didUnpauseGame();
  } else {
    // console.log('unknown event type', msg.name);
  }
};


module.exports = AgentHandler;
