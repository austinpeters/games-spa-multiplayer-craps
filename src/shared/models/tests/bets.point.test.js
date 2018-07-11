import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Point numbers > Bets move from come line to point.", () => {
    
    Constants.POINT_NUMBERS.forEach ((pointNumber) => {
        const appState = new AppController();
        const pointWord = Constants.NUMBERS_AS_WORDS_CAPITALIZED[pointNumber];
        const bets = new Bets();
        const betAmount = 10;
        const comeBet = {
            value: betAmount,
            typePath: `$.come.baseBet`,
            action: "add"
        };

        const dice = TestHelpers.rollDiceTotal(pointNumber);

        expect( dice.total() ).toBe( pointNumber );
        
        appState.setPointNumber(4);
        bets.addBet(appState, comeBet);

        // Roll to move come bet to the point.
        appState.setCurrentDice(dice);
        bets.update(appState);

        expect( bets.getBets().come.baseBet ).toBe( 0 );
        expect( bets.getBets()[`point${pointWord}`].come.baseBet ).toBe( betAmount );

        // Free chips decremented by bet amount.
        expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
        // We haven't lost any chips yet...
        expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );
    });

});

test ("Point numbers > Win payout correct, come line.", () => {
    
    Constants.POINT_NUMBERS.forEach ((pointNumber) => {
        const appState = new AppController();
        const pointWord = Constants.NUMBERS_AS_WORDS_CAPITALIZED[pointNumber];
        const bets = new Bets();
        const betAmount = 10;
        const comeBet = {
            value: betAmount,
            typePath: `$.come.baseBet`,
            action: "add"
        };
        const pointOddsBet = {
            value: betAmount,
            typePath: `$.point${pointWord}.come.oddsBet`,
            action: "add"
        }

        const dice = TestHelpers.rollDiceTotal(pointNumber);
        
        // Don't want to roll the point number and take the point off.
        if (pointNumber === 4) {
            appState.setPointNumber(5);
        } else {
            appState.setPointNumber(4);
        }

        bets.addBet(appState, comeBet);

        // Roll to move come bet to the point.
        appState.setCurrentDice(dice);
        bets.update(appState);

        // Add odds on the point bet.
        bets.addBet(appState, pointOddsBet);

        // Roll again...
        appState.setCurrentDice(dice);
        bets.update(appState);

        // base bet (1:1) + whatever payout ratio for the true odds bet for the point we have.
        const expectedWinnings = betAmount + (betAmount * Constants.PAYOUT_ODDS.COME[pointNumber]);

        expect( bets.getBets()[`point${pointWord}`].come.baseBet ).toBe( 0 );
        expect( bets.getBets()[`point${pointWord}`].come.oddsBet ).toBe( 0 );
        expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + expectedWinnings );


    });

});


// Tests to add.... Dont Come tests
// Test valid odds bet (only nominations of the payout ratio for the bet are allowed)
// Test direct placed bets.
