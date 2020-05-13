import React from 'react';
import ReactEmoji from 'react-emoji';
import './message.css';

export default function Message({message:{user, text}, name}){
  let currentUser = false;

  const userName = name.trim().toLowerCase();
    if(user === userName){
      currentUser = true;
    }

  return(
    (currentUser)
    ? (
      <div>
        <p>{userName}  {ReactEmoji.emojify(text)}</p>
      </div>
    )
   : (
     <div>
       <p>{user}  {ReactEmoji.emojify(text)}</p>
     </div>
   )
  )
}
