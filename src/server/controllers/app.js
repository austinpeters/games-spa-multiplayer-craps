
import ArrayUtils from '../../shared/helpers/ArrayUtils'
import * as Constants from '../../shared/constants';

export default class AppController {
    constructor() {
        this.currentRollerId = null;
        this.pointNumber = null;
        this.players = [];
        this.currentDice = null;
    };

    isCurrentRoller(player) {
        return player.getSocket().id === this.currentRollerId;
    };

    getCurrentRoller() {return this.currentRollerId};
    setCurrentRoller(player) {
        console.log(`Current roller set to: ${player.getSocket().id}`);
        this.currentRollerId = player.getSocket().id;
        const payload = {playerId: this.currentRollerId};

        player.getSocket().emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
        player.getSocket().broadcast.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
    };
    setNextRoller(player) {
        // Reset indexes
        this.players = this.players.filter(player => true);
        this.currentRollerId = ArrayUtils.next(this.players, player).getSocket().id;
        const payload = {playerId: this.currentRollerId};
        
        player.getSocket().emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
        player.getSocket().broadcast.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
    };

    getCurrentDice () {return this.currentDice};
    setCurrentDice(dice, player = null) {
        this.currentDice = dice;

        // Temp until I figure out how to mock AppController the way I want.
        if (player != null) {
            const payload = this.currentDice.serialize();
            player.getSocket().emit(
                Constants.SOCKET_EVENTS.DICE_ROLLED,
                payload
            );
            player.getSocket().broadcast.emit(
                Constants.SOCKET_EVENTS.DICE_ROLLED,
                payload
            );
        }
    };

    getPointNumber() {return this.pointNumber;};
    isPointOn() {return this.pointNumber !== null;};
    setPointNumber(newPoint, player = null) {
        this.pointNumber = newPoint

        // Temp until I figure out how to mock AppController the way I want.
        if (player != null) {
            const payload = {pointNumber: this.pointNumber};
            player.getSocket().emit(
                Constants.SOCKET_EVENTS.POINT_CHANGED,
                payload
            );
            player.getSocket().broadcast.emit(
                Constants.SOCKET_EVENTS.POINT_CHANGED,
                payload
            );
        }
    };

    addPlayer(player) {
        this.players.push(player);
        if (this.players.length === 1) {
            this.setCurrentRoller(player);
        }
        this.broadcastAppState();
    };
    removePlayer(player) {
        ArrayUtils.remove(this.players, player);
        if (player.getSocket().client.id === this.currentRollerId) {
            this.setNextRoller(player);
        }
        this.broadcastAppState();
    };
    getPlayers() {return this.players;};

    broadcastAppState () {
        const appState = {
            currentDice: this.currentDice,
            currentRollerId: this.currentRollerId,
            pointNumber: this.pointNumber,
            players: this.players.map(player => player.getSimpleObject())
        };

        const playerSocket = ArrayUtils.first(this.players);

        if (playerSocket) {
            playerSocket.getSocket().emit(
                Constants.SOCKET_EVENTS.APP_NEW_STATE,
                appState
            );
            playerSocket.getSocket().broadcast.emit(
                Constants.SOCKET_EVENTS.APP_NEW_STATE,
                appState
            );
        }
    };
    sendAppState(player) {
        const appState = {
            currentDice: this.currentDice,
            currentRollerId: this.currentRollerId,
            pointNumber: this.pointNumber,
            players: this.players.map(player => player.getSimpleObject())
        };
        player.getSocket().emit(
            Constants.SOCKET_EVENTS.APP_NEW_STATE,
            appState
        );
    }
};