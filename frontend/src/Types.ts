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
    roundcount: Number,
    user_id: string,
    accessories: Accessory[],
    maintenance: Maintenance[],

}

export interface AmmoPurchase {
    name: string,
    count: Number,
    grain: string,
    user_id: string,
    price: Number,
    date: string,
}

export interface Maintenance {
    maintenance_type: string,
    date_done: string,
}
export interface Ammo {
    ID?: Number,
    name: string,
    amount: Number,
    grain: string,
    user_id: string,
    average_price: Number,
    last_price: Number,
    caliber: string,
}

export interface RangeTripType {
    ID?: Number,
    date_done: Date,
    location: string,
    gun_id: string,
    ammo_id: string,
    round_count?: Number,
    quantity_used?: Number,
    user_id: string,
    note?: string,
}

export type UserDataContextType = {
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
    removeGun: (id: String) => void;
    editGun: (id: string, clearObject:any, callback:any) => void;
};

export type AmmoContextType = {
    ammo: Ammo[];
    setAmmo: (ammo: Ammo[]) => void;
    addAmmo: (clearObject:any, callback:any) => void;
    fetchAmmo: () => void;
    removeAmmo: (id: String) => void;
    disposeAmmo: (id: String, quantity: Number, callback:any) => void;
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
