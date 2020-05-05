import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';

import Infobar from '../infobar/Infobar';
import InputMessage from '../input/InputMessage';
import Messages from '../messages/Messages';

let socket;

export default function Chat({location}) {
  const PORT = ('localhost:8090');
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect (()=>{
    const {name, room } = queryString.parse(location.search);
    socket = io(PORT);
    setName(name);
    setRoom(room);

    socket.emit('join', {name, room}, () => {

    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  },[ PORT, location.search]);

  useEffect (() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();

    if(message){
      socket.emit('new_message', message, () =>
        setMessage(''));
      }
  }
  console.log(messages);
    return (
      <div>
        <div>
          <Infobar room={room} />
          <Messages messages={messages} name={name}/>
          <InputMessage message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
      </div>
    );
}
