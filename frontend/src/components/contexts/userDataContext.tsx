// Context.js
import React, { useState } from "react";
import {GunProvider} from "./gunContext";
import { useAuth0 } from "@auth0/auth0-react";
import {AmmoProvider} from "./ammoContext";
import {AmmoPurchaseProvider} from "./ammoPurchaseContext";
import { UserDataContextType } from "../../Types";
import { RangeTripProvider } from "./rangeTripContext";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

export const UserDataContext = React.createContext<UserDataContextType | null>(null)
export const UserDataProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const { logout  } = useAuth0();


    function removeAccount() {
        fetch(url+'/users/delete?user_id='+userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }
        }).then(() => {
            logout({ logoutParams: { returnTo: window.location.origin }});    
        }); 
    }
    
    // pass freshUserId to avoid waiting for state to consolidate
    function saveProfile(freshUserId, user) {
        user.id = freshUserId;      
        fetch(`${url}/users/saveVisit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            },
            body: JSON.stringify(user)
        })
    }

    return (
        <UserDataContext.Provider value={{removeAccount, saveProfile, authToken, setAuthToken, userId, setUserId}}>
            <GunProvider>
                <AmmoProvider>
                    <AmmoPurchaseProvider>
                        <RangeTripProvider>
                            {children}
                        </RangeTripProvider>
                    </AmmoPurchaseProvider>
                </AmmoProvider>
            </GunProvider>
        </UserDataContext.Provider>
    );
};

export default UserDataProvider;