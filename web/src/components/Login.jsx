import React, { Component } from 'react';
import axios from 'axios';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    }).then(response => console.log(response));
  };

  render() {
    return (
      <div className="Login">
        <h4>Login to restore progress</h4>
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

export default Login;