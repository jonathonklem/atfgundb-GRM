import React, { useEffect } from "react";
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
import Ammo from "./ammo/index";
import AddAmmo from "./ammo/add";
import PurchaseAmmo from "./ammo/purchaseAmmo";
import Dispose from "./ammo/dispose";
import Maintenance from "./guns/maintenance";
import Accessory from "./guns/accessory";
import RangeTrip from "./rangetrips/index";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');


const Dashboard = (props) => {
    var [profileSaved, setProfileSaved] = useState(false);

    const {user, isAuthenticated, isLoading  } = useAuth0();


    function saveProfile() {
        if (props.authToken) {
            if (user) {
                user.id = user.sub?.split("|")[1];
            }
            
            fetch(`${url}/users/saveVisit`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + props.authToken
                },
                body: JSON.stringify(user)
            })
                .then(response => response.json())
                .then(data => setProfileSaved(true));
        }
    }


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        if (!profileSaved) {
            saveProfile();
        }

        const userId = user?.sub?.split("|")[1];
        
        return (
            <Router>
                <Routes>
                    <Route 
                        path="/"
                        element={
                            <div>
                               Auth token: {props.authToken}
                            </div>
                        }
                    ></Route>
                    <Route path="guns">
                        <Route index  element={<Guns UserId={userId} />} />
                        <Route path="add" element={<AddGun UserId={userId}/>} />
                        <Route path="maintenance" element={<Maintenance Url={url} UserId={userId}/>} />
                        <Route path="accessories" element={<Accessory Url={url} UserId={userId}/>} />
                    </Route>
                    <Route path="ammo">
                        <Route index element={<Ammo UserId={userId}/>} />
                        <Route path="add" element={<AddAmmo UserId={userId}/>} />
                        <Route path="purchase" element={<PurchaseAmmo UserId={userId}/>} />
                        <Route path="dispose" element={<Dispose UserId={userId}/>} />
                    </Route>
                    <Route path="trips">
                        <Route index element={<RangeTrip Url={url} UserId={userId}/>} />
                    </Route>
                </Routes>
                <ul className="mt-4 fixed -bottom-6 w-full left-0">
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns"><img className="w-6 m-auto" src="/pistol.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/ammo"><img className="w-6 m-auto" src="/bullet.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/trips"><img className="w-6 m-auto" src="/range.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns/accessories"><img className="w-6 m-auto" src="/scope.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns/maintenance"><img className="w-6 m-auto" src="/tool.png" /></Link></li>
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