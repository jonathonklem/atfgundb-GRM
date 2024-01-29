// Context.js
import React, { useState } from "react";
import {GunProvider} from "./gunContext";
import {AmmoProvider} from "./ammoContext";
import {AmmoPurchaseProvider} from "./ammoPurchaseContext";
import { UserDataContextType } from "../../Types";
import { RangeTripProvider } from "./rangeTripContext";
 
export const UserDataContext = React.createContext<UserDataContextType | null>(null)
export const UserDataProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
 
    return (
        <UserDataContext.Provider value={{authToken, setAuthToken, userId, setUserId}}>
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