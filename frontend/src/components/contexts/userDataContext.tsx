// Context.js
import React, { useState } from "react";
import {GunProvider} from "./gunContext";
import { UserDataContextType, Ammo, AmmoPurchase, RangeTripType } from "../../Types";
 
export const UserDataContext = React.createContext<UserDataContextType | null>(null)
export const UserDataProvider = ({ children }) => {
    const [ammo, setAmmo] = useState<Ammo[]>([]);
    const [ammoPurchases, setAmmoPurchases] = useState<AmmoPurchase[]>([]);
    const [rangeTrips, setRangeTrips] = useState<RangeTripType[]>([]);
    const [authToken, setAuthToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
 
    return (
        <UserDataContext.Provider value={{authToken, setAuthToken, userId, setUserId, ammo, setAmmo, ammoPurchases, setAmmoPurchases, rangeTrips, setRangeTrips}}>
            <GunProvider>
                {children}
            </GunProvider>
        </UserDataContext.Provider>
    );
};

export default UserDataProvider;