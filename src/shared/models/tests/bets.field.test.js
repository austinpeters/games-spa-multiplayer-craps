import AppController from "../../../server/controllers/app";
import Bets from "../bets";
import * as Constants from "../../constants";
import * as TestHelpers from "../../helpers/TestHelpers";

test ("Field bet > Free chips decreased by bet amount", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 4);
    const betAmount = 10
    const betType = {
        value: betAmount,
        typePath: "$.field.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    expect( bets.getBets().field.baseBet ).toBe( betAmount );
    expect( bets.getFreeChips() ).toBe( Constants.STARTING_CHIP_AMOUNT - betAmount );

});

test ("Field bet > clears after not rolling a field number", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(2, 4);
    const betType = {
        value: 10,
        typePath: "$.field.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().field.baseBet ).toBe( 0 );

});

test ("Field bet > stays after rolling a field number", () => {
    // Setup
    const appState = new AppController();
    const bets = new Bets();
    const dice = TestHelpers.rollDice(1, 2);
    const betType = {
        value: 10,
        typePath: "$.field.baseBet",
        action: "add"
    };

    bets.addBet(appState, betType);

    appState.setCurrentDice(dice);
    bets.update(appState);

    expect( bets.getBets().field.baseBet ).toBe( 10 );

});