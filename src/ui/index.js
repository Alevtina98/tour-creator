require('../../style/main.less');

import React from "react";
var ReactDOM = require('react-dom');
var Main = require('./components/Main');

var injectDebugger = require('./injectDebugger');
var AgentHandler = require('./AgentHandler');

var Flux = require('fluxxor').Flux;
var actions = require('./actions');
var stores = require('./stores');

var flux = new Flux(stores, actions);

var agentHandler = new AgentHandler(flux);

injectDebugger();
class MainContainer extends Component {

}

window.addEventListener('load', function() {
  console.log(agentHandler.selector);
  ReactDOM.render(<Main flux={flux} selector = {agentHandler.selector}/>, document.getElementById('container'));

});
