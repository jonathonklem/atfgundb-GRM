export interface Accessory {
    name: string,
    manufacturer: string,
    model: string,
}
export interface Gun {
    ID: string,
    name: string,
    manufacturer: string,
    model: string,
    caliber: string,
    roundcount: number,
    user_id: string,
    accessories: Accessory[],
    maintenance: Maintenance[],

}

export interface AmmoPurchase {
    name: string,
    count: number,
    grain: string,
    user_id: string,
    price: number,
    date: string,
}

export interface Maintenance {
    maintenance_type: string,
    date_done: string,
}
export interface Ammo {
    ID?: number,
    name: string,
    amount: number,
    grain: string,
    user_id: string,
    average_price: number,
    last_price: number,
    caliber: string,
}

export interface RangeTripType {
    ID?: number,
    date_done: Date,
    location: string,
    gun_id: string,
    ammo_id: string,
    round_count?: number,
    quantity_used?: number,
    user_id: string,
    note?: string,
}

export type UserDataContextType = {
    removeAccount: () => void;
    saveProfile: (freshUserId:string, user:any) => void;
    authToken: string | null;
    setAuthToken: (authToken: string) => void;
    userId: string | null;
    setUserId: (userId: string) => void;
};

export type GunContextType = {
    guns: Gun[];
    setGuns: (guns: Gun[]) => void;
    addGun: (clearObject:any, callback:any) => void;
    fetchGuns: () => void;
    removeGun: (id: string, callback:any) => void;
    editGun: (id: string, clearObject:any, callback:any) => void;
};

export type AmmoContextType = {
    ammo: Ammo[];
    setAmmo: (ammo: Ammo[]) => void;
    addAmmo: (clearObject:any, callback:any) => void;
    fetchAmmo: () => void;
    removeAmmo: (id: string, callback:any) => void;
    disposeAmmo: (id: string, quantity: number, callback:any) => void;
    editAmmo: (id: string, clearObject:any, callback:any) => void;
};

export type AmmoPurchaseContextType = {
   purchaseAmmo: (clearObject:any, callback:any) => void;
};

export type RangeTripContextType = {
    rangeTrips: RangeTripType[];
    addRangeTrip: (clearObject:any, callback:any) => void;
    fetchRangeTrips: () => void;
};
