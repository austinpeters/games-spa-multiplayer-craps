
export const validBet = (player, bet, appState) => {

    // We don't let people play with credit...Cash only.
    if (bet.getAction() === "add" && player.hasChipsAvailable(bet) === false) {
        return false;
    }

    switch (bet.type) {
        case 'field':
            return true;
        case 'pass':
            // Check if base bet or odds (check max odds) & if the point is on or off.
        case 'dont pass':
            // Check if base bet or odds (check max odds) & if the point is on or off.
            break;
        case 'come':
            // Check if base bet or odds (check max odds) & if the point is on or off.
            break;
        case 'dont come':
            // Check if base bet or odds (check max odds) & if the point is on or off.
            break;
        default:
            return false;
    }

}