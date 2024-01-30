import React from "react";
import {Ammo} from "../../Types";
import CreatableSelect from 'react-select/creatable';
import { RangeTripContext } from "../contexts/rangeTripContext";
import { GunContext } from "../contexts/gunContext";
import { AmmoContext } from "../contexts/ammoContext";
import { RangeTripContextType, GunContextType, AmmoContextType } from "../../Types";

import customStyles from "../../customStyles";
  
const RangeTrip = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [rangeOptions, setRangeOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [ranges, setRanges] = React.useState<string[]>([]);

    const { rangeTrips, addRangeTrip } = React.useContext(RangeTripContext) as RangeTripContextType;
    const { guns } = React.useContext(GunContext) as GunContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    
    const [filteredAmmo, setFilteredAmmo] = React.useState<Ammo[]>(ammo);
    
    React.useEffect(() => {
        rangeTrips.map((rangeTrip) => {
            if (ranges.indexOf(rangeTrip.location) === -1) {
                rangeOptions.push({ label: rangeTrip.location, value: rangeTrip.location });
                // remove duplicates from calibers
                setRangeOptions(rangeOptions);
                
                ranges.push(rangeTrip.location);
                setRanges(ranges)
            }
        });
    }, []);

    function filterAmmo(e) {
        const gunId = e.target.value;
        const gun = guns.find((gun) => gun.ID === gunId);
        const filteredAmmo = ammo.filter((ammoItem) => ammoItem.caliber === gun?.caliber);
        setFilteredAmmo(filteredAmmo);
    }

    function showAllAmmo() {
        setFilteredAmmo(ammo);
    }

    function handleSubmit(e)  {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.quantity_used =  Number(formJson.quantity_used);

        if (clearObject.gun_id === ""
            || clearObject.ammo_id === ""
            || clearObject.location === ""
            || clearObject.quantity_used === ""
        ) {
            setSuccessMessage("*** All fields except note are required ***");
            return;
        }

        setSuccessMessage("Saving.....");
        addRangeTrip(clearObject, () => {setSuccessMessage("Range Trip added successfully!");form.reset();});
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="range-red.png" />Range Trip</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className=" my-2">
                    <div className="block font-extralight text-sm tracking-wider">Gun</div><div className="block w-full p-2 mx-auto">
                    <select onChange={filterAmmo} id="gun_id" name="gun_id">
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label>
                <label className="block my-4 mx-auto"><div className="block text-sm font-extralight tracking-wider">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id">
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
                    </div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Location</div><div className="block w-full p-2 mx-auto"><div className="block w-full w-1/2 mx-auto">
                    <CreatableSelect styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" name="location" options={rangeOptions} />    
                </div></div></label>
                <label className="block my-4 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Quantity Used</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="quantity_used" /></div></div></label>
                <label className="block my-2 mb-24 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Note</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><textarea name="note"></textarea></div></div></label>                
                
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    );
}

export default RangeTrip;