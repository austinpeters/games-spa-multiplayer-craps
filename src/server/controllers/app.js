
import ArrayUtils from '../../shared/helpers/ArrayUtils'

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
        session.socket.emit('roller.changed', {'playerId': this.currentRollerId});
        session.socket.broadcast.emit('roller.changed', {'playerId': this.currentRollerId});
    };
    setNextRoller(session) {
        // Reset indexes
        this.playerSessions = this.playerSessions.filter(socket => true);
        this.currentRollerId = ArrayUtils.next(this.playerSessions, session).socket.id;
        
        const payload = {'playerId': this.currentRollerId};
        session.socket.emit('roller.changed', payload);
        session.socket.broadcast.emit('roller.changed', payload);
    };

    getCurrentDice () {return this.currentDice};
    setCurrentDice(session, dice) {
        this.currentDice = dice;
        const payload = {'dice': this.currentDice};
        session.socket.emit('dice.rolled', payload);
        session.socket.broadcast.emit('dice.rolled', payload);
    };

    getPointNumber() {return this.pointNumber;};
    isPointOn() {return this.pointNumber !== null;};
    setPointNumber(session, newPoint) {
        this.pointNumber = newPoint
        const payload = {pointNumber: this.pointNumber};
        session.socket.emit('point.changed', payload);
        session.socket.broadcast.emit('point.changed', payload);
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
        session.socket.emit('app.state', appState);
        session.socket.broadcast.emit('app.state', appState);
    };
};