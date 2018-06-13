export const join = (app, session, payload) => {
    session.username = session.username ? `${session.username}+` : 'testing';
    session.socket.broadcast.emit('table.joined', {"youJoined": session.username});
    console.log(`${session.username} joined the table`);
    console.log(`Joining table data: ${JSON.stringify(payload)}`);
};

export const leave = (app, socket, session, payload) => {
    session.socket.broadcast.emit('table.left', {"youLeft": session.username});
    console.log(`Leaving table data: ${JSON.stringify(payload)}`);
};