import Dice from '../models/dice';

export const rollDice = (dieOne, dieTwo) => {
    return new Dice(JSON.stringify({
        dice: {
            dieOne,
            dieTwo
        }
    }))
};

export const rollDiceTotal = (diceTotal) => {
    const diceObj = {dice: {dieOne: null, dieTwo: null}};
    if (diceTotal % 2 === 0) {
        diceObj.dice.dieOne = diceTotal / 2;
        diceObj.dice.dieTwo = diceTotal / 2;
    } else {
        diceObj.dice.dieOne = Math.floor(diceTotal / 2);
        diceObj.dice.dieTwo = diceTotal - diceObj.dice.dieOne;
    }
    return new Dice(JSON.stringify(diceObj));
};

export const hardwayLoseSeven = ({betPath, dice, hardNumber, payout}) => {
    
}

export const hardwayLoseSoft = ({betPath, dice, hardNumber, payout}) => {

}