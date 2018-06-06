import * as BetController from './controllers/betting';
import * as TableController from './controllers/table';

const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', function (client) {
  client.on('table.join', TableController.join)

  client.on('table.leave', TableController.leave)

  client.on('bet.add', BetController.add)

  client.on('bet.remove', BetController.remove)

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(`client info: ${client}`);
    console.log(err)
  })
})

server.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})