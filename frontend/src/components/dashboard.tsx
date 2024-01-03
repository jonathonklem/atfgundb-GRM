import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";

const Dashboard = () => {
    const {user, isAuthenticated} = useAuth0();

    if (isAuthenticated) {
        const userId = user?.sub?.split("|")[1];
        return (
            <div>
                <img src={user?.picture} alt={user?.name} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <p>Your userid is {userId}</p>
                <LogoutButton/>
            </div>
        )
    } else {
        return (
            <div>An error has occurred</div>
        )
    }
}

export default Dashboard;