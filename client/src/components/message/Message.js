import React from 'react';

import './message.css';

export default function Message({message:{user, text}, name}){
  let currentUser = false;

  const userName = name.trim();
    if(user === userName){
      currentUser = true;
    }

  return(
    (currentUser)
    ? (
      <div>
        <p>{userName}  {text}</p>
      </div>
    )
   : (
     <div>
       <p>{user}  {text}</p>
     </div>
   )
  )
}
