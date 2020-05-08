import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';


export default function Join() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [savedRooms, setSavedRooms] = useState([]);

  useEffect(() => {
    axios.get('/chat')
    .then(( res ) => {
      setSavedRooms([...savedRooms, res.data]);
    })
    .catch((err) =>{
      console.log(err)
    })
  },[])

  return (
  <div >
    <h1>Join</h1>
      <form>
        <div>
          <input
            placeholder="skriv ditt namn"
            label="Användare namn"
            type="text"
            required
            onChange={(e)=> setName(e.target.value) }
          />
        </div>
        <div>
          <input
            placeholder="skapa ett rum"
            label="rum"
            type="text"
            required
            onChange={(e) => setRoom(e.target.value) }
          />
        </div>

        <Link to={`/chat?name=${name}&room=${room}`}>
      <button type="submit">Börja chatta </button>

        </Link>


     </form>
  </div>
  );
}
