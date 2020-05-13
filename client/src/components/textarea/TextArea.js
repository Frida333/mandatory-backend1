import React from 'react';
import './textArea.css';



export default function TextArea({ users }) {

  return(
    <div>
  {
    users
    ? (
      <div>
      <h3>Vi är i rummet nu:</h3>
        <div>
          <h2>
          {users.map(({name}) => (
            <div key={name}>
            {name}
            </div>
          ))}
          </h2>
        </div>
      </div>
    )
    : null
  }
    </div>
  );
}
