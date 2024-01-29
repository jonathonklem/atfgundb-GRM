import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable'; // Import GroupBase from react-select
import { Ammo, AmmoContextType } from "../../Types";
import { AmmoContext } from "../contexts/ammoContext";
import { GunContext } from "../contexts/gunContext";
import { GunContextType } from "../../Types";

const EditAmmo = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [calibers, setCalibers] = React.useState<string[]>([]);
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [currentCaliber, setCurrentCaliber] = React.useState<any>('');
    const [subjectAmmo, setSubjectAmmo] = React.useState<Ammo>({} as Ammo); // this is the ammo we're editing

    const [ammoName, setAmmoName] = React.useState<string>('');
    const [ammoGrain, setAmmoGrain] = React.useState<string>('');

    const { guns } = React.useContext(GunContext) as GunContextType;
    const { ammo, editAmmo } = React.useContext(AmmoContext) as AmmoContextType;
    let { id } = useParams();

    React.useEffect(() => {
        guns.map((gun) => {
            if (calibers.indexOf(gun.caliber) === -1) {
                caliberOptions.push({ label: gun.caliber, value: gun.caliber });
                // remove duplicates from calibers
                setCaliberOptions(caliberOptions);
                
                calibers.push(gun.caliber);
                setCalibers(calibers)
            }
                
        });

        ammo.map((item) => {
            if (item.ID === id) {
                setSubjectAmmo(item);

                setCurrentCaliber(item.caliber);
                setAmmoName(item.name);
                setAmmoGrain(item.grain);
            }
        })
    }, []);

    function changeCaliber(value) {
        let newAmmo = subjectAmmo;
        newAmmo.caliber = value; // if we use value.value, there's an error...  soemhow need to parse this at handleSumbit I guess
        setSubjectAmmo(newAmmo);
        setCurrentCaliber(value.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSuccessMessage("");

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        // clearObject.user_id = userId;
        clearObject.amount =  Number(formJson.count);

        if (clearObject.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (clearObject.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }
        setSuccessMessage("Adding.....");
        editAmmo(id as string, clearObject, () => {setSuccessMessage("Added Ammo Successfully!");form.reset();});
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Edit Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" value={ammoName} onChange={(e) => setAmmoName(e.target.value) } /></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                <CreatableSelect className="text-neutral-700 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md;" name="caliber" value={{label: currentCaliber, value: currentCaliber}} onChange={(e) => changeCaliber(e)}  options={caliberOptions} />    
                </div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Grain</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="grain" value={ammoGrain} onChange={(e) => setAmmoGrain(e.target.value) } /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default EditAmmo;