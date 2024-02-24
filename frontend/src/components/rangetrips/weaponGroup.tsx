import React from 'react';
import { Ammo, GunContextType, AmmoContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import { AmmoContext } from "../contexts/ammoContext";

const WeaponGroup = (props) => {
    const { guns } = React.useContext(GunContext) as GunContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    const [filteredAmmo, setFilteredAmmo] = React.useState<Ammo[]>(ammo);
    const [incremental, setIncremental] = React.useState(false);

    const gunHandler = (e) => {
        props.updateWeaponGroup(props.rowNum, e.target.name, e.target.value);
        filterAmmo(e);
    }

    const filterAmmo = (e) => {
        const gunId = e.target.value;
        const gun = guns.find((gun) => gun.ID === gunId);
        const filteredAmmo = ammo.filter((ammoItem) => ammoItem.caliber === gun?.caliber);
        setFilteredAmmo(filteredAmmo);
    }

    const showAllAmmo = () => {
        setFilteredAmmo(ammo);
    }

    return (
        <div className={(props.rowNum%2) ? "bg-altrow p-4" : "p-4"}>
            <label className="my-2">
                    <div className="block font-extralight text-sm tracking-wider">Gun #{props.rowNum+1}</div><div className="block w-full p-2 mx-auto">
                    <select onChange={gunHandler} name="gun_id" value={props.weaponGroup.gun_id}>
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option key={gun.ID} value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div>
            </label>
            <label className="block my-4 mx-auto">
                <div className="block text-sm font-extralight tracking-wider">Ammo</div>
                <div className="block w-full p-2 mx-auto">
                    <select name="ammo_id" value={props.weaponGroup.ammo_id} onChange={(e) => props.updateWeaponGroup(props.rowNum, e.target.name, e.target.value)}>
                        <option>Choose</option>
                        {filteredAmmo.map((item: Ammo) => (
                            <option value={item?.ID?.toString()}>{item.name}</option>
                        ))}
                    </select>
                    {
                        filteredAmmo.length != ammo.length && (
                            <>
                                <button className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 w-1/8 block text-center mx-auto" onClick={(e) => {e.preventDefault(); showAllAmmo()}} > Show All </button>
                            </>
                        )
                    }
                </div>
            </label>
            {!incremental && (
                <>
                    <label className="block my-4 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Quantity Used</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" value={props.weaponGroup.quantity_used} name="quantity_used" onChange={(e) => props.updateWeaponGroup(props.rowNum, e.target.name, Number(e.target.value))} /></div></div></label>
                </>
                
            )}
            {incremental && (
                <>
                    <label className="block my-2 mx-auto grid grid-cols-3">
                        <label className="inline my-4"><div className="text-sm block font-extralight text-center tracking-wider">Total Quantity Used</div><div className="w-full mx-auto"><div className="block w-full p-2 w-full mx-auto"><input type="text" readOnly={incremental} value={props.weaponGroup.quantity_used} name="quantity_used"/></div></div></label>
                        <label className="inline my-4"><div className="text-sm block font-extralight text-center tracking-wider">Rounds to Add</div><div className="w-full mx-auto"><div className="block w-full p-2 w-full mx-auto"><input type="text" value={props.weaponGroup.quantity_addl}  name="quantity_addl" onChange={(e) => props.updateWeaponGroup(props.rowNum, e.target.name, Number(e.target.value)) } /></div></div></label>
                        <div className="inline text-sm font-extralight tracking-wider align-middle"><button className="rounded-3xl tracking-wider text-xs mt-12 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto" onClick={(e) => {
                            e.preventDefault();
                            const qtyUsed = Number(props.weaponGroup.quantity_used);
                            const qtyAddl = Number(props.weaponGroup.quantity_addl);
                            let total = 0;
                            if (isNaN(qtyUsed)) {
                                total = qtyAddl;
                            } else {
                                total = qtyUsed + qtyAddl;
                            }
                            props.updateWeaponGroup(props.rowNum, 'quantity_used', total)
                        }}>Increase Rounds</button></div>
                    </label>
                </>
            
            )}
            <button onClick={(e) => {e.preventDefault(); setIncremental(!incremental)}} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Toggle Incremental</button>
        </div>
    )
}

export default WeaponGroup;