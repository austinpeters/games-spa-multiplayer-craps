export const SOCKET_EVENTS = {
  // Events sent to the server
  APP_GET_STATE: 'app-getState',
  BET_ADD: 'bet-add',
  BET_REMOVE: 'bet-remove',
  DICE_ROLL: 'dice-roll',
  TABLE_JOIN: 'table-join',
  TABLE_LEAVE: 'table-leave',
  
  // Events sent from the server
  APP_NEW_STATE: 'app-newState',
  BET_ADDED: 'bet-added',
  BET_REMOVED: 'bet-removed',
  DICE_ROLLED: 'dice-rolled',
  POINT_CHANGED: 'point-changed',
  ROLLER_CHANGED: 'roller-changed',
  TABLE_JOINED: 'table-joined',
  TABLE_LEFT: 'table-left',
}

export const PAYOUT_DEFAULT = 1;

//Multipliers
export const PAYOUT_ODDS = {
  COME: {
    4: 2,
    5: (3/2),
    6: (6/5),
    8: (6/5),
    9: (3/2),
    10: 2  
  },
  DONT_COME: {
    4: (1/2),
    5: (2/3),
    6: (5/6),
    8: (5/6),
    9: (2/3),
    10: (1/2)
  },
  PASS: {
    4: 2,
    5: (3/2),
    6: (6/5),
    8: (6/5),
    9: (3/2),
    10: 2
  },
  DONT_PASS: {
    4: (1/2),
    5: (2/3),
    6: (5/6),
    8: (5/6),
    9: (2/3),
    10: (1/2)
  }
};

export const PAYOUT_HARDWAY_FOUR = 7;
export const PAYOUT_HARDWAY_SIX = 9;
export const PAYOUT_HARDWAY_EIGHT = 9;
export const PAYOUT_HARDWAY_TEN = 7;

export const PAYOUT_ONETIME_ANYSEVEN = 4;
export const PAYOUT_ONETIME_ANYCRAPS = 7;
export const PAYOUT_ONETIME_TWO = 30;
export const PAYOUT_ONETIME_THREE = 15;
export const PAYOUT_ONETIME_ELEVEN = 15;
export const PAYOUT_ONETIME_TWELVE = 30;

export const STARTING_CHIP_AMOUNT = 400;

export const CRAPS_NUMBERS = [2, 3, 12];

export const POINT_NUMBERS = [4, 5, 6, 8, 9, 10];

export const FIELD_NUMBERS = [2, 3, 4, 9, 10, 11, 12];

export const NUMBERS_AS_WORDS_LOWERCASE = {
  1: "one",  2: "two",  3: "three",  4: "four",  5: "five",  6: "six",
  7: "seven",  8: "eight",  9: "nine",  10: "ten",  11: "eleven",  12: "twelve"
};

export const NUMBERS_AS_WORDS_CAPITALIZED = {
  1: "One",  2: "Two",  3: "Three",  4: "Four",  5: "Five",  6: "Six",
  7: "Seven",  8: "Eight",  9: "Nine",  10: "Ten",  11: "Eleven",  12: "Twelve"
}

export const WORDS_AS_NUMBERS = {
  "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
  "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12
}