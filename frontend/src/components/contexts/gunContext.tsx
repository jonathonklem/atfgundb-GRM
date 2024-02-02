import React, { useState ,useEffect } from "react";
import { GunContextType, Gun } from "../../Types";
import { UserDataContext } from "./userDataContext";
import { UserDataContextType } from "../../Types";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

export const GunContext = React.createContext<GunContextType | null>(null);
export const GunProvider = ({ children }) => {
    const [guns, setGuns] = useState<Gun[]>([]);
    const { authToken, userId } = React.useContext(UserDataContext) as UserDataContextType;

    const [fetchingGuns, setFetchingGuns] = useState<boolean>(false);

    useEffect(() => {
        fetchGuns();
    }, [authToken]);

    function editGun(id: string, clearObject:any, callback:any) {
        clearObject.user_id = userId;
        clearObject.id = id;
        
        fetch(`${url}/guns/edit`, {
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
            callback(data);
        });
    }

    function fetchGuns() {
        console.log("Fetch guns auth token: " + authToken);
        if (!authToken) { return; }

        if (fetchingGuns) { return }

        setFetchingGuns(true);
        fetch(url+'/guns?user_id='+userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }
        })
            .then(response => response.json())
            .then(data => setGuns(data)).then(() => setFetchingGuns(false));
    }

    function addGun(clearObject, callback) {
        clearObject.user_id = userId;
        // post formJson to our env var url
        fetch(`${url}/guns/add`, {
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
            callback(data);
        });
    }

    function removeGun(gunId, callback) {
        fetch(url+ '/guns/remove?gun_id='+gunId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }
        })
        .then(response => response.json())
        .then((data) => {
            fetchGuns();
            callback(data);
        });
    }


    return (
        <GunContext.Provider value={{guns, setGuns, addGun, fetchGuns, removeGun, editGun}}>
            {children}
        </GunContext.Provider>
    );
};

export default GunProvider;