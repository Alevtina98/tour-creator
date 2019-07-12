var React = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var EntityList = require('./EntityList');
var GameControls = require('./GameControls');

var Main = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin('ConnectionStore')
  ],


    getStateFromFlux: function() {
    var store = this.getFlux().store('ConnectionStore');

    return {
      isConnected: store.isConnected
    };
  },

  renderLoaded: function() {
    return (
      <div className="panel panel-default">

        <div className="panel-heading">
          <GameControls />
         <h3 className="panel-title" >
            {/*Create Tour*/}
          </h3>
        </div>
        <div className="panel-body">
          <ul>
            <h4>{this.selector}</h4>
            Functions:
            <li>dark({this.selector});</li>
            <li>Descriptor({this.selector}, "This is your Selector"); </li>
          </ul>
        </div>

      </div>
    );
  },

  renderNoConnection: function() {
    return (
        <div className="panel panel-default">

          <div className="panel-heading">
            <GameControls />
          </div >
            Sorry, not connection :(
        </div>
    );
  },

  render: function() {
    //this.state.isConnected = false;
    return (
      <div className="main-container">
        { this.state.isConnected ? this.renderLoaded() : this.renderNoConnection() }
      </div>
    );
  }
});

module.exports = Main;
