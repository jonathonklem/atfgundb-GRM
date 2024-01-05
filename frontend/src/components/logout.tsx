import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <button className="bg-red-800 text-slate-50 py-2 w-full block my-2 text-center" onClick={() => logout()}>Log Out</button>;
};

export default LogoutButton;