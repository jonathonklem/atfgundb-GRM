import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import Dashboard from "./dashboard";

const Authenticated = () => {
    const {isAuthenticated} = useAuth0();
  
    if (isAuthenticated) {
      return <Dashboard/>;
    } else {
      return <LoginButton/>;
    }
}

export default Authenticated;