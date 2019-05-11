import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tile from './Tile';
import TilesList from './TilesList';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragged: null
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  combineElements(first, second) {
    axios.post('/api/combineElements', { first, second })
      .then(result => {
        if (result.data.result.length) {
          const firstOccurence = _.findIndex(this.props.tiles, element => element.id === first);
          const secondOccurence = _.findIndex(this.props.tiles, element => element.id === second);
          let newTiles = [...this.props.tiles];
          newTiles.splice(firstOccurence, 1);
          newTiles.splice(secondOccurence, 1);
          this.props.setTiles([...newTiles, result.data.result[0]]);
          this.props.setAvailableTiles([...this.props.availableTiles, result.data.result[0]]);
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
          <h2>Available elements</h2>
          <TilesList
            tiles={this.props.availableTiles}
            onClick={tile => this.props.setTiles([...this.props.tiles, tile])}
          />
          <hr />
        </div>
        { !this.props.tiles.length && <p>Loading...</p> }
        <div className='crafting'>
          <h2>Crafting!</h2>
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
      </div>
    );
  }
}

export default Game;