export const add = (app, session, payload) => {
    session.socket.broadcast.emit('bet.added', {"betAdded": session.username});
    console.log(`Adding bet data: ${JSON.stringify(payload)}`);
}

export const remove = (app, session, payload) => {
    session.socket.broadcast.emit('bet.removed', {"betRemoved": session.username});
    console.log(`Removing bet data: ${JSON.stringify(payload)}`);
}