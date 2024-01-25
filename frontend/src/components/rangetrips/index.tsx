import React from "react";
import {Ammo} from "../../Types";
import CreatableSelect from 'react-select/creatable';

const RangeTrip = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [rangeOptions, setRangeOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [ranges, setRanges] = React.useState<string[]>([]);
    const [filteredAmmo, setFilteredAmmo] = React.useState<Ammo[]>(props.Ammo);

    React.useEffect(() => {
        props.RangeTrips.map((rangeTrip) => {
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
        const gun = props.Guns.find((gun) => gun.ID === gunId);
        const filteredAmmo = props.Ammo.filter((ammo) => ammo.caliber === gun.caliber);
        setFilteredAmmo(filteredAmmo);
    }

    function showAllAmmo() {
        setFilteredAmmo(props.Ammo);
    }

    function handleSubmit(e)  {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.quantity_used =  Number(formJson.quantity_used);

        if (clearObject.gun_id === ""
            || clearObject.ammo_id === ""
            || clearObject.location === ""
            || clearObject.quantity_used === ""
        ) {
            setSuccessMessage("*** All fields are required ***");
            return;
        }

        setSuccessMessage("Saving.....");
        props.AddRangeTrip(clearObject, () => {setSuccessMessage("Range Trip added successfully!");form.reset();});
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Range Trip</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Gun</div><div className="block w-full p-2 mx-auto">
                    <select onChange={filterAmmo} id="gun_id" name="gun_id">
                        <option>Choose</option>
                        {props.Guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id">
                            <option>Choose</option>
                            {filteredAmmo.map((item: Ammo) => (
                                <option value={item?.ID?.toString()}>{item.name}</option>
                            ))}
                        </select>
                        {
                            filteredAmmo.length != props.Ammo.length && (
                                <>
                                    <button className="rounded-md bg-red-800 text-xs text-slate-50 py-1 px-4 w-1/8 block my-2 text-center mx-auto" onClick={(e) => {e.preventDefault(); showAllAmmo()}} > Show All </button>
                                </>
                            )
                        }
                    </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Location</div><div className="block w-full p-2 mx-auto"><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect className="text-neutral-700 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md;" name="location" options={rangeOptions} />    
                </div></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Quantity Used</div><div className="block w-full p-2 mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="quantity_used" /></div></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    );
}

export default RangeTrip;