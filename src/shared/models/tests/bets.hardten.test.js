import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Hard ten > Free chips decreased by bet amount", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayTen.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    expect( bets.getBets().hardwayTen.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard ten > Lose on soft ten", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 4);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.hardwayTen.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayTen.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard ten > Lose on seven", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(4, 3);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.hardwayTen.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayTen.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Hard ten > stays after not rolling a soft ten or seven", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(1, 4);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayTen.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayTen.baseBet ).toBe( betAmount );

});

test ("Hard ten > Correct payout on a win", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(5, 5);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.hardwayTen.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().hardwayTen.baseBet ).toBe( 0 );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + (betAmount * Constants.PAYOUT_HARDWAY_TEN) );
});