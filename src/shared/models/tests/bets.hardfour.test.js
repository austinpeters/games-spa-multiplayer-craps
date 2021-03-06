import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Hard four > Free chips decreased by bet amount", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 4);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayFour.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    expect( bets.getBets().hardwayFour.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard four > Lose on soft four", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(1, 3);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.hardwayFour.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayFour.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard four > Lose on seven", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(4, 3);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.hardwayFour.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayFour.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard four > stays after not rolling a soft four or seven", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(3, 3);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayFour.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayFour.baseBet ).toBe( betAmount );

});

test ("Hard four > Correct payout on a win", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 2);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayFour.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayFour.baseBet ).toBe( 0 );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + (betAmount * Constants.PAYOUT_HARDWAY_FOUR) );
});