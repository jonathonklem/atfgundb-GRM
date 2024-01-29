import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <button className="text-slate-50 relative py-2 w-full block my-2 text-center" onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}><img className="w-11 m-auto" src="/logout.png" /></button>;
};

export default LogoutButton;