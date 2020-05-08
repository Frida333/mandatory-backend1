const express = require('express');
const app = express();
const http = require('http').createServer(app);


const io = require('socket.io')(http);
const {addUser, getUser, getUserInRoom} = require('./users');
const {getClient, getDB, createObjectId} = require('./db');


const PORT = process.env.PORT || 8090;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('server is up and running');
});


app.post('/chat', (req,res) => {
  const db = getDB();
  let data = req.body;
  console.log(data)
  db.collection('savedrooms')
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId
      res.status(201).send(data)
  })
    .catch(e => {
      console.log(e);
      res.status(500).end()
    })
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


app.get('/chat/:id', (req,res) =>{
  let roomId = req.params.id;
  const db=getDB();
  db.collection('savedrooms')
    .findOne({_id: createObjectId(roomId)})
    .then(room => {
      console.log(room)
      res.send(room);
  })
  .catch(e => {
    console.log(e)
    res.status(500).end();
  })
})

io.on('connection' , (socket) => {

  console.log("connected");
  socket.on('join', ({name, room}, cb) => {
    const {err, user} = addUser({id: socket.id, name, room});

    const db = getDB();

    if(err){
      return cb(err);
    }

    db.collection('rooms').find({room}).toArray((err, res) => {
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

    db.collection('rooms').insertOne({
      room: user.room,
      messages:
       {user: user.name, text: message}
    });


    io.to(user.room).emit('message', {user: user.name, text: message});
    io.to(user.room).emit('roomData', {room:user.room , users: getUserInRoom(user.room)});
    cb();
  });

  socket.on('disconnect', () => {
    console.log('user has left')
  });
});



http.listen(PORT, () => {
  console.log("servern har startat" +`${PORT}`);
})
