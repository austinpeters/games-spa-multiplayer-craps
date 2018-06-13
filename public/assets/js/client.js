
var socket = io("/websocket");

console.log(socket.id);

function outputPayload(payload) {
    var outputArea = document.getElementById('output');
    outputArea.value = outputArea.value + JSON.stringify(payload) + "\n\n";
}

function actionTrigger() {
    var actionType = document.getElementById('action-type').value;
    var actionPayload = JSON.parse(document.getElementById('action-payload').value);
    socket.emit(actionType, actionPayload);
}

function pointChanged(payload) {
    document.getElementById('point').value = payload.pointNumber;
}

function diceRolled(payload) {
    document.getElementById('dice').value = payload.dice[0] + payload.dice[1];
    outputPayload(payload);
}

function rollerChanged(payload) {
    console.log(payload);
    const rollerInfo = payload.playerId === socket.id ? 'Me.' : payload.playerId;
    document.getElementById('roller').value = rollerInfo;
}

function appState(payload) {
    
    const rollerInfo = payload.currentRollerId === socket.id ? 'Me.' : payload.currentRollerId;
    const diceTotal = payload.currentDice.length > 0 ? payload.currentDice[0] + payload.currentDice[1] : null;
    
    document.getElementById('roller').value = rollerInfo;
    document.getElementById('dice').value = diceTotal;
    document.getElementById('point').value = payload.pointNumber;
}

socket.on('app.state', appState);
socket.on('point.changed', pointChanged);
socket.on('dice.noChange', outputPayload);
socket.on('dice.rolled', diceRolled);
socket.on('table.joined', outputPayload);
socket.on('table.left', outputPayload);
socket.on('roller.changed', rollerChanged);
socket.on('bet.added', outputPayload);
socket.on('bet.removed', outputPayload);
socket.on('connection', function(){
    console.log('connected?');
});

socket.emit('table.join', {'testing': true});