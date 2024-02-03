import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <img className="mt-28 center m-auto" src="/biglogo.png" />
      <button className="rounded-3xl tracking-wider text-lg bg-redbg mt-28 drop-shadow-lg text-white py-2 px-4 w-1/4 block my-2 text-center mx-auto" onClick={() => loginWithRedirect()}>Log In</button>
      <p className="text-sm tracking-wider mt-14 text-center">Don't have an account? <span className="cursor-pointer text-redbg" onClick={() => loginWithRedirect({ authorizationParams: {screen_hint: 'signup' }})}>Sign up</span></p>
    </>
    
  );
};

export default LoginButton;