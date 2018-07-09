import Bets from './bets';
export default class Player {
    constructor(playerData = {bets: null, displayName: null, socket: null}) {
        if (playerData && typeof playerData === "string") {
            let playerObj = {};
            try {
                playerObj = playerData.parse(playerData);
                this.displayName = playerObj.displayName;
                this.bets = new Bets(this);
                this.socket = null;
            } catch (e) {
                // Invalid playerData passed in.
                this.displayName = null;
                this.bets = new Bets();
                this.socket = null;
            }
        } else if (playerData && typeof playerData === "object") {
            this.bets = new Bets(this);
            this.displayName = playerData.displayName;
            this.socket = socket;
        } else {
            this.displayName = null;
            this.bets = new Bets(this);
            this.socket = null;
        }
    }

    getFreeChips() { return this.bets.freeChips() }

    getDisplayName() { return this.displayName }
    setDisplayName(displayName) { this.displayName = displayName }

    getBets() { return this.bets }
    addBet(appState, bet) { this.bets.add(appState, bet) }
    removeBet(appState, bet) { this.bets.remove(appState, bet) }

    getSocket() { return this.socket }

    serialize() {
        return playerData.stringify({
            displayName: this.displayName
        });
    }

}