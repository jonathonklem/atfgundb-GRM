import { useEffect, useState, useContext  } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import {Gun, GunContextType, UserDataContextType, Ammo, RangeTripType} from "../Types";
import Guns from "./guns/index";
import AddGun from "./guns/add";
import AmmoIndex from "./ammo/index";
import AddAmmo from "./ammo/add";
import PurchaseAmmo from "./ammo/purchaseAmmo";
import Dispose from "./ammo/dispose";
import Maintenance from "./guns/maintenance";
import Accessory from "./guns/accessory";
import RangeTrip from "./rangetrips/index";
import Reports from "./reports";
import ViewGun from "./guns/view";
import ViewAmmo from "./ammo/view";
import ReactGA from 'react-ga4';
import DeleteScreen from "./delete";
import EditGun from "./guns/edit";
import EditAmmo from "./ammo/edit";

import { GunContext } from "./contexts/gunContext";
import { UserDataContext } from "./contexts/userDataContext";


// Initialize React Ga with your tracking ID
ReactGA.initialize('G-51Z216F6XZ');


const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Dashboard = (props) => {
    const defaultUserId = props.LocalDev ? '659f2cdfc8528e10ee4dbecb' : '';

    const {userId, setUserId, setAuthToken} = useContext(UserDataContext) as UserDataContextType;

    var [profileSaved, setProfileSaved] = useState(false);
    const {user, isAuthenticated, isLoading, logout  } = useAuth0();

    function RemoveAccount() {
        fetch(url+'/users/delete?user_id='+userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        }).then(() => {
            if (props.LocalDev) {  
                window.location.href="/"; // can't imagine there's not a more elegant solution...
            } else {
                logout({ logoutParams: { returnTo: window.location.origin }});
            }
            
        }); 
    }

    useEffect(() => {
        if (props.LocalDev) {
            setAuthToken(props.authToken);
            setUserId(defaultUserId);
        } else {
            setUserId(user?.sub?.split("|")[1] || '');
        }
    }, [user]);

    
    function saveProfile() {
        if (props.authToken && !props.LocalDev && user) {
            user.id = user.sub?.split("|")[1];
            
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
                .then(data => setProfileSaved(true));   // avoid weird race type condition
        }
    }

    if (isLoading && !props.LocalDev) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated || props.LocalDev) {
        if (!profileSaved && !props.LocalDev) {
            saveProfile();
            const userId = user?.sub?.split("|")[1];
        }

        return (
            <>
                <Routes>
                    <Route 
                        path="/"
                        element={
                            <div className="">
                                <h1 className="mt-8 text-center text-3xl font-bold mb-4">Welcome to GunDB</h1>
                                <p className="text-justify mx-auto mb-8 p-4 block max-w-md">With GunDB, you can effortlessly keep tabs on your ammo purchases, range trips, and gun collection, providing a streamlined approach to firearm management. Easily log details of each ammunition purchase, including quantity, caliber, and date, ensuring you always have an accurate inventory at your fingertips.  
                                </p><p className="text-justify mx-auto p-4 block max-w-md">Track your range sessions, recording the firearms used, and rounds fired. Organize your gun collection with comprehensive profiles, featuring essential information about each firearm. Whether you're a seasoned gun enthusiast or a new firearm owner, GunDB simplifies the process of monitoring and maintaining your shooting supplies and equipment.</p>
                                <p className="text-justify mx-auto mb-8 p-4 block max-w-md">If you would like to delete your account have have your information wiped from our database you can click the following button at any time:</p>
                                <Link className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block mb-24 text-center mx-auto" to="/delete">Account Deletion</Link>
                            </div>
                        }
                    ></Route>
                    <Route path="/delete" element={<DeleteScreen RemoveAccount={RemoveAccount} />}/>
                    <Route path="guns">
                        <Route index  element={<Guns />} />
                        <Route path="add" element={<AddGun/>} />
                        <Route path="maintenance" element={<Maintenance/>} />
                        <Route path="accessories" element={<Accessory />} />
                        <Route path="view/:id" element={<ViewGun />} />
                        <Route path="edit/:id" element={<EditGun />} />
                    </Route>
                    <Route path="ammo">
                        <Route index element={<AmmoIndex/>} />
                        <Route path="add" element={<AddAmmo />} />
                        <Route path="purchase" element={<PurchaseAmmo />} />
                        <Route path="dispose" element={<Dispose />} />
                        <Route path="view/:id" element={<ViewAmmo  />} />
                        <Route path="edit/:id" element={<EditAmmo  />} />
                    </Route>
                    <Route path="trips">
                        <Route index element={<RangeTrip/>} />
                    </Route>
                    <Route path="reports">
                        <Route index element={<Reports/>} />
                    </Route>
                </Routes>
                <ul className="mt-4 fixed -bottom-6 w-full left-0 text-center bg-red-800">
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/guns"><img alt="Guns" className="w-6 m-auto" src="/pistol.png" /></Link></li>
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/ammo"><img alt="Ammo" className="w-6 m-auto" src="/bullet.png" /></Link></li>
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/trips"><img alt="Range Trips" className="w-6 m-auto" src="/range.png" /></Link></li>
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/guns/accessories"><img alt="Accessories" className="w-6 m-auto" src="/scope.png" /></Link></li>
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/guns/maintenance"><img alt="Maintenance" className="w-6 m-auto" src="/tool.png" /></Link></li>
                    <li className="inline-block w-1/12"><Link className="bg-red-800 text-slate-50 py-2 w-full inline-block my-2 text-center mx-auto" to="/reports"><img alt="Reports" className="w-6 m-auto" src="/pie-chart.png" /></Link></li>
                    <li className="inline-block w-1/12"><LogoutButton /></li>
                </ul>
            </>
        )
    } else {
        return (
            <div>An error has occurred</div>
        )
    }
}

export default Dashboard;