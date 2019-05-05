import React, { Component } from 'react';
import './TilesList.css';

export class TilesList extends Component {
  render() {
    return (
      <div className="tiles-list">
        {this.props.tiles.map((tile, index) => <div onClick={() => this.props.onClick(tile)} key={`${tile.name}-${index}-available`} className="available-tile">
          {tile.name}
        </div> )}
      </div>
    );
  }
}

export default TilesList;
