import React from 'react';
import Chat from './components/chat/Chat';
import Join from './components/join/Join';
import './App.css';

import {BrowserRouter as Router, Route} from 'react-router-dom';

export default function App(){

    return (
      <Router>
        <Route exact path="/" component={Join} />
        <Route path="/chat" component={Chat}/>
      </Router>
    );

}
