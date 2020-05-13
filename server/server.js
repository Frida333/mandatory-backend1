const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {addUser, getUser, getUserInRoom, removeUser} = require('./users');
const {getClient, getDB, createObjectId} = require('./db');

const PORT = process.env.PORT || 8090;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('server is up and running');
});

app.post('/chat', (req, res) => {
  const db = getDB();
  let data = req.body;
  db.collection('savedrooms').find({room: data.room}).toArray()
    .then(result => {
      if(result.length === 0){
        db.collection('savedrooms')
        .insertOne(data)
        .then(result => {
          data._id = result.insertedId
          res.status(201).send(data)
        })
        .catch(e => {
          res.status(400).send();
        });
      }
    })
    .catch(e => {
    res.status(500).end()
  });
})

app.get('/chat', (req, res) => {
  const db = getDB();
  db.collection('savedrooms')
    .find({})
    .toArray()
    .then(data => {
      res.send(data);
    })
    .catch(e =>{
      console.log(e)
      res.status(500).end()
    })
})


app.delete('/chat/:id/:room', (req,res) =>{
  let roomId = req.params.id;
  let name = req.params.room;
  const db=getDB();
  db.collection('savedrooms')
    .deleteMany({_id: createObjectId(roomId)})
    .then(room => {
      console.log('savedrooms delete')
      res.status(200).send();
    })
    .catch(e => {
      console.log(e)
      res.status(500).end();
    });
    db.collection('chat')
    .deleteMany({room: name})
    .then(room => {
      console.log('chat deleted')
      res.status(200).send();
    })
    .catch(e => {
      console.log(e)
      res.status(500).end();
    });
})


io.on('connection' , (socket) => {
  console.log("connected");
  socket.on('join', ({name, room}, cb) => {

    const {err, user} = addUser({id: socket.id, name, room});
    const db = getDB();

    if(err){
      return cb(err);
    }

    db.collection('chat').find({room}).toArray((err, res) => {
      if (err){
        return(err);
      }
      socket.emit('savedMessages', ({res}))
    });
    socket.emit('message', {user:"Admin", text:` Välkommen till ${user.room}, ${user.name}`});
    socket.broadcast.to(user.room).emit('message', {user: "Admin" ,text: `${user.name} har anslutit`});
    socket.join(user.room);
    io.to(user.room).emit('roomData', {room:user.room , users: getUserInRoom(user.room)});
    cb();
  });

  socket.on('new_message', (message , cb) => {
    const user = getUser(socket.id);
    const db = getDB();

    db.collection('chat').insertOne({
      room: user.room,
      messages:
       {user: user.name, text: message}
    });
    io.to(user.room).emit('message', {user: user.name, text: message});
    io.to(user.room).emit('roomData', {room:user.room , users: getUserInRoom(user.room)});
    cb();
  });

  socket.on('disconnect', () => {
    console.log('user has left');
    const user = removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} har lämnat chatten.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room)});
    }
  });
});

http.listen(PORT, () => {
  console.log("servern har startat" +`${PORT}`);
})
