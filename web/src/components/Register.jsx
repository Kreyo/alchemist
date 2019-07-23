import React, { Component } from 'react';
import axios from 'axios';

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios.post('/api/register', {
      username: this.state.username,
      password: this.state.password,
      discoveredElements: this.props.availableElements,
    }).then(response => {
      if (response.data.error) {
        this.setState({ error: response.data.error });
      } else {
        console.log(response);
        this.props.setUser(response.data.result);
      }
    })
      .catch(e => console.log(e));
  };

  render() {
    return (
      <div className="register" style={{ float: 'right' }}>
        <h4>Register to save your progress</h4>
        <span className="error">{this.state.error}</span>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              id="username"
              name="username"
            />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              id="password"
              name="password"
            />
          </div>
          <br />
          <input type="submit"/>
        </form>
      </div>
    );
  }
}

export default Register;