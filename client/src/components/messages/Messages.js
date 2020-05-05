import React from 'react';

import Message from '../message/Message'
import './messages.css';

export default function Messages({messages, name}){

  return(
    <div>
     {messages.map((message, i ) => <div key={i}><Message message={message} name={name}/></div>)}
    </div>
  )
}
