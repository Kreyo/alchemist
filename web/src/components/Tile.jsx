import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import './Tile.css';

export class Tile extends Component {
  componentDidMount() {
    this.$node = $(this.refs.draggable);
    this.$node.draggable({
      drag: () => this.props.onDragStart(this.props.value),
      stop: this.props.onDragEnd
    });
    this.$node.droppable({
      drop: () => this.props.onDragOver(this.props.value)
    });
  }

  render() {
    return <div
      ref="draggable"
      className="tile"
      style={{
        backgroundColor: this.props.color
      }}
    >
      {this.props.name}
    </div>
  }
}

export default Tile;
