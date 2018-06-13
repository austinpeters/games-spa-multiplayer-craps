import * as Constants from '../../shared/constants';
import BetController from './betting';

export const roll = (appState, session, payload) => {
    
    if (appState.isCurrentRoller(session)) {
        const dice = [
            Math.floor(Math.random() * Math.floor(6)) + 1,
            Math.floor(Math.random() * Math.floor(6)) + 1
        ];

        const diceTotal = dice[0] + dice[1];

        // The point is off and now should be on...
        if (appState.isPointOn() === false && Constants.POINT_NUMBERS.includes(diceTotal)) {
            appState.setPointNumber(session, diceTotal);

        // The point is on and now should be off, point was made.
        } else if (appState.isPointOn() === true && diceTotal === appState.getPointNumber()) {
            appState.setPointNumber(session, null);

        // The point is on and now should be off, crapped out
        } else if (appState.isPointOn() === true && diceTotal === 7){
            appState.setPointNumber(session, null);
            appState.setNextRoller(session);
        }

        appState.setCurrentDice(session, dice);

    } else {
        session.socket.emit('dice.noChange', {"message": "You're not the current roller."});
    }
}