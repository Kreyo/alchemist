import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tile from './components/Tile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      dragged: null
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  componentDidMount() {
    axios.get("/api/getUsers")
      .then(result => console.log(result));
    axios.get("/api/getStarters")
      .then(result => this.setState({ tiles: result.data.result }));
  }

  combineElements(first, second) {
    axios.post("/api/combineElements", { first, second })
      .then(result => {
        if (result.data.result.length) {
          const newTiles = this.state.tiles;
          _.remove(newTiles, element => (element.id === first || element.id === second));
          newTiles.push(result.data.result[0]);
          this.setState({ tiles: newTiles });
        } else {
          alert('lol no');
        }
      });
  }

  onDragStart = value => {
    this.setState({ dragged: value });
  };

  onDragEnd = () => {
    this.setState({ dragged: null });
  };

  onDragOver = value => {
    this.combineElements(parseInt(this.state.dragged, 10), parseInt(value, 10));
  };

  render() {
    return (
      <div>
        { !this.state.tiles.length && <p>Loading...</p> }
        {this.state.tiles.map((tile, index) =>
          <Tile
            key={`${tile.id}${index}`}
            onDragStart={this.onDragStart}
            onDragOver={this.onDragOver}
            onDragEnd={this.onDragEnd}
            value={tile.id}
            name={tile.name}
            color={tile.color}
          />
        )}
      </div>
    );
  }
}

export default App;
