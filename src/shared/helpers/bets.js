import JSONPath from "jsonpath";
import * as Constants from "../constants";

const POINT_BET_PATTERNS = {
    comeBase: /^\$\.point([A-Za-z]+)\.come\.baseBet$/,
    comeOdds: /^\$\.point([A-Za-z]+)\.come\.oddsBet$/,
    comePlaced: /^\$\.point([A-Za-z]+)\.come\.placedBet$/,

    dontComeBase: /^\$\.point([A-Za-z]+)\.dontCome\.baseBet$/,
    dontComeOdds: /^\$\.point([A-Za-z]+)\.dontCome\.oddsBet$/,
    dontComePlaced: /^\$\.point([A-Za-z]+)\.dontCome\.placedBet$/,
};

export const isValidBet = (appState, playerBets, bet) => {

    let isValid = false;

    // We need all three of these properties for a valid bet.
    if (!(bet.typePath && bet.action && bet.value)) {
        return false;
    }

    // We don't let people play with credit...Cash only.
    if (bet.action === "add" && playerBets.getFreeChips() < bet.value) {
        return false;
    }

    // Validate logic for removing a bet.
    if (bet.action === "remove") {
        // Can't remove more chips than what you already have set on a bet...
        if (JSONPath.value(playerBets.getBets(), bet.typePath) < bet.value) {
            return false;
        }
        if (bet.typePath.match(POINT_BET_PATTERNS.comeBase)) {
            return false;
        }
        if (bet.typePath.match(POINT_BET_PATTERNS.comeOdds)) {
            return false;
        }
        if (bet.typePath.match(POINT_BET_PATTERNS.dontComeBase)) {
            return false;
        }
        if (bet.typePath.match(POINT_BET_PATTERNS.dontComeOdds)) {
            return false;
        }
        if (bet.typePath === "$.pass.baseBet" && appState.isPointOn() === true) {
            return false;
        }
        if (bet.typePath === "$.dontPass.baseBet" && appState.isPointOn() === true) {
            return false;
        }
    }

    if (bet.typePath.match(POINT_BET_PATTERNS.comePlaced)) {
        const pointNumber = bet.typePath.match(POINT_BET_PATTERNS.comePlaced)[1];
        return Number.isInteger(
            playerBets.getBets()[`point${pointNumber}`].come.placedPayout() * bet.value
        );
    }

    if (bet.typePath.match(POINT_BET_PATTERNS.comeOdds)) {
        const pointNumber = bet.typePath.match(POINT_BET_PATTERNS.comeOdds)[1];
        if (playerBets.getBets()[`point${pointNumber}`].come.baseBet > 0) {
            // Make sure the payout doesn't involved fractions.
            return Number.isInteger(
                playerBets.getBets()[`point${pointNumber}`].come.oddsPayout() * bet.value
            );
        } else {
            return false;
        }
    }

    if (bet.typePath.match(POINT_BET_PATTERNS.dontComePlaced)) {
        const pointNumber = bet.typePath.match(POINT_BET_PATTERNS.dontComePlaced)[1];
        return true;
    }

    if (bet.typePath.match(POINT_BET_PATTERNS.dontComeOdds)) {
        const pointNumber = bet.typePath.match(POINT_BET_PATTERNS.dontComeOdds)[1];
        if (playerBets.getBets()[`point${pointNumber}`].dontCome.baseBet > 0) {
            // Make sure the payout doesn't involved fractions.
            return Number.isInteger(
                playerBets.getBets()[`point${pointNumber}`].dontCome.oddsPayout() * bet.value
            );
        } else {
            return false;
        }
    }

    if (bet.typePath.match(POINT_BET_PATTERNS.comeBase)) {
        return false;
    }


    // Now that we know they have enough money, go on to checking other things.
    switch (bet.typePath) {
        case '$.field.baseBet':
            return true;
        case '$.pass.baseBet':
            if (appState.isPointOn() === false) {
                return true;
            }
        case '$.pass.oddsBet':
            // Check if the point is on AND the player already has a base bet AND the bet value is a proper ratio to the bet payout.
            if (appState.isPointOn() && playerBets.getBets().pass.baseBet > 0 ) {
                if (Number.isInteger(bet.value * Constants.PAYOUT_ODDS.PASS[appState.getPointNumber()])) {
                    return true;
                }
            }
            return false;
        case '$.dontPass.baseBet':
            if (appState.isPointOn() === false) {
                return true;
            }
        case '$.dontPass.oddsBet':
            // Check if the point is on AND the player already has a base bet AND the bet value is a proper ratio to the bet payout.
            if (appState.isPointOn() && playerBets.getBets().dontPass.baseBet > 0 ) {
                if (Number.isInteger(bet.value * Constants.PAYOUT_ODDS.DONT_PASS[appState.getPointNumber()])) {
                    return true;
                }
            }
            return false;
        case '$.come.baseBet':
            if (appState.isPointOn() === true) {
                return true;
            }
        case '$.dontCome.baseBet':
            if (appState.isPointOn() === true) {
                return true;
            }

        /******************************************************************************************
        * HARDWAYS
        ******************************************************************************************/
        case '$.hardwayFour.baseBet':
            return true;
        case '$.hardwaySix.baseBet':
            return true;
        case '$.hardwayEight.baseBet':
            return true;
        case '$.hardwayTen.baseBet':
            return true;

        /******************************************************************************************
        * ONE TIME ROLLS
        ******************************************************************************************/
        case '$.onerollTwo.baseBet':
            return true;
        case '$.onerollThree.baseBet':
            return true;
        case '$.onerollAnySeven.baseBet':
            return true;
        case '$.onerollEleven.baseBet':
            return true;
        case '$.onerollTwelve.baseBet':
            return true;
        case '$.onerollCraps.baseBet':
            return true;

        /******************************************************************************************
        * DEFAULT: NOT A VALID BET
        ******************************************************************************************/
        default:
            return false;
    }

    return isValid;

}