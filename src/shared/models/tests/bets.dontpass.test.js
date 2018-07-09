import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Don't Pass bet > point off: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontPass.baseBet",
        action: "add"
    };

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );

    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount );

});

test ("Don't Pass bet > point on: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontPass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    // Point must be set before adding odds bets.
    appState.setPointNumber(4);

    bets.addBet(appState, {
        value: betAmount,
        typePath: "$.dontPass.oddsBet",
        action: "add"
    });

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );
    expect( bets.getBets().dontPass.oddsBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );
    expect( bets.getBets().dontPass.oddsBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - 5 );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount + (betAmount * (1/2)) );

});

test ("Don't Pass bet > point on: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 2);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontPass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    // Point must be set before adding odds bets.
    appState.setPointNumber(4);

    bets.addBet(appState, {
        value: betAmount,
        typePath: "$.dontPass.oddsBet",
        action: "add"
    });

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );
    expect( bets.getBets().dontPass.oddsBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontPass.baseBet ).toBe( 0 );
    expect( bets.getBets().dontPass.oddsBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));

});

test ("Don't Pass bet > point off: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 1);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.dontPass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getBets().dontPass.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().dontPass.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

});