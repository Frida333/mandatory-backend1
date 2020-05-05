import React from 'react';

import './inputmessage.css';

export default function InputMessage( {message, setMessage , sendMessage}){


  return(
    <div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Sänd meddelande</button>
      </form>
    </div>
  )
}
