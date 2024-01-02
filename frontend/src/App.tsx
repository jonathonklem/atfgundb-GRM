import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Types';

const getenv = require('getenv');

const url = getenv.string('REACT_APP_API');

class App extends React.Component {
  state = {guns: null, ammo: null};

  callApi() {
    fetch(`${url}/guns`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((response) => {
      let output = "";
      response.forEach((item:Gun) => {
        output += item.name + ",";
      })
      this.setState({guns: output})
    });
    fetch(`${url}/ammo`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((response) => {
      let output = "";
      response.forEach((item:Ammo) => {
        output += item.name + ","
      })
      this.setState({ammo: output})
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <input type="button" onClick={() => this.callApi()} value="Call API"/>
        <p>
          {this.state.guns}
        </p>
        <p>
          {this.state.ammo}
        </p>
      </div>
    );
  }
}

export default App;
