import * as Constants from '../../shared/constants';
import BetController from './betting';
import Dice from '../../shared/models/dice';

export const roll = (appState, session) => {
    
    if (appState.isCurrentRoller(session)) {
        const dice = new Dice();
        dice.roll();

        // The point is off and now should be on...
        if (appState.isPointOn() === false && Constants.POINT_NUMBERS.includes(dice.total())) {
            appState.setPointNumber(dice.total(), session);

        // The point is on and now should be off, point was made.
        } else if (appState.isPointOn() === true && dice.total() === appState.getPointNumber()) {
            appState.setPointNumber(null, session);

        // The point is on and now should be off, crapped out
        } else if (appState.isPointOn() === true && dice.total() === 7){
            appState.setPointNumber(null, session);
            appState.setNextRoller(session);
        }

        appState.setCurrentDice(dice, session);

    } else {
        session.socket.emit('dice.noChange', {"message": "You're not the current roller."});
    }
}