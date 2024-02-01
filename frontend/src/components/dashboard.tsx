import { useEffect, useState, useContext  } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
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

    const {userId, saveProfile, setUserId, setAuthToken, authToken} = useContext(UserDataContext) as UserDataContextType;

    const {user, isAuthenticated, isLoading, logout  } = useAuth0();

    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        const tripElement = document.getElementById('trip') as HTMLImageElement;
        tripElement.src = '/range.png';

        const gunElement = document.getElementById('gun') as HTMLImageElement;
        gunElement.src = '/pistol.png';

        const ammoElement = document.getElementById('ammo') as HTMLImageElement;
        ammoElement.src = '/bullet.png';

        const accessElement = document.getElementById('access') as HTMLImageElement;
        accessElement.src = '/scope.png';

        const toolElement = document.getElementById('tool') as HTMLImageElement;
        toolElement.src = '/tool.png';

        const pieElement = document.getElementById('piechart') as HTMLImageElement;
        pieElement.src = '/pie-chart.png';

        console.log(pathname);
        switch (pathname.split('/')[1]) {
            case 'trips':
                tripElement.src = '/range-red.png';
            break;
            case 'guns':
                gunElement.src = '/pistol-red.png';
            break;
            case 'ammo':
                ammoElement.src = '/bullet-red.png';
            break;
            case 'accessories':
                accessElement.src = '/scope-red.png';
            break;
            case 'maintenance':
                toolElement.src = '/tool-red.png';
            break;
            case 'reports':
                pieElement.src = '/pie-chart-red.png';
            break;
        }
    }, [pathname]); 

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

    useEffect(() => {
        if (userId && authToken && !props.LocalDev) { 
            saveProfile(userId, user);
        }
    }, [authToken, userId]);

    
    

    if (isLoading && !props.LocalDev) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated || props.LocalDev) {
        return (
            <>
                <header className="mx-auto w-9/12 font-extralight text-lg tracking-wider text-center mt-4 pt-8 pb-8">
                    <img className="float-left" src="/small-logo.png" />
                    Atlas Technology
                </header>
                <Routes>
                    <Route 
                        path="/"
                        element={
                            <div className="">
                                <h1 className="mt-0 tracking-widest text-center text-lg mb-4">Welcome to GunDB</h1>
                                <p className="font-extralight opacity-80 mx-auto p-4 block max-w-md tracking-wider text-base">With GunDB, you can effortlessly keep tabs on your ammo purchases, range trips, and gun collection, providing a streamlined approach to firearm management. Easily log details of each ammunition purchase, including quantity, caliber, and date, ensuring you always have an accurate inventory at your fingertips.  
                                </p><p className="font-extralight opacity-80 mx-auto p-4 block max-w-md tracking-wider text-base">Track your range sessions, recording the firearms used, and rounds fired. Organize your gun collection with comprehensive profiles, featuring essential information about each firearm. Whether you're a seasoned gun enthusiast or a new firearm owner, GunDB simplifies the process of monitoring and maintaining your shooting supplies and equipment.</p>
                                <p className="font-extralight mx-auto opacity-80 mb-4 p-4 block max-w-md tracking-wider text-base">If you would like to delete your account have have your information wiped from our database you can click the following button at any time:</p>
                                <Link className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 max-w-md w-3/4 block mb-24 text-center mx-auto" to="/delete">Account Deletion</Link>
                            </div>
                        }
                    ></Route>
                    <Route path="/delete" element={<DeleteScreen RemoveAccount={RemoveAccount} />}/>
                    <Route path="guns">
                        <Route index  element={<Guns />} />
                        <Route path="add" element={<AddGun/>} />
                        <Route path="view/:id" element={<ViewGun />} />
                        <Route path="edit/:id" element={<EditGun />} />
                    </Route>
                    <Route path="accessories">
                        <Route index element={<Accessory />} />
                    </Route>
                    <Route path="maintenance">
                        <Route index element={<Maintenance />} />
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
                <ul className="bg-darkbg mt-4 flex justify-between fixed -bottom-2 w-full left-0 text-center">
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/guns"><img alt="Guns" id="gun" className="w-11 m-auto" src="/pistol.png" /></Link></li>
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/ammo"><img alt="Ammo" id="ammo" className="w-11 m-auto" src="/bullet.png" /></Link></li>
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/trips"><img alt="Range Trips" id="trip" className="w-11 m-auto" src="/range.png" /></Link></li>
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/accessories"><img id="access" alt="Accessories" className="w-11 m-auto" src="/scope.png" /></Link></li>
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/maintenance"><img alt="Maintenance" id="tool" className="w-11 m-auto" src="/tool.png" /></Link></li>
                    <li className="inline-block grow"><Link className="py-2 w-full inline-block my-2 text-center mx-auto" to="/reports"><img alt="Reports" id="piechart" className="w-11 m-auto" src="/pie-chart.png" /></Link></li>
                    <li className="inline-block grow"><LogoutButton /></li>
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