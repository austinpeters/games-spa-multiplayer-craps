import JSONPath from 'jsonpath';

import * as BetHelper from '../helpers/bets';
import * as Constants from '../constants';

const LINE_COME_BASE_PATHS = {
    4: "$.pointFour.come.baseBet",
    5: "$.pointFive.come.baseBet",
    6: "$.pointSix.come.baseBet",
    8: "$.pointEight.come.baseBet",
    9: "$.pointNine.come.baseBet",
    10: "$.pointTen.come.baseBet",
}

const LINE_DONTCOME_BASE_PATHS = {
    4: "$.pointFour.dontCome.baseBet",
    5: "$.pointFive.dontCome.baseBet",
    6: "$.pointSix.dontCome.baseBet",
    8: "$.pointEight.dontCome.baseBet",
    9: "$.pointNine.dontCome.baseBet",
    10: "$.pointTen.dontCome.baseBet",
}

const HARDWAYS_WIN_CONDITION = (appState, hardNumber) => {
    let result = false;
    const rolledDice = appState.getCurrentDice();
    if (rolledDice.total() === hardNumber && rolledDice.isHardWay()) {
        result = true;
    }
    return result;
};

const HARDWAYS_LOSE_CONDITION = (appState, hardNumber) => {
    let result = false;
    const rolledDice = appState.getCurrentDice();
    if (rolledDice.total() === hardNumber && rolledDice.isHardWay() === false) {
        result = true;
    }
    if (rolledDice.total() === 7) {
        result = true;
    }
    return result;
};

const POINT_WIN_CONDITION = (appState, pointNumber, comeBet) => {
    const rolledDice = appState.getCurrentDice();
    if (comeBet === true) {
        return rolledDice.total() === pointNumber;
    } else {
        return rolledDice.total() === 7;
    }
};

const POINT_LOSE_CONDITION = (appState, pointNumber, comeBet) => {
    const rolledDice = appState.getCurrentDice();
    if (comeBet === true) {
        return rolledDice.total() === 7;
    } else {
        return rolledDice.total() === pointNumber;
    }
};

export default class Bets {

    constructor() {
        /******************************************************************************************
        * this.bets contains: BETTING PAYOUTS, WIN/LOSS/PUSH CONDITIONS, AND PLACED BET VALUES
        ******************************************************************************************/
        this.bets = {
            field: {
                baseBet: 0, 
                basePayout: (appState) => {
                    // 2 and 12 have a payout ratio of 2:1.
                    if([2, 12].includes(appState.getCurrentDice().total())) {
                        return 2;
                    } else {
                        return Constants.PAYOUT_DEFAULT;
                    }
                },
                winner: (appState) => 
                    Constants
                        .FIELD_NUMBERS
                        .includes(appState.getCurrentDice().total()) === true,
                loser: (appState) =>
                    Constants
                        .FIELD_NUMBERS
                        .includes(appState.getCurrentDice().total()) === false,
            },
            pass: {
                baseBet: 0,
                oddsBet: 0,
                basePayout: () => Constants.PAYOUT_DEFAULT,
                oddsPayout: (appState) => {
                    // Odds payout only happens when the point is on.
                    if (appState.isPointOn()) {
                        return Constants.PAYOUT_ODDS.PASS[appState.getPointNumber()];
                    } else {
                        return 0;
                    }
                },
                winner: (appState) => {
                    if (appState.isPointOn()) {
                        return appState.getCurrentDice().total() === appState.getPointNumber();
                    } else {
                        return [7, 11].includes(appState.getCurrentDice().total());
                    }
                },
                loser: (appState) => {
                    if (appState.isPointOn()) {
                        return appState.getCurrentDice().total() === 7;
                    } else {
                        return Constants
                            .CRAPS_NUMBERS
                            .includes(appState.getCurrentDice().total()) === true;
                    }
                },
            },
            come: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_DEFAULT,
                winner: (appState) => {
                    let result = false;
                    // You can't win on the come line when the point is off.
                    // That is what the pass line is for.
                    if (appState.isPointOn()) {
                        result = [7, 11].includes(appState.getCurrentDice().total());
                    }
                    return result;
                },
                loser: (appState) => {
                    if (appState.isPointOn()) {
                        return Constants.CRAPS_NUMBERS.includes(appState.getCurrentDice().total());
                    }
                },
            },
            dontCome: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_DEFAULT,
                winner: (appState) => {
                    if (appState.isPointOn()) {
                        return Constants.CRAPS_NUMBERS.includes(appState.getCurrentDice().total());
                    }
                },
                loser: (appState) => {
                    let result = false;
                    // You can't win on the come line when the point is off.
                    // That is what the pass line is for.
                    if (appState.isPointOn()) {
                        result = [7, 11].includes(appState.getCurrentDice().total());
                    }
                    return result;
                },
            },
            dontPass: {
                baseBet: 0,
                oddsBet: 0,
                basePayout: () => Constants.PAYOUT_DEFAULT,
                oddsPayout: (appState) => {
                    // Odds payout only happens when the point is on.
                    if (appState.isPointOn()) {
                        return Constants.PAYOUT_ODDS.DONT_PASS[appState.getPointNumber()];
                    } else {
                        return 0;
                    }
                },
                winner: (appState) => {
                    let result = false;
                    if (appState.isPointOn()) {
                        // When the point is on...
                        result = appState.getCurrentDice().total() === 7;
                    } else {
                        // When the point is off...
                        if (appState.getCurrentDice().total() !== 12) {
                            result = Constants
                                .CRAPS_NUMBERS
                                .includes(appState.getCurrentDice().total()) === true;
                        }
                    }
                    return result;
                },
                loser: (appState) => {
                    let result = false;
                    if (appState.isPointOn()) {
                        result = appState.getCurrentDice().total() === appState.getPointNumber();
                    } else {
                        result = [7, 11].includes(appState.getCurrentDice().total());
                    }
                    return result;
                },
                pusher: (appState) => {
                    let result = false;
                    if (appState.isPointOn() === false) {
                        result = appState.getCurrentDice().total() === 12;
                    }
                    return result;
                }
            },

