import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import Dashboard from "./dashboard";
import { createAuth0Client } from '@auth0/auth0-spa-js';


const refreshAccessToken = async (setAuthToken) => {
  try {
    const auth0 = await createAuth0Client({
      domain: 'dev-bxzha665kfgz0ltz.us.auth0.com',
      clientId: 'juK0uHzgNj7H5lpskbPx34CEzlqVYHvF'
    });


    const token = await auth0.getTokenSilently({
        authorizationParams: {
            audience: "https://txdcr1sizh.execute-api.us-east-1.amazonaws.com/",
            scope: 'access:general',
            prompt: 'none',
        }
    });
    console.log("token");
    console.log(token);
    setAuthToken(token || '');
  } catch (e) {
    console.log(e);
  }
  

  
}

const Authenticated = () => {
    const {isAuthenticated} = useAuth0();
    const [authToken, setAuthToken] = React.useState('');

    React.useEffect(() => {
        //refresh2();
        refreshAccessToken(setAuthToken);
    }, [isAuthenticated]);
  
    if (isAuthenticated) {
      return <Dashboard authToken={authToken} />;
    } else {
      return <LoginButton/>;
    }
}

export default Authenticated;