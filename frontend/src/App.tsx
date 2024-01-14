import React from 'react';
import Authenticated from './components/authenticated';
import Dashboard from './components/dashboard';

// app takes prop LocalDev, which is a boolean
// if true, it will not use auth0
// if false, it will use auth0
const App = (props) => {
  if (props.LocalDev) {
      return (<Dashboard authToken="LOCALTESTING" LocalDev={props.LocalDev}/>);
  } else {
      return (<Authenticated/>);
  }
}

export default App;
