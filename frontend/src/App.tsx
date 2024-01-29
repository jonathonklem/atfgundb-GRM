import React from 'react';
import Authenticated from './components/authenticated';
import Dashboard from './components/dashboard';
import UserDataProvider from './components/contexts/userDataContext';

// app takes prop LocalDev, which is a boolean
// if true, it will not use auth0
// if false, it will use auth0
const App = (props) => {
  if (props.LocalDev) {
      return (<UserDataProvider><Dashboard authToken="LOCALTESTING" LocalDev={props.LocalDev}/></UserDataProvider>);
  } else {
      return (<UserDataProvider><Authenticated/></UserDataProvider>);
  }
}

export default App;
