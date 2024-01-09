import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import Dashboard from "./dashboard";
import { createAuth0Client } from '@auth0/auth0-spa-js';


//var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRFUkNHRnYwNjJJZV85clYwdUtrVSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ieHpoYTY2NWtmZ3owbHR6LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDUyMjU3OTc1MDU4NjgyNDY1OCIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiaHR0cHM6Ly9kZXYtYnh6aGE2NjVrZmd6MGx0ei51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzA0NjYyNDg4LCJleHAiOjE3MDQ3NDg4ODgsImF6cCI6Imp1SzB1SHpnTmo3SDVscHNrYlB4MzRDRXpscVZZSHZGIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBhY2Nlc3M6Z2VuZXJhbCJ9.nZbE-_jdEPe_BwOmhwtfk-lbN7Q1btUcDvGFP0QYJ1js7C7aEGZWPDOd-eDpTbdZkzYEgQVleq8uli_a9GFsqTFvXOAicymeUZKxeBkYZrWglbccptcp7t1y-ZcOsqkYqUFxsM4GEUBxj31AJU3hf_xGg55VPPwgl9hTIS1TMnKcxkO_wduDG6yI5ierDC9UHxWGzQP9PKZSEx0gbUb_k8nxAPCFXIL24zcIPmJFzxnijz-RxO7cV9v-qMPCKM1jC55KPr0VJxKd3OuluwM9rClrU9E-WKR4tvpS287HqvnukNESujRuFQZZsKQz6PbrQluF0LW57hDnoQdwFAjJ1w";

const refreshAccessToken = async (setAuthToken) => {
  try {
    const auth0 = await createAuth0Client({
      domain: 'dev-bxzha665kfgz0ltz.us.auth0.com',
      clientId: 'juK0uHzgNj7H5lpskbPx34CEzlqVYHvF'
    });

    const token = await auth0.getTokenWithPopup({
        authorizationParams: {
            audience: 'http://localhost:8080/',
            scope: 'access:general'
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
        // hard code for now
        refreshAccessToken(setAuthToken);
    }, [isAuthenticated]);
  
    if (isAuthenticated) {
      return <Dashboard authToken={authToken} />;
    } else {
      return <LoginButton/>;
    }
}

export default Authenticated;