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
    date: string,
    location: string,
    gun_id: string,
    ammo_id: string,
    round_count: Number,
    user_id: string,
}

export type UserDataContextType = {
    authToken: string | null;
    setAuthToken: (authToken: string) => void;
    userId: string | null;
    setUserId: (userId: string) => void;
    
    ammo: Ammo[];
    setAmmo: (ammo: Ammo[]) => void;
    ammoPurchases: AmmoPurchase[];
    setAmmoPurchases: (ammoPurchases: AmmoPurchase[]) => void;
    rangeTrips: RangeTripType[];
    setRangeTrips: (rangeTrips: RangeTripType[]) => void;

    /*
    interest, can we have diff methods later?
    todos: ITodo[];
    saveTodo: (todo: ITodo) => void;
    updateTodo: (id: number) => void;
    */
  };

  export type GunContextType = {
    guns: Gun[];
    setGuns: (guns: Gun[]) => void;
    addGun: (clearObject:any, callback:any) => void;
    fetchGuns: () => void;
  };