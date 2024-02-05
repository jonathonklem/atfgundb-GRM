import React from 'react';
import { Ammo, GunContextType, AmmoContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import { AmmoContext } from "../contexts/ammoContext";

const WeaponGroup = (props) => {
    const { guns } = React.useContext(GunContext) as GunContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    const [filteredAmmo, setFilteredAmmo] = React.useState<Ammo[]>(ammo);
    const [staticQtyUsed, setStaticQtyUsed] = React.useState(0);
    const [incremental, setIncremental] = React.useState(false);


    function filterAmmo(e) {
        const gunId = e.target.value;
        const gun = guns.find((gun) => gun.ID === gunId);
        const filteredAmmo = ammo.filter((ammoItem) => ammoItem.caliber === gun?.caliber);
        setFilteredAmmo(filteredAmmo);
    }

    function showAllAmmo() {
        setFilteredAmmo(ammo);
    }

    return (
        <div className={(props.rowNum%2) ? "bg-altrow p-4" : "p-4"}>
            <label className="my-2">
                    <div className="block font-extralight text-sm tracking-wider">Gun #{props.rowNum+1}</div><div className="block w-full p-2 mx-auto">
                    <select onChange={filterAmmo} name={"weapongroup_" + props.rowNum + "_gun_id"}>
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div>
            </label>
            <label className="block my-4 mx-auto">
                <div className="block text-sm font-extralight tracking-wider">Ammo</div>
                <div className="block w-full p-2 mx-auto">
                    <select name={"weapongroup_" + props.rowNum + "_ammo_id"}>
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
                    <label className="block my-4 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Quantity Used</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" value={staticQtyUsed} onChange={(e) => setStaticQtyUsed(Number(e.target.value))} name={"weapongroup_" + props.rowNum + "_quantity_used"} /></div></div></label>
                </>
                
            )}
            {incremental && (
                <>
                    <label className="block my-2 mx-auto grid grid-cols-3">
                        <label className="inline my-4"><div className="text-sm block font-extralight text-center tracking-wider">Total Quantity Used</div><div className="w-full mx-auto"><div className="block w-full p-2 w-full mx-auto"><input type="text" readOnly={incremental} value={staticQtyUsed} name={"weapongroup_" + props.rowNum + "_quantity_used"} /></div></div></label>
                        <label className="inline my-4"><div className="text-sm block font-extralight text-center tracking-wider">Rounds to Add</div><div className="w-full mx-auto"><div className="block w-full p-2 w-full mx-auto"><input type="text" name={"weapongroup_" + props.rowNum + "_quantity_addl"} /></div></div></label>
                        <div className="inline text-sm font-extralight tracking-wider align-middle"><button className="rounded-3xl tracking-wider text-xs mt-12 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto" onClick={(e) => {
                            e.preventDefault();
                            const qtyUsed = parseInt((document.querySelector('input[name="weapongroup_' + props.rowNum + '_quantity_used"]') as HTMLInputElement).value);
                            const qtyAddl = parseInt((document.querySelector('input[name="weapongroup_' + props.rowNum + '_quantity_addl"]') as HTMLInputElement).value);
                            setStaticQtyUsed(qtyUsed + qtyAddl);
                        }}>Increase Rounds</button></div>
                    </label>
                </>
            
            )}
            <button onClick={(e) => {e.preventDefault(); setIncremental(!incremental)}} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Toggle Incremental</button>
        </div>
    )
}

export default WeaponGroup;