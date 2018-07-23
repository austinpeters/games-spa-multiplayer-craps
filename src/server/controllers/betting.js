export const add = (appState, player, bet) => {
    player.addBet(appState, bet);
    appState.broadcastAppState(player);
}

export const remove = (appState, player, bet) => {
    player.removeBet(appState, bet);
    appState.broadcastAppState(player);
}