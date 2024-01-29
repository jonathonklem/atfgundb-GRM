import React, { useState ,useEffect } from "react";
import { AmmoPurchaseContextType } from "../../Types";
import { UserDataContext } from "./userDataContext";
import { UserDataContextType } from "../../Types";
import { AmmoContext } from "./ammoContext";
import { AmmoContextType } from "../../Types";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

export const AmmoPurchaseContext = React.createContext<AmmoPurchaseContextType | null>(null);
export const AmmoPurchaseProvider = ({ children }) => {

    const { authToken } = React.useContext(UserDataContext) as UserDataContextType;
    const { fetchAmmo } = React.useContext(AmmoContext) as AmmoContextType;

    function purchaseAmmo(clearObject, callback) {
        // post formJson to our env var url
        fetch(`${url}/ammo/purchase`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => {callback()}).then(() => fetchAmmo());

    }

    return (
        <AmmoPurchaseContext.Provider value={{purchaseAmmo}}>
            {children}
        </AmmoPurchaseContext.Provider>
    )
}

export default AmmoPurchaseProvider;