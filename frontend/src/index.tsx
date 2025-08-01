import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const localDev = false;

if (localDev) {
  root.render(
    <React.StrictMode>
      <Router>
        <App LocalDev={localDev}/>
      </Router>
    </React.StrictMode>
  );
} else {
  root.render(
    <Auth0Provider
      domain="auth.atfgundb.com"
      clientId="juK0uHzgNj7H5lpskbPx34CEzlqVYHvF"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <React.StrictMode>
        <Router>
          <App LocalDev={localDev} />
        </Router>
      </React.StrictMode>
    </Auth0Provider>
  );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
