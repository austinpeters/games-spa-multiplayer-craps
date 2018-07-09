import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Pass bet > point off: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(1, 6);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.pass.baseBet",
        action: "add"
    };

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );

    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getBets().pass.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().pass.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount );

});

test ("Pass bet > point on: Correct win payout.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 2);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.pass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    // Point must be set before adding odds bets.
    appState.setPointNumber(4);

    bets.addBet(appState, {
        value: betAmount,
        typePath: "$.pass.oddsBet",
        action: "add"
    });

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getBets().pass.baseBet ).toBe( betAmount );
    expect( bets.getBets().pass.oddsBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().pass.baseBet ).toBe( betAmount );
    expect( bets.getBets().pass.oddsBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + 10 );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + betAmount + (betAmount * 2) );

});

test ("Pass bet > point on: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(5, 2);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.pass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    // Point must be set before adding odds bets.
    appState.setPointNumber(4);

    bets.addBet(appState, {
        value: betAmount,
        typePath: "$.pass.oddsBet",
        action: "add"
    });

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getBets().pass.baseBet ).toBe( betAmount );
    expect( bets.getBets().pass.oddsBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().pass.baseBet ).toBe( 0 );
    expect( bets.getBets().pass.oddsBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - (betAmount * 2));

});

test ("Pass bet > point off: Lose.", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 6);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.pass.baseBet",
        action: "add"
    };

    // Add base and odds bets...
    bets.addBet(appState, betType);

    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getBets().pass.baseBet ).toBe( betAmount );

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().pass.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount);

});