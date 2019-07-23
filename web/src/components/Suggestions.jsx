import React, { Component } from 'react';

class Suggestions extends Component {
  render() {
    return (
      <div className="suggestion">
        <h4>Alchemist suggestions:</h4>
        <ul>
          {this.props.suggestions.map(suggestion => <li>{suggestion.text}</li>)}
        </ul>
      </div>
    );
  }
}

export default Suggestions;
