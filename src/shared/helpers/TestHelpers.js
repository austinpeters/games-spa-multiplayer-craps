import Dice from '../models/dice';

export const rollDice = (dieOne, dieTwo) => {
    return new Dice(JSON.stringify({
        dice: {
            dieOne,
            dieTwo
        }
    }))
};

export const hardwayLoseSeven = ({betPath, dice, hardNumber, payout}) => {
    
}

export const hardwayLoseSoft = ({betPath, dice, hardNumber, payout}) => {

}