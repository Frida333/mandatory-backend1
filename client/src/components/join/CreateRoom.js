import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactDOM from 'react-dom';

export default function InputMessage({setName, setRoom, room, name, setCreateRoom}){
  const [redirect, setRedirect] = useState(false);


  function onSubmit(e){
    e.preventDefault();

    axios.post('/chat', {
      room: room
    })
      .then((response) => {
          setRoom(room);
          setRedirect(true);
      })
      .catch(err => {
          console.log(err);
      });
  }

  return ReactDOM.createPortal((
    <div>
      <h3>Skapa ett nytt rum att chatta i</h3>

      <form onSubmit={(e) => onSubmit(e) }>
      <input
        placeholder="skriv ditt namn"
        label="Användare namn"
        type="text"
        required
        onChange={(e)=> setName(e.target.value) }
      />
      <input
        placeholder="rummets namn"
        label="rum"
        type="text"
        required
        onChange={(e) => setRoom(e.target.value) }
      />
      <button type='submit'>Börja chatta</button>
        {redirect && <Redirect to={`/chat?name=${name}&room=${room}`} />}
      </form>
    </div>
  ),document.body);
}
