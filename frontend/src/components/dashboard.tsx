import React from "react";
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Guns from "./guns/index";

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
            <Router>
                <Routes>
                    <Route 
                        path="/"
                        element={
                            <div>
                                <ul>
                                    <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/guns">Guns</Link></li>
                                    <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/ammo">Ammo</Link></li>
                                    <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/trips">Range Trips</Link></li>
                                    <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/accessories">Accessories</Link></li>
                                    <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/maintenance">Maintenance</Link></li>
                                </ul>
                                <LogoutButton/>
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/guns"
                        element={<Guns />}
                    ></Route>
                </Routes>
            </Router>
        )
    } else {
        return (
            <div>An error has occurred</div>
        )
    }
}

export default Dashboard;