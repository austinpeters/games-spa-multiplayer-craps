import * as Constants from '../../shared/constants';
import Dice from '../../shared/models/dice';

export const roll = (appState, player) => {
    
    if (appState.isCurrentRoller(player) && player.hasValidShooterBet()) {
        const dice = new Dice();
        dice.roll();

        appState.setCurrentDice(dice, player);
        appState.getPlayers().forEach(player => player.update(appState));

        // The point is off and now should be on...
        if (appState.isPointOn() === false && Constants.POINT_NUMBERS.includes(dice.total())) {
            appState.setPointNumber(dice.total(), player);
            
        // The point is on and now should be off, point was made.
        } else if (appState.isPointOn() === true && dice.total() === appState.getPointNumber()) {
            appState.setPointNumber(null, player);

        // The point is on and now should be off, crapped out
        } else if (appState.isPointOn() === true && dice.total() === 7){
            appState.setPointNumber(null, player);
            appState.setNextRoller(player);
        }

        appState.broadcastAppState();

    } else  {
        let msg = "You need a base bet either for the pass line or don't pass line.";
        if (appState.isCurrentRoller(player) === false) {
            const msg = "You're not the current roller.";
        }
        player.getSocket().emit('dice.noChange', {"message": msg});
    }
}