import React, { useState ,useEffect } from "react";
import { AmmoContextType, Ammo } from "../../Types";
import { UserDataContext } from "./userDataContext";
import { UserDataContextType } from "../../Types";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

export const AmmoContext = React.createContext<AmmoContextType | null>(null);
export const AmmoProvider = ({ children }) => {
    const [ammo, setAmmo] = useState<Ammo[]>([]);
    const { authToken, userId } = React.useContext(UserDataContext) as UserDataContextType;
    const [fetchingAmmo, setFetchingAmmo] = useState<boolean>(false);

    useEffect(() => {
        fetchAmmo();
    }, [authToken]);

    function addAmmo (clearObject, callback) {
        // post formJson to our env var url
        fetch(`${url}/ammo/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
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
                'Authorization' : 'Bearer ' + authToken
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
                'Authorization' : 'Bearer ' + authToken
            }
        }).then(() => fetchAmmo());
    }

    function disposeAmmo(ammoId, quantity, callback) {
        fetch(`${url}/ammo/dispose?ammo_id=`+ammoId+`&quantity=`+quantity, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => {callback(); fetchAmmo()});

    }

    return (
        <AmmoContext.Provider value={{ammo, setAmmo, disposeAmmo, removeAmmo, fetchAmmo, addAmmo}}>
            {children}
        </AmmoContext.Provider>
    );
}

export default AmmoProvider;