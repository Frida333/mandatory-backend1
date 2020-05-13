import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import CreateRoom from './CreateRoom';


export default function Join() {
  const [createRoom, setCreateRoom] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [savedRooms, setSavedRooms] = useState([]);
  const [id, setId] = useState();


  useEffect(() => {
    axios.get('/chat')
    .then(( res ) => {
      setSavedRooms([...savedRooms, res.data]);
    })
    .catch((err) =>{
      console.log(err)
    })
  },[])

  function onClickDelete(e, id, room){
    e.preventDefault();
    axios.delete(`/chat/${id}/${room}`, {
    })
      .then((res)=>{
    })
      .catch((err) => {
    });
  }

  function createNewRoom(){
    setCreateRoom(true);
    setRoom('');
  }

  return(
  <div >
    <h1>Välkommen till chatten</h1>
    <div>
    <form>
      <label> Namn:
        <input type='text' required placeholder='Namn' onChange={(e) => setName(e.target.value)}></input>
      </label>
        <div>
          {savedRooms.map((room,i) => {
            return(
              room.map((j, index) => {
                return(
                  <div key={j._id} >
                    {j.room}
                    <Link onSubmit={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${j.room}`}>
                      <button type='submit'>Börja chatta</button>
                    </Link>
                    <button onClick={(e) => onClickDelete(e, j._id, j.room) }>Delete</button>
                  </div>
                )
              })
          )})}
          </div>
        </form>
        <button  onClick={createNewRoom}>Skapa ett nytt rum</button>
  </div>
    {createRoom && <CreateRoom room={room} setRoom={setRoom} name={name} setName={setName} /> }
  </div>
);
}
