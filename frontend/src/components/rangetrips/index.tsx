import React, {useEffect} from "react";
import CreatableSelect from 'react-select/creatable';
import { RangeTripContext } from "../contexts/rangeTripContext";

import { RangeTripContextType, RangeTripType, WeaponGroupType } from "../../Types";

import customStyles from "../../customStyles";
import WeaponGroup from "./weaponGroup";
  
const RangeTrip = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [rangeOptions, setRangeOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [ranges, setRanges] = React.useState<string[]>([]);
    const [weaponGroups, setWeaponGroups] = React.useState<WeaponGroupType[]>([{}] as WeaponGroupType[]);
    const [rangeTrip, setRangeTrip] = React.useState<RangeTripType>({ location: "" } as RangeTripType);

    const { rangeTrips, addRangeTrip } = React.useContext(RangeTripContext) as RangeTripContextType;

    const formRef = React.useRef(null);


    useEffect(() => {
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

    const updateWeaponGroup = (index, key, value) => {
        const newWeaponGroups = [...weaponGroups];
        newWeaponGroups[index][key] = value;
        setWeaponGroups(newWeaponGroups);
    }

    const renderWeaponGroups = () => {
        let retval: React.ReactNode[] = [];
        weaponGroups.forEach((element, index) => {
            retval.push(<WeaponGroup rowNum={index} key={index} updateWeaponGroup={updateWeaponGroup} weaponGroup={element}/>);
        
        })
        return retval;
    }

    const saveTrip = (e) => {
        e.preventDefault();
        let hasErrors = false;

        weaponGroups.forEach((weaponGroup) => {
            if (weaponGroup.gun_id == "" || weaponGroup.ammo_id == "" || weaponGroup.quantity_used < 1 || JSON.stringify(weaponGroup) === '{}') {
                setSuccessMessage("*** All fields except note are required ***");
                hasErrors = true;
                return;
            }
        });

        if (hasErrors) {
            return;
        }

        if (rangeTrip.location === "") {
            setSuccessMessage("*** Location is required ***");
            return;
        }

        const rangeTripToSave = { ...rangeTrip, weapon_groups: weaponGroups };
        setSuccessMessage("Saving.....");
        addRangeTrip(rangeTripToSave, (data) => {
            if (data.success) {
                setSuccessMessage("Range Trip added successfully!");
                if (formRef.current) {
                    (formRef.current as HTMLFormElement)?.reset();
                }
                setRangeTrip({ location: "" } as RangeTripType);
                setWeaponGroups([{}] as WeaponGroupType[]);

                setTimeout(() => {
                    setSuccessMessage("");
                }, 1500);
            } else {
                setSuccessMessage("Error adding some entries:\n" + data.error);
            }
        });
    }

    const updateRangeTrip = (field, value) => {
        setRangeTrip({...rangeTrip, [field]: value});
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="range-red.png" />Range Trip</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">

                {renderWeaponGroups()}

                <div className="text-center">
                    {weaponGroups.length > 1 && (
                        <button onClick={(e) => {
                            e.preventDefault();
                            const newWeaponGroups = [...weaponGroups];
                            newWeaponGroups.splice(newWeaponGroups.length-1);
                            setWeaponGroups(newWeaponGroups);
                        }} className="inline mx-4 rounded-3xl mt-8 tracking-wider bg-redbg drop-shadow-lg text-white py-2 px-4  block text-center">Remove Weapon Group</button>
                )}
                    
                    {weaponGroups.length < 6 && (
                        <button onClick={(e) => {
                            e.preventDefault();
                            const newWeaponGroups = [...weaponGroups];
                            newWeaponGroups.push({} as WeaponGroupType);
                            setWeaponGroups(newWeaponGroups);
                        }} className="inline mx-4 rounded-3xl mt-8 tracking-wider bg-redbg drop-shadow-lg text-white py-2 px-4  block text-center">Add Weapon Group</button>
                    )}
                </div>

                <label className="block my-2 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Location</div><div className="block w-full p-2 mx-auto"><div className="block w-full w-1/2 mx-auto">
                    <CreatableSelect styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" name="location" value={{label: rangeTrip.location, value: rangeTrip.location }} onChange={(e) => updateRangeTrip('location', e?.value)} options={rangeOptions} />    
                </div></div></label>
               
                <label className="block my-2 mx-auto"><div className="block text-sm block font-extralight tracking-wider">Note</div><div className="block w-full mx-auto"><div className="block w-full p-2 w-1/2 mx-auto"><textarea value={rangeTrip.note} onChange={(e) => updateRangeTrip('note', e.target.value)} name="note"></textarea></div></div></label>                
                <p className="mb-24">{successMessage}</p>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveTrip} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    );
}

export default RangeTrip;