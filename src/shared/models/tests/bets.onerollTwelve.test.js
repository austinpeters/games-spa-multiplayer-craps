import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("One roll > Twelve > Free chips decreased by bet amount", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.onerollTwelve.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    expect( bets.getBets().onerollTwelve.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("One roll > Twelve > Lose combo 1", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(3, 5);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.onerollTwelve.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().onerollTwelve.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("One roll > Twelve > Lose combo 2", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(4, 4);
    const betAmount = 10;
    const betType = {
        value: betAmount,
        typePath: "$.onerollTwelve.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().onerollTwelve.baseBet ).toBe( 0 );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("One roll > Twelve > Correct payout on a win", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(6, 6);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.onerollTwelve.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().onerollTwelve.baseBet ).toBe( 0 );
    expect( bets.getAllChips() ).toBe( Constants.STARTING_CHIP_AMOUNT + (betAmount * Constants.PAYOUT_ONETIME_TWELVE) );
});