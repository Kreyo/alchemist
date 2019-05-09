import React, { Component } from 'react';
import Game from './components/Game';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Login/>
        <Game/>
      </div>
    );
  }
}

export default App;
