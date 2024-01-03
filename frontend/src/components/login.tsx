import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" onClick={() => loginWithRedirect()}>Log In / SignUp</button>;
};

export default LoginButton;