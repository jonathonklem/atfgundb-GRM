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
import AddGun from "./guns/add";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Dashboard = () => {
    var [profileSaved, setProfileSaved] = useState(false);

    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
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
                                Put something here
                            </div>
                        }
                    ></Route>
                    <Route
                        path="guns"
                       
                    >
                        <Route index  element={<Guns UserId={userId} />} />
                        <Route path="add" element={<AddGun />} />
                    </Route>
                </Routes>
                <ul className="mt-4 fixed -bottom-2 w-full left-0">
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns">Guns</Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/ammo">Ammo</Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/trips">Sess.</Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/accessories">Acc.</Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/maintenance">Maint.</Link></li>
                    <li className="inline-block w-2/12"><LogoutButton /></li>
                </ul>
            </Router>
        )
    } else {
        return (
            <div>An error has occurred</div>
        )
    }
}

export default Dashboard;