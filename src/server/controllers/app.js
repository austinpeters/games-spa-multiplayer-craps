
import ArrayUtils from '../../shared/helpers/ArrayUtils'
import * as Constants from '../../shared/constants';

export default class AppController {
    constructor() {
        this.currentRollerId = null;
        this.pointNumber = null;
        this.playerSessions = [];
        this.currentDice = [];
    };

    isCurrentRoller(session) {
        return session.socket.id === this.currentRollerId;
    };

    getCurrentRoller() {return this.currentRollerId};
    setCurrentRoller(session) {
        console.log(`Current roller set to: ${session.socket.id}`);
        this.currentRollerId = session.socket.id;
        const payload = {playerId: this.currentRollerId};

        session.socket.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
        session.socket.broadcast.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
    };
    setNextRoller(session) {
        // Reset indexes
        this.playerSessions = this.playerSessions.filter(socket => true);
        this.currentRollerId = ArrayUtils.next(this.playerSessions, session).socket.id;
        const payload = {playerId: this.currentRollerId};
        
        session.socket.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
        session.socket.broadcast.emit(
            Constants.SOCKET_EVENTS.ROLLER_CHANGED, 
            payload
        );
    };

    getCurrentDice () {return this.currentDice};
    setCurrentDice(session, dice) {
        this.currentDice = dice;
        const payload = this.currentDice.serialize();
        session.socket.emit(
            Constants.SOCKET_EVENTS.DICE_ROLLED,
            payload
        );
        session.socket.broadcast.emit(
            Constants.SOCKET_EVENTS.DICE_ROLLED,
            payload
        );
    };

    getPointNumber() {return this.pointNumber;};
    isPointOn() {return this.pointNumber !== null;};
    setPointNumber(session, newPoint) {
        this.pointNumber = newPoint
        const payload = {pointNumber: this.pointNumber};

        session.socket.emit(
            Constants.SOCKET_EVENTS.POINT_CHANGED,
            payload
        );
        session.socket.broadcast.emit(
            Constants.SOCKET_EVENTS.POINT_CHANGED,
            payload
        );
    };

    addPlayer(session) {
        this.playerSessions.push(session);
        if (this.playerSessions.length === 1) {
            this.setCurrentRoller(session);
        }
    };
    removePlayer(session) {
        this.setNextRoller(session);
        ArrayUtils.remove(this.playerSessions, session);
    };
    getPlayers() {return this.playersSockets;};


    broadcastAppState (session) {
        const appState = {
            currentDice: this.currentDice,
            currentRollerId: this.currentRollerId,
            pointNumber: this.pointNumber
        };
        
        session.socket.emit(
            Constants.SOCKET_EVENTS.APP_NEW_STATE,
            appState
        );
        session.socket.broadcast.emit(
            Constants.SOCKET_EVENTS.APP_NEW_STATE,
            appState
        );
    };
};