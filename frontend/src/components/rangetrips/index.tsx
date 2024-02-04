import React from "react";
import {Ammo} from "../../Types";
import CreatableSelect from 'react-select/creatable';
import { RangeTripContext } from "../contexts/rangeTripContext";

import { RangeTripContextType } from "../../Types";

import customStyles from "../../customStyles";
import WeaponGroup from "./weaponGroup";
  
const RangeTrip = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [rangeOptions, setRangeOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [ranges, setRanges] = React.useState<string[]>([]);
    const [weaponGroupCount, setWeaponGroupCount] = React.useState(1);

    const { rangeTrips, addRangeTrip } = React.useContext(RangeTripContext) as RangeTripContextType;


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

    function renderWeaponGroups() {
        let weaponGroups: React.ReactNode[] = [];
        for (let i = 0; i < weaponGroupCount; i++) {
            weaponGroups.push(<WeaponGroup rowNum={i} key={i} />);
        }
        return weaponGroups;
    }

    function handleSubmit(e)  {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));

        for (let i = 0; i < weaponGroupCount; i++) {
            if (clearObject[`weapongroup_${i}_gun_id`] === ""
                || clearObject[`weapongroup_${i}_ammo_id`] === ""
                || clearObject[`weapongroup_${i}_quantity_used`] === ""
            ) {
                setSuccessMessage("*** All fields except note are required ***");
                return;
            }

            clearObject[`weapongroup_${i}_quantity_used`] = Number(clearObject[`weapongroup_${i}_quantity_used`]);
        }   

        setSuccessMessage("Saving.....");
        addRangeTrip(clearObject, (data) => {
            if (data.success) {
                setSuccessMessage("Range Trip added successfully!");
                form.reset();
            } else {
                setSuccessMessage("Error adding some entries:\n" + data.error);
            }
        });
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="range-red.png" />Range Trip</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">

                {renderWeaponGroups()}

                <div className="text-center">
                    {weaponGroupCount > 1 && (
                        <button onClick={(e) => {
                            e.preventDefault();
                            setWeaponGroupCount(weaponGroupCount - 1);
                        }} className="inline mx-4 rounded-3xl mt-8 tracking-wider bg-redbg drop-shadow-lg text-white py-2 px-4  block text-center">Remove Weapon Group</button>
                )}
                    
                    {weaponGroupCount < 6 && (
                        <button onClick={(e) => {
                            e.preventDefault();
                            setWeaponGroupCount(weaponGroupCount + 1);
                        }} className="inline mx-4 rounded-3xl mt-8 tracking-wider bg-redbg drop-shadow-lg text-white py-2 px-4  block text-center">Add Weapon Group</button>
                    )}
                </div>

                <label className="block my-2 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Location</div><div className="block w-full p-2 mx-auto"><div className="block w-full w-1/2 mx-auto">
                    <CreatableSelect styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" name="location" options={rangeOptions} />    
                </div></div></label>
               
                <label className="block my-2 mb-24 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Note</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><textarea name="note"></textarea></div></div></label>                
                
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    );
}

export default RangeTrip;