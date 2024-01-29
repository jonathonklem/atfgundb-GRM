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

import { GunContext } from "./contexts/gunContext";
import { UserDataContext } from "./contexts/userDataContext";


// Initialize React Ga with your tracking ID
ReactGA.initialize('G-51Z216F6XZ');


const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Dashboard = (props) => {
    const defaultUserId = props.LocalDev ? '659f2cdfc8528e10ee4dbecb' : '';

    const {guns, fetchGuns, addGun} = useContext(GunContext) as GunContextType;
    const {userId, setUserId, setAuthToken} = useContext(UserDataContext) as UserDataContextType;

    var [profileSaved, setProfileSaved] = useState(false);
    const [ammo, setAmmo] = useState<Ammo[]>([]);
    const [rangeTrips, setRangeTrips] = useState<RangeTripType[]>([]); 

    const [fetchingAmmo, setFetchingAmmo] = useState(false);
    const [fetchingRangeTrips, setFetchingRangeTrips] = useState(false);

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
    
   

    function purchaseAmmo(clearObject, callback) {
        // post formJson to our env var url
        fetch(`${url}/ammo/purchase`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => {callback()}).then(() => fetchAmmo());

    }
    function addAmmo (clearObject, callback) {
        // post formJson to our env var url
        fetch(`${url}/ammo/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => {callback(); fetchAmmo();});
    }
    function fetchAmmo() {
        if (!userId) { return; }

        if (fetchingAmmo) { return }

        setFetchingAmmo(true);
        fetch(url+'/ammo?user_id='+userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
            .then(response => response.json()) 
            .then(data => setAmmo(data)).then(() => setFetchingAmmo(false));
    }
    function removeAmmo(id) {
        fetch(url+ '/ammo/remove?ammo_id='+id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        }).then(() => fetchAmmo());
    }

    function disposeAmmo(ammoId, quantity, callback) {
        fetch(`${url}/ammo/dispose?ammo_id=`+ammoId+`&quantity=`+quantity, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => {callback(); fetchAmmo()});

    }

    function addMaintenance(gunId, formJson, callback) {
        // post formJson to our env var url
        fetch(url + '/guns/addMaintenance?gun_id='+gunId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(formJson)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => callback());
    }

    function addAccessory(gunId, formJson, callback) {
        // post formJson to our env var url
        fetch(url+ '/guns/addAccessory?gun_id='+gunId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(formJson)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => callback());
    }

    function fetchRangeTrips() {
        if (!userId) { return; }
        if (fetchingRangeTrips) { return }

        setFetchingRangeTrips(true);
        fetch(url+'/range/getRangeTrips?user_id='+userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
            .then(response => response.json())
            .then(data => setRangeTrips(data)).then(() => setFetchingRangeTrips(false));
    }

    useEffect(() => {
        if (props.LocalDev) {
            setAuthToken(props.authToken);
            setUserId(defaultUserId);

            fetchAmmo();
            fetchRangeTrips();
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
                .then(data => setProfileSaved(true)).then(() => fetchGuns()).then(() => fetchAmmo()).then(() => fetchRangeTrips());   // avoid weird race type condition
        }
    }

    function addRangeTrip(clearObject, callback) {
         // post formJson to our env var url
         fetch(url+ '/range/addTrip', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => callback()).then(() => fetchGuns()).then(() => fetchAmmo()).then(() => fetchRangeTrips());

    }

    function removeGun(gunId) {
        fetch(url+ '/guns/remove?gun_id='+gunId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        }).then(() => fetchGuns());
       // window.location.href="/"; // can't imagine there's not a more elegant solution...
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
                    <Route path="/delete" element={<DeleteScreen RemoveAccount={RemoveAccount} authToken={props.authToken} Url={url} UserId={userId} />}/>
                    <Route path="guns">
                        <Route index  element={<Guns authToken={props.authToken} Url={url} UserId={userId} />} />
                        <Route path="add" element={<AddGun/>} />
                        <Route path="maintenance" element={<Maintenance AddMaintenance={addMaintenance} Guns={guns} authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="accessories" element={<Accessory AddAccessory={addAccessory} Guns={guns} authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="view/:id" element={<ViewGun RemoveGun={removeGun} Guns={guns} authToken={props.authToken} Url={url} UserId={userId} />} />
                    </Route>
                    <Route path="ammo">
                        <Route index element={<AmmoIndex authToken={props.authToken} Ammo={ammo}/>} />
                        <Route path="add" element={<AddAmmo Guns={guns} AddAmmo={addAmmo} authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="purchase" element={<PurchaseAmmo Ammo={ammo} PurchaseAmmo={purchaseAmmo} authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="dispose" element={<Dispose DisposeAmmo={disposeAmmo} Ammo={ammo} authToken={props.authToken} Url={url} UserId={userId}/>} />
                        <Route path="view/:id" element={<ViewAmmo Ammo={ammo} RemoveAmmo={removeAmmo} />} />
                    </Route>
                    <Route path="trips">
                        <Route index element={<RangeTrip RangeTrips={rangeTrips} AddRangeTrip={addRangeTrip} Guns={guns} Ammo={ammo} authToken={props.authToken} Url={url} UserId={userId}/>} />
                    </Route>
                    <Route path="reports">
                        <Route index element={<Reports authToken={props.authToken} Url={url} UserId={userId}/>} />
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