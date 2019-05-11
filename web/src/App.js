import React, { Component } from 'react';
import axios from 'axios';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      tiles: [],
      availableTiles: [],
    }

    this.setUser = this.setUser.bind(this);
    this.setAvailableTiles = this.setAvailableTiles.bind(this);
  }

  componentDidMount() {
    const localUser = JSON.parse(localStorage.getItem('alchemyUser'));
    if (localUser) {
      this.setState({
        user: localUser,
        availableTiles: localUser.discoveredElements,
        tiles: localUser.discoveredElements
      })
    } else {
      axios.get('/api/getStarters')
        .then(result => this.setState({ tiles: result.data.result, availableTiles: result.data.result }));
    }
  }

  setUser(user) {
    this.setState({
      user: user,
      availableTiles: user.discoveredElements,
    });
    localStorage.setItem('alchemyUser', JSON.stringify(user));
  }

  setAvailableTiles(availableTiles) {
    this.setState({ availableTiles });
    const { user } = this.state;
    if (user) {
      user.discoveredElements = availableTiles;
      axios.put('/api/update', user);
      localStorage.setItem('alchemyUser', JSON.stringify(user));
    }
  }

  render() {
    return (
      <div className="container">
        { this.state.user ? `Logged in as ${this.state.user.username}` : <Login setUser={this.setUser} />}
        { !this.state.user && <Register setUser={this.setUser} availableElements={this.state.availableTiles} />}
        <div style={{ clear: 'both' }}/>
        <Game
          tiles={this.state.tiles}
          availableTiles={this.state.availableTiles}
          setTiles={tiles => this.setState({ tiles })}
          setAvailableTiles={this.setAvailableTiles}
        />
      </div>
    );
  }
}

export default App;
