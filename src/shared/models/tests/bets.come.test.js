import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Come bet > point on: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.come.baseBet",
        action: "add"
    };

    // Point must be set before adding come bets.
    appState.setPointNumber(4);

    // Add base and odds bets...
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().come.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().come.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount );

});

test ("Come bet > point on: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.come.baseBet",
        action: "add"
    };

    // Point must be set before adding come bets.
    appState.setPointNumber(4);
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().come.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().come.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

});

test ("Come bet > point on: Bet moves to the rolled point", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(3, 3);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.come.baseBet",
        action: "add"
    };

    // Point must be set before adding come bets.
    appState.setPointNumber(4);
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().come.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().come.baseBet ).toBe( 0 );
    expect( bets.getBets().pointSix.come.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

    // No win or loss yet.
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );

});
