import React, { useState ,useEffect } from "react";
import { RangeTripContextType, RangeTripType } from "../../Types";
import { UserDataContext } from "./userDataContext";
import { UserDataContextType } from "../../Types";
import { GunContextType } from "../../Types";
import { GunContext } from "./gunContext";
import { AmmoContext } from "./ammoContext";
import { AmmoContextType } from "../../Types";
import { clear } from "console";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

export const RangeTripContext = React.createContext<RangeTripContextType | null>(null);
export const RangeTripProvider = ({ children }) => {

    const [rangeTrips, setRangeTrips] = useState<RangeTripType[]>([]);
    const [fetchingRangeTrips, setFetchingRangeTrips] = useState<boolean>(false);

    const { userId, authToken } = React.useContext(UserDataContext) as UserDataContextType;
    const { fetchGuns } = React.useContext(GunContext) as GunContextType;
    const { fetchAmmo } = React.useContext(AmmoContext) as AmmoContextType;

    useEffect(() => {
        fetchRangeTrips();
    }, [authToken]);

    const addRangeTrip = (clearObject, callback) => {
        clearObject.user_id = userId;

        // massage data for backend
        clearObject.weapon_groups = [];
        for (let i = 0; i < 5; i++) {
            if (!clearObject[`weapongroup_${i}_gun_id`]) { continue; }
            clearObject.weapon_groups.push({
                gun_id: clearObject[`weapongroup_${i}_gun_id`],
                ammo_id: clearObject[`weapongroup_${i}_ammo_id`],
                quantity_used: clearObject[`weapongroup_${i}_quantity_used`]
            });
            // remove the old keys
            delete clearObject[`weapongroup_${i}_gun_id`];
            delete clearObject[`weapongroup_${i}_ammo_id`];
            delete clearObject[`weapongroup_${i}_quantity_used`];
        }

        console.log(clearObject);
        // post formJson to our env var url
        fetch(url+ '/range/addTrip', {
           method: 'POST',
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization' : 'Bearer ' + authToken
           }, 
           body: JSON.stringify(clearObject)
       })
           .then(response => response.json())
           .then(data => {
                fetchGuns();
                fetchAmmo();
                fetchRangeTrips();
                callback(data);
           });

   }

   const fetchRangeTrips = () => {
        if (!userId) { return; }
        if (fetchingRangeTrips) { return }

        setFetchingRangeTrips(true);
        fetch(url+'/range/getRangeTrips?user_id='+encodeURIComponent(userId as string), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }
        })
            .then(response => response.json())
            .then(data => setRangeTrips(data)).then(() => setFetchingRangeTrips(false));
    }

    return (
        <RangeTripContext.Provider value={{rangeTrips, fetchRangeTrips, addRangeTrip}}>
            {children}
        </RangeTripContext.Provider>
    )
}
