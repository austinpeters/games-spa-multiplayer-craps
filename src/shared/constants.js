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

export const ODDS_PAYOUT = {
  COME: {
    "2": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "8": 1,
    "9": 1,
    "10": 1    
  },
  DONT_COME: {
    "2": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "8": 1,
    "9": 1,
    "10": 1
  },
  PASS: {
    "2": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "8": 1,
    "9": 1,
    "10": 1
  },
  DONT_PASS: {
    "2": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "8": 1,
    "9": 1,
    "10": 1
  }
};

export const PLACED_PAYOUT = {
  "2": 1,
  "4": 1,
  "5": 1,
  "6": 1,
  "8": 1,
  "9": 1,
  "10": 1
};

export const CRAPS_NUMBERS = [2, 3, 12];

export const POINT_NUMBERS = [4, 5, 6, 8, 9, 10];

export const FIELD_NUMBERS = [2, 3, 4, 9, 10, 11, 12];

export const DEFAULT_PAYOUT = 1;