            pointFour: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[4],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 4, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 4, true),
                }, 
                dontCome: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[4],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 4, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 4, false)
                }},
            pointFive: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[5],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 5, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 5, true)
                }, 
                dontCome: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[5],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 5, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 5, false)
                }},
            pointSix: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[6],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 6, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 6, true)
                }, 
                dontCome: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[6],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 6, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 6, false)
                }},
            pointEight: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[8],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 8, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 8, true)
                }, 
                dontCome: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[8],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 8, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 8, false)
                }},
            pointNine: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[9],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 9, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 9, true)
                }, 
                dontCome: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[9],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 9, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 9, false)
                }},
            pointTen: {
                come: {
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.COME[10],
                    winner: (appState) => POINT_WIN_CONDITION(appState, 10, true),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 10, true)
                }, 
                dontCome: {
                    basePayout: () => Constants.PAYOUT_DEFAULT,
                    oddsPayout: () => Constants.PAYOUT_ODDS.DONT_COME[10],
                    placedBet: 0, baseBet: 0, oddsBet: 0,
                    winner: (appState) => POINT_WIN_CONDITION(appState, 10, false),
                    loser: (appState) => POINT_LOSE_CONDITION(appState, 10, false)
                }},

            hardwayFour: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_HARDWAY_FOUR,
                winner: (appState) => HARDWAYS_WIN_CONDITION(appState, 4),
                loser: (appState) => HARDWAYS_LOSE_CONDITION(appState, 4),
            },
            hardwaySix: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_HARDWAY_SIX,
                winner: (appState) => HARDWAYS_WIN_CONDITION(appState, 6),
                loser: (appState) => HARDWAYS_LOSE_CONDITION(appState, 6),
            },
            hardwayEight: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_HARDWAY_EIGHT,
                winner: (appState) => HARDWAYS_WIN_CONDITION(appState, 8),
                loser: (appState) => HARDWAYS_LOSE_CONDITION(appState, 8),
            },
            hardwayTen: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_HARDWAY_TEN,
                winner: (appState) => HARDWAYS_WIN_CONDITION(appState, 10),
                loser: (appState) => HARDWAYS_LOSE_CONDITION(appState, 10),
            },

            onerollAnySeven: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_ANYSEVEN,
                winner: (appState) => appState.getCurrentDice().total() === 7,
                loser: (appState) => appState.getCurrentDice().total() !== 7,
            },
            onerollTwo: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_TWO,
                winner: (appState) => appState.getCurrentDice().total() === 2,
                loser: (appState) => appState.getCurrentDice().total() !== 2,
            },
            onerollThree: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_THREE,
                winner: (appState) => appState.getCurrentDice().total() === 3,
                loser: (appState) => appState.getCurrentDice().total() !== 3,
            },
            onerollTwelve: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_TWELVE,
                winner: (appState) => appState.getCurrentDice().total() === 12,
                loser: (appState) => appState.getCurrentDice().total() !== 12,
            },
            onerollEleven: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_ELEVEN,
                winner: (appState) => appState.getCurrentDice().total() === 11,
                loser: (appState) => appState.getCurrentDice().total() !== 11,
            },
            onerollCraps: {
                baseBet: 0,
                basePayout: () => Constants.PAYOUT_ONETIME_ANYCRAPS,
                winner: (appState) => Constants.CRAPS_NUMBERS.includes(appState.getCurrentDice().total()),
                loser: (appState) => Constants.CRAPS_NUMBERS.includes(appState.getCurrentDice().total()) === false,
            }

        };
        this.freeChips = Constants.STARTING_CHIP_AMOUNT;
        this.allChips = Constants.STARTING_CHIP_AMOUNT;
    }

    // Take chip value from 'free' chips and put into the designated bet.
    addBet(appState, addBet) { 
        if (BetHelper.isValidBet(appState, this, addBet)) {
            // Add addBet.value to the this.bets path via addBet.type
            JSONPath.apply(
                this.bets, 
                addBet.typePath, 
                (tableBet) => tableBet += addBet.value
            );
            this.freeChips -= addBet.value;
        }
    };

    // Take chip value from designated bet type and put it into 'free' chips. 
    removeBet(appState, removeBet) { 
        if (BetHelper.isValidBet(appState, this, removeBet)) {
            // Decrease removeBet.value from the this.bets path via removeBet.type
            JSONPath.apply(
                this.bets, 
                removeBet.typePath, 
                (tableBet) => tableBet -= removeBet.value
            );
            this.freeChips += removeBet.value;
        }
    };

    // Return a copy so the bets do not get accidently mutated.
    getBets() {
        return Object.assign(this.bets);
    };

    // Used to determine the value of all chips.
    getAllChips() { return this.allChips; };
    // Used to determine the value of all chips not currently in an actual bet.
    getFreeChips() { return this.freeChips; };

    moveComeLine(number) {
        JSONPath.apply(
            this.bets, 
            LINE_COME_BASE_PATHS[number],
            () => this.bets.come.baseBet
        );
        this.bets.come.baseBet = 0;
    };
    
    moveDontComeLine(number) {
        JSONPath.apply(
            this.bets, 
            LINE_DONTCOME_BASE_PATHS[number],
            () => this.bets.dontCome.baseBet
        );
        this.bets.dontCome.baseBet = 0;
    };

    wonChips(betPath, appState) {
        let wonChips = 0;
        let betType = JSONPath.parent(this.bets, betPath);
        
        if (betType.baseBet && betType.basePayout) {
            wonChips += betType.basePayout(appState) * betType.baseBet;
        }
        if (betType.oddsBet && betType.oddsPayout) {
            wonChips += betType.oddsPayout(appState) * betType.oddsBet;
        }
        if (betType.placedBet && betType.placedPayout) {
            wonChips += betType.placedPayout(appState) * betType.placedBet;
        }
        if (betPath.startsWith("$.oneroll")) {
            this.freeChips += betType.baseBet;
            betType.baseBet = 0;
        }
        if (betPath.startsWith("$.point")) {
            this.freeChips += betType.baseBet;
            this.freeChips += betType.oddsBet;
            betType.baseBet = 0;
            betType.oddsBet = 0;
        }
        if (betPath.startsWith("$.hardway")) {
            this.freeChips += betType.baseBet;
            betType.baseBet = 0;
        }
        this.allChips += wonChips;
        this.freeChips += wonChips;
    };
    lostChips(betPath, appState) {
        // Reference to this.bets by the betPath
        let betType = JSONPath.parent(this.bets, betPath);
        // Decrease removeBet.value from the this.bets path via betType.type
        let lostChips = 0;
        if (betType.baseBet) {
            lostChips += betType.baseBet;
            betType.baseBet = 0;
        }
        if (betType.oddsBet) {
            lostChips += betType.oddsBet;
            betType.oddsBet = 0;
        }
        this.allChips -= lostChips;
    };
    pushChips(betPath, appState) {
        let pushChips = 0;
        let betType = JSONPath.parent(this.bets, betPath);
        if (betType.baseBet) {
            pushChips += betType.baseBet;
            betType.baseBet = 0;
        }
        if (betType.oddsBet) {
            pushChips += betType.oddsBet;
            betType.oddsBet = 0;
        }
        this.freeChips += pushChips;
    }

    // Only called when dice get rolled...
    update(appState) {
        // Settle the winnings, losses, and pushes.
        Object.entries(this.bets).forEach(entry => {
            const [betType, obj] = entry;
            if (obj.winner && obj.winner(appState)) {
                this.wonChips(`$.${betType}.baseBet`, appState);
            }
            if (obj.loser && obj.loser(appState)) {
                this.lostChips(`$.${betType}.baseBet`, appState);
            }
            if (obj.pusher && obj.pusher(appState)) {
                this.pushChips(`$.${betType}.baseBet`, appState);
            }

            // Come line...
            if (obj.come && obj.come.pusher && obj.come.pusher(appState)) {
                this.pushChips(`$.${betType}.come.baseBet`, appState);
            }
            if (obj.come && obj.come.winner && obj.come.winner(appState)) {
                this.wonChips(`$.${betType}.come.baseBet`, appState);
            }
            if (obj.come && obj.come.loser && obj.come.loser(appState)) {
                this.lostChips(`$.${betType}.come.baseBet`, appState);
            }

            // Don't come line...
            if (obj.dontCome && obj.dontCome.pusher && obj.dontCome.pusher(appState)) {
                this.pushChips(`$.${betType}.dontCome.baseBet`, appState);
            }
            if (obj.come && obj.dontCome.winner && obj.dontCome.winner(appState)) {
                this.wonChips(`$.${betType}.dontCome.baseBet`, appState);
            }
            if (obj.dontCome && obj.dontCome.loser && obj.dontCome.loser(appState)) {
                this.lostChips(`$.${betType}.dontCome.baseBet`, appState);
            }
        });

        const dice = appState.getCurrentDice();
        if (appState.isPointOn() === true && Constants.POINT_NUMBERS.includes(dice.total())) {
            this.moveComeLine(dice.total());
            this.moveDontComeLine(dice.total());
        }
    };

}