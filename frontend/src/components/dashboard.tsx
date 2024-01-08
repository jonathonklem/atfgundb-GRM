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
                        <Route index  element={<Guns authToken={props.authToken} Url={url} UserId={userId} />} />
                        <Route path="add" element={<AddGun authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="maintenance" element={<Maintenance authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="accessories" element={<Accessory authToken={props.authToken} Url={url} UserId={userId}/>} />
                    </Route>
                    <Route path="ammo">
                        <Route index element={<Ammo authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="add" element={<AddAmmo authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="purchase" element={<PurchaseAmmo authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="dispose" element={<Dispose authToken={props.authToken} Url={url} UserId={userId}/>} />
                    </Route>
                    <Route path="trips">
                        <Route index element={<RangeTrip authToken={props.authToken} Url={url} UserId={userId}/>} />
                    </Route>
                </Routes>
                <ul className="mt-4 fixed -bottom-6 w-full left-0">
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns"><img alt="Guns" className="w-6 m-auto" src="/pistol.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/ammo"><img alt="Ammo" className="w-6 m-auto" src="/bullet.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/trips"><img alt="Range Trips" className="w-6 m-auto" src="/range.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns/accessories"><img alt="Accessories" className="w-6 m-auto" src="/scope.png" /></Link></li>
                    <li className="inline-block w-2/12"><Link className="bg-red-800 text-slate-50 py-2 px-4 w-full inline-block my-2 text-center mx-auto" to="/guns/maintenance"><img alt="Maintenance" className="w-6 m-auto" src="/tool.png" /></Link></li>
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