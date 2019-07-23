import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tile from './Tile';
import TilesList from './TilesList';
import Suggestions from './Suggestions';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragged: null,
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  combineElements(first, second) {
    axios.post('/api/combineElements', { first, second })
      .then(result => {
        if (result.data.result.length) {
          let newTiles = [...this.props.tiles];
          const firstOccurence = _.findIndex(newTiles, element => element.id === first);
          newTiles.splice(firstOccurence, 1);
          const secondOccurence = _.findIndex(newTiles, element => element.id === second);
          newTiles.splice(secondOccurence, 1);
          this.props.setTiles([...newTiles, result.data.result[0]]);
          const newAvailableTiles = [...this.props.availableTiles, result.data.result[0]];
          if (!_.find(this.props.availableTiles, result.data.result[0])) {
            this.props.setAvailableTiles(newAvailableTiles);
          }

        } else {
          alert('Try something else!');
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
      <div className='container'>
        <div className='available-tiles'>
          <h2>Available elements (click to add to crafting board)</h2>
          <TilesList
            tiles={this.props.availableTiles}
            onClick={tile => this.props.setTiles([...this.props.tiles, tile])}
          />
          <hr />
        </div>
        { !this.props.tiles.length && <p>Loading...</p> }
        <h2>Crafting</h2>
        <div className='crafting'>
          {this.props.tiles.map((tile, index) =>
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
        <Suggestions suggestions={this.props.suggestions} />
      </div>
    );
  }
}

export default Game;