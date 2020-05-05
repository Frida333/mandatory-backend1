const express = require('express');
const app = express();
const http = require('http').createServer(app);


const io = require('socket.io')(http);


const PORT = process.env.PORT || 8090;
const {addUser, getUser, getUserInRoom} = require('./users');
const {getClient, getDB, createObjectId} = require('./db');

app.get('/', (req, res) => {
  res.send('server is up and running');
});



io.on('connection' , (socket) => {
  console.log("connected");

  socket.on('join', ({name, room}, cb) => {
    const {error, user} = addUser({ id: socket.id, name, room});
    if(error){
      return cb(error);
    }

    socket.emit('message', {user:"Admin", text:` Välkommen till ${user.room}, ${user.name}`});

    socket.broadcast.to(user.room).emit('message', {user: "Admin" ,text: `${user.name} har anslutit`});

    socket.join(user.room);

    cb();
  });

  socket.on('new_message', (message , cb) => {
    const user = getUser(socket.id);

    const db = getDB();
    db.collection('rooms').insertOne({room: user.room, data:{ user:user.name, text:message}});
    io.to(user.room).emit('message', {user: user.name, text: message});

    cb();
  });

  socket.on('disconnect', () => {
    console.log('user has left')
  });
});



http.listen(PORT, () => {
  console.log("servern har startat" +`${PORT}`);
})
