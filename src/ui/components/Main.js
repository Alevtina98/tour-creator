/** @jsx React.DOM */

var React = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);
var EntityList = require('./EntityList');
var GameState = require('./GameState');

var Main = React.createClass({
  mixins: [FluxMixin],

  render: function() {
    return (
      <div>
        <h3>Game State</h3>
        <GameState />
        <h3>Entities</h3>
        <EntityList />
      </div>
    );
  }
});

module.exports = Main;
