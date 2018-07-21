import React, { Component } from 'react';
import * as Constants from '../../shared/constants';
import socket from '../socket';
import Dice from '../../shared/models/dice';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      actionHistory: ["This", "Is", "A", "React", "Test"],
      actionType: Constants.SOCKET_EVENTS.DICE_ROLL,
      actionPayload: "",
      dice: new Dice(),
      currentRollerId: null,
      pointNumber: null,
      client: socket()
    };

    this.state.client.registerHandler(
      Constants.SOCKET_EVENTS.APP_NEW_STATE,
      payload => {
        this.setState({
          dice: new Dice(payload),
          currentRollerId: payload.currentRollerId,
          pointNumber: payload.pointNumber
        });
        this.addAction(payload);
      }
    );

    this.state.client.registerHandler(
      Constants.SOCKET_EVENTS.DICE_ROLLED, 
      payload => {
        this.setState({ dice: new Dice(payload) });
        this.addAction(payload);
      }
    );

    this.state.client.registerHandler(
      Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
      payload => {
        this.setState({ currentRollerId: payload.playerId });
        this.addAction(payload)
      }
    );

    this.state.client.registerHandler(
      Constants.SOCKET_EVENTS.POINT_CHANGED, 
      payload => {
        this.setState({ pointNumber: payload.pointNumber });
        this.addAction(payload)
      }
    );

    this.clearActionHistory = this.clearActionHistory.bind(this);
    this.getActionHistory = this.getActionHistory.bind(this);
    this.addAction = this.addAction.bind(this);
    this.performAction = this.performAction.bind(this);

    // Getters
    this.getCurrentRoller = this.getCurrentRoller.bind(this);
    this.getDiceTotal = this.getDiceTotal.bind(this);
    this.getPoint = this.getPoint.bind(this);

  }

  addAction(payload) {
    const updatedHistory = this.state.actionHistory.concat(
      JSON.stringify(payload)
    );
    this.setState( {actionHistory: updatedHistory} );
  }

  clearActionHistory() {
    this.setState({ actionHistory: []});
  }

  getActionHistory() {
    return this.state.actionHistory.join("\n\n");
  }

  performAction() {
    let jsonObj = {}
    try {
      jsonObj = JSON.parse(this.state.actionPayload);
    } catch (e) {}
    if (this.state.actionType === Constants.SOCKET_EVENTS.DICE_ROLL) {
      this.state.client.rollDice(
        jsonObj
      );
    } else if (this.state.actionType === Constants.SOCKET_EVENTS.BET_ADD) {
      this.state.client.addBet(
        jsonObj
      );
    }
  }

  getCurrentRoller() {
    return this.state.currentRollerId === null ? "" : this.state.currentRollerId;
  }

  getPoint() {
    return this.state.pointNumber === null ? "" : this.state.pointNumber;
  }
  getDiceTotal() {
    return this.state.dice.total();
  }

  render() {
    return (
      <div>
        <p>
            <select id="action-type" value={ this.state.actionType } onChange={ evt => this.setState({ actionType: evt.target.value}) }>
                <option value={ Constants.SOCKET_EVENTS.DICE_ROLL }>{Constants.SOCKET_EVENTS.DICE_ROLL}</option>
                <option value={ Constants.SOCKET_EVENTS.BET_ADD }>{Constants.SOCKET_EVENTS.BET_ADD}</option>
                <option value={ Constants.SOCKET_EVENTS.BET_REMOVE }>{Constants.SOCKET_EVENTS.BET_REMOVE}</option>
                <option value={ Constants.SOCKET_EVENTS.TABLE_JOIN }>{Constants.SOCKET_EVENTS.TABLE_JOIN}</option>
                <option value={ Constants.SOCKET_EVENTS.TABLE_LEAVE }>{Constants.SOCKET_EVENTS.TABLE_LEAVE}</option>
            </select>
            <input 
              id="action-payload" 
              type="text"
              size="60" 
              value={ this.state.actionPayload } onChange={ evt => this.setState({ actionPayload: evt.target.value })} 
            />
            <input type="button" onClick={ this.performAction } value="Perform Action" />
        </p>
        <p>
            <span>current roller:</span> <input id="roller" value={ this.getCurrentRoller() } readOnly disabled size="16" />
            <span>current roll: </span> <input id="dice" value={ this.getDiceTotal() } readOnly disabled size="4" />
            <span>current point: </span> <input id="point" value={ this.getPoint() } readOnly disabled size="4" />
            <br />
            <textarea id="output" cols="50" rows="30" value={ this.getActionHistory() } disabled readOnly />
        </p>
        <input type="button" onClick={ this.clearActionHistory } value="Clear Output" />
      </div>
    );
  }
}

export default App;
