import express from 'express';
import AppController from './controllers/app';
import * as Constants from '../shared/constants';
import * as DiceController from './controllers/dice';
import * as BetController from './controllers/betting';
import * as TableController from './controllers/table';

const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));
app.use('/react/', express.static('src/client/build'));

const io = require('socket.io')(http);
const appState = new AppController();

io.of('/websocket').on('connection', function (socket) {

  const session = {};
  session.socket = socket;

  appState.addPlayer(session);
  appState.broadcastAppState(session);

  console.log("New connection!");

  socket.on(Constants.SOCKET_EVENTS.BET_ADD, function(bet) {
    BetController.add(appState, session, bet);
  });

  socket.on(Constants.SOCKET_EVENTS.BET_REMOVE, function(bet) {
    BetController.remove(appState, session, bet);
  });

  socket.on(Constants.SOCKET_EVENTS.DICE_ROLL, function() {
    DiceController.roll(appState, session);
  });

  socket.on(Constants.SOCKET_EVENTS.TABLE_JOIN, function(payload) {
    TableController.join(appState, session, payload);
  });

  socket.on(Constants.SOCKET_EVENTS.TABLE_LEAVE, function(payload) {
    TableController.leave(appState, session, payload);
  });

  socket.on('disconnect', function () {
    console.log('socket disconnect...', socket.id);
    appState.removePlayer(session);
  });

  socket.on('error', function (err) {
    console.log('received error from socket:', socket.id);
    console.log(`socket info: ${socket}`);
    console.log(err);
  })
});

http.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
});