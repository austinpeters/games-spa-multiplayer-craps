import express from 'express';
import AppController from './controllers/app';
import * as DiceController from './controllers/dice';
import * as BetController from './controllers/betting';
import * as TableController from './controllers/table';

const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));
const io = require('socket.io')(http);
const appState = new AppController();

io.of('/websocket').on('connection', function (socket) {

  let session = {};
  session.socket = socket;

  appState.addPlayer(session);
  appState.broadcastAppState(session);

  console.log("New connection!");

  socket.on('bet.add', function(payload) {
    BetController.add(appState, session, payload);
  });

  socket.on('bet.remove', function(payload) {
    BetController.remove(appState, session, payload);
  });

  socket.on('dice.roll', function(payload) {
    DiceController.roll(appState, session, payload);
  });

  socket.on('table.join', function(payload) {
    TableController.join(appState, session, payload);
  });

  socket.on('table.leave', function(payload) {
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