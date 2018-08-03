export default class Dice {
    constructor(dice) {
        if (dice) {
            let diceObj = {};
            if (typeof dice === "string") {
                diceObj = JSON.parse(dice);
                this.dieOne = diceObj.dice.dieOne;
                this.dieTwo = diceObj.dice.dieTwo;
            } else if (typeof dice === "object") {
                this.dieOne = dice.dieOne;
                this.dieTwo = dice.dieTwo;
            } else {
                // Invalid JSON passed in.
                this.dieOne = null;
                this.dieTwo = null;
            }
        } else {
            this.dieOne = null;
            this.dieTwo = null;
        }
    }

    roll() {
        this.dieOne = Math.floor(Math.random() * Math.floor(6)) + 1;
        this.dieTwo = Math.floor(Math.random() * Math.floor(6)) + 1;
    }

    dieOne() {return this.dieOne;}
    dieTwo() {return this.dieTwo;}

    total() {
        if (this.dieOne === null || this.dieTwo === null) {
            return "";
        } else {
            return this.dieOne + this.dieTwo;
        }
    }

    isHardWay() {
        return this.dieOne === this.dieTwo;
    }

    serialize() {
        return JSON.stringify({
            dice: {
                dieOne: this.dieOne,
                dieTwo: this.dieTwo
            }
        });
    }

}