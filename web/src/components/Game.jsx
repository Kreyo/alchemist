import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tile from './Tile';
import TilesList from './TilesList';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      availableTiles: [],
      dragged: null
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  componentDidMount() {
    // axios.get("/api/getUsers")
    //   .then(result => console.log(result));
    axios.get("/api/getStarters")
      .then(result => this.setState({ tiles: result.data.result, availableTiles: result.data.result }));
  }

  combineElements(first, second) {
    axios.post("/api/combineElements", { first, second })
      .then(result => {
        if (result.data.result.length) {
          const firstOccurence = _.findIndex(this.state.tiles, element => element.id === first);
          const secondOccurence = _.findIndex(this.state.tiles, element => element.id === second);
          let newTiles = [...this.state.tiles];
          newTiles.splice(firstOccurence, 1);
          newTiles.splice(secondOccurence, 1);
          this.setState(
            {
              tiles: [...newTiles, result.data.result[0]],
              availableTiles: [...this.state.availableTiles, result.data.result[0]],
            });
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
      <div className="container">
        <div className="available-tiles">
          <h2>Available elements</h2>
          <TilesList
            tiles={this.state.availableTiles}
            onClick={tile => this.setState({ tiles: [...this.state.tiles, tile] })}
          />
          <hr />
        </div>
        { !this.state.tiles.length && <p>Loading...</p> }
        <div className="crafting">
          <h2>Crafting!</h2>
          {this.state.tiles.map((tile, index) =>
            <Tile
              key={`${tile.id}${index}-starters`}
              onDragStart={this.onDragStart}
              onDragOver={this.onDragOver}
              onDragEnd={this.onDragEnd}
              value={tile.id}
              name={tile.name}
              color={tile.color}
              dataId={`${tile.id}-${index}`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Game;