import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export default class Logout extends Component {
  constructor(props) {
    super(props);

    localStorage.removeItem('token');
    localStorage.clear();
    //this.props.history.push('/')
  }
  render() {
    return (
      <div>
        <hi>You have been logged out </hi>
        <Link to="/login">Login Again</Link>
      </div>
    );
  }
}
