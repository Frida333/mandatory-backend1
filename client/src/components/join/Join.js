import React, {useState} from 'react';
import {Link} from 'react-router-dom';



export default function Join() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");


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
