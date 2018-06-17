import * as Constants from '../shared/constants';
import io from 'socket.io-client';

export default function () {
    const socket = io.connect('/websocket')
  
    function registerHandler(action, handler) {
      socket.on(action, handler);
    }
  
    function unregisterHandler(action) {
      socket.off(action)
    }

    function rollDice(obj) {
        socket.emit(
            Constants.SOCKET_EVENTS.DICE_ROLL,
            obj
        );
    }
  
    socket.on('error', function (err) {
      console.log('received socket error:')
      console.log(err)
    })
  
    return {
      registerHandler,
      unregisterHandler,
      rollDice
    }
  }

