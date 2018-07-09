import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Dont come bet > point on: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontCome.baseBet",
        action: "add"
    };

    // Point must be set before adding dont come bets.
    appState.setPointNumber(4);

    // Add base and odds bets...
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().dontCome.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontCome.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount );

});

test ("Dont come bet > point on: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(5, 2);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontCome.baseBet",
        action: "add"
    };

    // Point must be set before adding come bets.
    appState.setPointNumber(4);
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().dontCome.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontCome.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

});

test ("Dont come bet > point on: Bet moves to the rolled point", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(3, 3);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontCome.baseBet",
        action: "add"
    };

    // Point must be set before adding come bets.
    appState.setPointNumber(4);
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().dontCome.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontCome.baseBet ).toBe( 0 );
    expect( bets.getBets().pointSix.dontCome.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

    // No win or loss yet.
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );

});
