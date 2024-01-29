import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import Dashboard from "./dashboard";
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { UserDataContext } from "./contexts/userDataContext";
import { UserDataContextType } from "../Types";
import {
  BrowserRouter as Router,
} from "react-router-dom";


const refreshAccessToken = async (setAuthToken) => {
  try {
    createAuth0Client({
      domain: 'auth.atfgundb.com',
      clientId: 'juK0uHzgNj7H5lpskbPx34CEzlqVYHvF'
    }).then((auth0) => {
      auth0.getTokenSilently({
        authorizationParams: {
            audience: "https://txdcr1sizh.execute-api.us-east-1.amazonaws.com/",
            scope: 'access:general',
            prompt: 'none',
        }
      }).then((token) => {
        console.log("token");
        console.log(token);
        setAuthToken(token || '');
      });
    });
  } catch (e) {
    console.log(e);
  }  
}

const Authenticated = () => {
    const {isAuthenticated} = useAuth0();
    const {setAuthToken} = React.useContext(UserDataContext) as UserDataContextType;

    React.useEffect(() => {
        refreshAccessToken(setAuthToken);
    }, [isAuthenticated]);
  
    if (isAuthenticated) {
      return <Dashboard />;
    } else {
      return <LoginButton/>;
    }
}

export default Authenticated;