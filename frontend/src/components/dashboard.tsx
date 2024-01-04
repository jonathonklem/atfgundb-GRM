import React from "react";
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Dashboard = () => {
    var [profileSaved, setProfileSaved] = useState(false);

    const {user, isAuthenticated} = useAuth0();

    if (!profileSaved) {
        if (user) {
            user.id = user.sub?.split("|")[1];
        }
        
        fetch(`${url}/users/saveVisit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => setProfileSaved(true));
    }

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