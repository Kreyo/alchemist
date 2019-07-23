import React, { Component } from 'react';
import axios from 'axios';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';
import './components/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      tiles: [],
      availableTiles: [],
      suggestions: [],
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
        .then(result => {
          this.setState({ tiles: result.data.result, availableTiles: result.data.result });
          this.getSuggestions();
        });
    }
  }

  setUser(user) {
    this.setState({
      user: user,
      availableTiles: user.discoveredElements,
    });
    localStorage.setItem('alchemyUser', JSON.stringify(user));
  }

  getSuggestions() {
    const elementIds = this.state.availableTiles.map(element => element.id);
    if (elementIds.length) {
      axios.post('/api/getSuggestions', {elements: elementIds})
        .then(response => this.setState({ suggestions: response.data.result }));
    }
  }


  setAvailableTiles(availableTiles) {
    this.setState({ availableTiles });
    const { user } = this.state;
    if (user) {
      user.discoveredElements = availableTiles;
      axios.put('/api/update', user);
      localStorage.setItem('alchemyUser', JSON.stringify(user));
    }
    this.getSuggestions();
  }

  render() {
    return (
      <div className="container">
        <h1>Alchemy Game</h1>
        { this.state.user ?
          `Logged in as ${this.state.user.username}` : <Login setUser={this.setUser} />}
        { !this.state.user && <Register setUser={this.setUser} availableElements={this.state.availableTiles} />}
        <div style={{ clear: 'both' }}/>
        <hr />
        <div className="progress">
          Discovered {this.state.availableTiles.length} of 18
        </div>
        <Game
          tiles={this.state.tiles}
          availableTiles={this.state.availableTiles}
          setTiles={tiles => this.setState({ tiles })}
          setAvailableTiles={this.setAvailableTiles}
          suggestions={this.state.suggestions}
        />
      </div>
    );
  }
}

export default App;
