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
