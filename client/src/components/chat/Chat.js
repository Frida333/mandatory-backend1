import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';

import Infobar from '../infobar/Infobar';
import InputMessage from '../input/InputMessage';
import Messages from '../messages/Messages';
import Join from '../join/Join';
import TextArea from '../textarea/TextArea';

let socket;

export default function Chat({location}) {
  const PORT = ('localhost:8090');
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState('');


  useEffect (()=>{
    const {name, room } = queryString.parse(location.search);
    socket = io(PORT);
    setName(name);
    setRoom(room);

    socket.emit('join', {name, room}, (error) => {
      if(error) {
        console.log(error);
      }
    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  },[PORT, location.search]);

  useEffect (() => {
    const {name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);

    socket.on('savedMessages', (res) => {
      setMessages(messages => [...messages, ...res.res.map(savedMessages => savedMessages.messages)]);
    })
  }, [location.search]);

  useEffect(( ) => {
    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
       setUsers(users);
    });
}, [ ]);

function sendMessage(e) {
    e.preventDefault();
    if(message){
      socket.emit('new_message', message, () =>
        setMessage(''));
    }
  }

  return (
    <div>
      <div>
        <Infobar room={room} />
        <Messages messages={messages} name={name}/>
        <InputMessage message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
       <TextArea users={users}/>
    </div>
  );
}
