import React, { Component } from 'react';
import * as Constants from '../../shared/constants';
import socket from '../socket';
import Dice from '../../shared/models/dice';

const betListItems = Constants.BET_TYPE_PATHS.map(bet =>
  <option key={bet} value={bet}>
    {bet}
  </option>
);

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      actionHistory: [],
      actionType: Constants.SOCKET_EVENTS.DICE_ROLL,
      betValue: 0,
      betType: "$.pass.baseBet",
      betAction: "add",
      freeChips: 0,
      allChips: 0,
      myBets: {},
      dice: new Dice(),
      currentRollerId: null,
      currentPlayers: [],
      lastAction: "",
      pointNumber: null,
      client: socket()
    };

    this.state.client.registerHandler(
      Constants.SOCKET_EVENTS.APP_NEW_STATE,
      payload => {
        if (payload.players) {
          this.setState({
            currentPlayers: payload.players.map(player => player.id)
          });

          const me = payload.players
            .filter(player => player.id === this.state.client.getId())[0];

          if (me) {
            this.setState({
              freeChips: me.freeChips,
              allChips: me.allChips,
              myBets: me.bets,
            });
          }
        }

        this.setState({
          dice: new Dice(payload.currentDice),
          currentRollerId: payload.currentRollerId.replace("/websocket#", ""),
          pointNumber: payload.pointNumber,
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
    this.getLastAction = this.getLastAction.bind(this);
    this.addAction = this.addAction.bind(this);
    this.performAction = this.performAction.bind(this);

    // Getters
    this.getCurrentRoller = this.getCurrentRoller.bind(this);
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.getDiceTotal = this.getDiceTotal.bind(this);
    this.getPoint = this.getPoint.bind(this);
    this.freeChips = this.freeChips.bind(this);
    this.allChips = this.allChips.bind(this);

  }

  addAction(payload) {
    this.setState({ lastAction: JSON.stringify(payload, 2) });
    //this.setState( {actionHistory: updatedHistory} );
  }

  clearActionHistory() {
    this.setState({ actionHistory: []});
  }

  getActivePlayers() {
    return this.state.currentPlayers.join("\n\n");
  }

  getActionHistory() {
    return this.state.actionHistory.join("\n\n");
  }

  getLastAction() {
    return this.state.lastAction;
  }

  performAction() {
    if (this.state.actionType === Constants.SOCKET_EVENTS.DICE_ROLL) {
      this.state.client.rollDice(
        {}
      );
    } else if (this.state.actionType === Constants.SOCKET_EVENTS.BET_ADD) {
      this.state.client.addBet({
        typePath: this.state.betType,
        value: parseInt(this.state.betValue),
        action: "add"
      });
    } else if (this.state.actionType === Constants.SOCKET_EVENTS.BET_REMOVE) {
      this.state.client.removeBet({
        typePath: this.state.betType,
        value: parseInt(this.state.betValue),
        action: "remove"
      });
    }
  }

  getCurrentRoller() {
    let result = "";
    if (this.state.currentRollerId !== null) {
      result = (this.state.currentRollerId === this.state.client.getId()) ? 
        "me" : this.state.currentRollerId;
    }
    return result;
  }

  getPoint() {
    return this.state.pointNumber === null ? "" : this.state.pointNumber;
  }
  getDiceTotal() {
    return this.state.dice.total();
  }
  allChips() {
    return this.state.allChips;
  }
  freeChips() {
    return this.state.freeChips;
  }

  render() {
    let betTypeInput = null;
    let betValueInput = null;
    let betActionInput = null;

    if ([Constants.SOCKET_EVENTS.BET_ADD, Constants.SOCKET_EVENTS.BET_REMOVE].includes(this.state.actionType)) {
      betTypeInput = <select 
        id=""
        value={this.state.betType}
        onChange={ evt => this.setState({ betType: evt.target.value}) }>
          {betListItems}
      </select>
      betValueInput = <input 
        type="text"
        size="4"
        value={this.state.betValue}
        onChange={evt => this.setState({ betValue: evt.target.value }) } 
      />
    }

    return (
      <div>
        <p>
          <input type="button" onClick={ this.performAction } value="Perform Action" />
          <select id="action-type" value={ this.state.actionType } onChange={ evt => this.setState({ actionType: evt.target.value }) }>
              <option value={ Constants.SOCKET_EVENTS.DICE_ROLL }>{Constants.SOCKET_EVENTS.DICE_ROLL}</option>
              <option value={ Constants.SOCKET_EVENTS.BET_ADD }>{Constants.SOCKET_EVENTS.BET_ADD}</option>
              <option value={ Constants.SOCKET_EVENTS.BET_REMOVE }>{Constants.SOCKET_EVENTS.BET_REMOVE}</option>
          </select>
          {betTypeInput}
          {betValueInput}
        </p>
        <p>
          <span>current roller: </span> <input id="roller" value={ this.getCurrentRoller() } readOnly disabled size="16" />
          <span>current roll: </span> <input id="dice" value={ this.getDiceTotal() } readOnly disabled size="4" />
          <span>current point: </span> <input id="point" value={ this.getPoint() } readOnly disabled size="4" />
        </p>
        <p>
          <span>my total chips: </span> <input id="chips-all" value={ this.allChips() } readOnly disabled size="6" />
          <span>my free chips: </span> <input id="chips-free" value={ this.freeChips() } readOnly disabled size="6" />
        </p>
        <p>
          last server response: <br />
          <textarea id="output" cols="28" rows="15" value={ this.getLastAction() } disabled readOnly />
        </p>
        <p>
          current connected players: <br />
          <textarea id="output" cols="28" rows="15" value={ this.getActivePlayers() } disabled readOnly />
        </p>
      </div>
    );
  }
}

export default App;
