export const add = (appState, player, bet) => {
    player.addBet(appState, bet);
    appState.broadcastAppState(player);
    console.log(`Adding bet data: ${JSON.stringify(bet)}`);
}

export const remove = (appState, player, bet) => {
    player.removeBet(appState, bet);
    appState.broadcastAppState(player);
    console.log(`Removing bet data: ${JSON.stringify(bet)}`);
}