import React from 'react';
import {Link} from 'react-router-dom';

import './infobar.css';

export default function Infobar({room}){


  return(
    <div>
     <h3>{room}</h3>
      <Link to = '/' >
        <button> Stäng fönster </button>
      </Link>
    </div>
  )
}
