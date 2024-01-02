interface Accessory {
    name: string,
    manufacturer: string,
    model: string,
}
interface Gun {
    name: string,
    manufacturer: string,
    model: string,
    caliber: string,
    round_count: BigInteger,
    accessories: Accessory[],

}

interface Ammo {
    name: string,
    amount: BigInteger,
    grain: string,
    average_price: BigInteger,
    last_price: BigInteger,
}