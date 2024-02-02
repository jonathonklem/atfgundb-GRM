import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable'; // Import GroupBase from react-select
import { Ammo, AmmoContextType } from "../../Types";
import { AmmoContext } from "../contexts/ammoContext";
import { GunContext } from "../contexts/gunContext";
import { GunContextType } from "../../Types";
import customStyles from "../../customStyles";

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
        editAmmo(id as string, clearObject, (data) => {
            if (data.success) {
                setSuccessMessage("Added Ammo Successfully!");
                form.reset();
            } else {
                setSuccessMessage("Error adding ammo");
            }
        });
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/bullet-red.png" />Edit Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" value={ammoName} onChange={(e) => setAmmoName(e.target.value) } /></div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                <CreatableSelect styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" name="caliber" value={{label: currentCaliber, value: currentCaliber}} onChange={(e) => changeCaliber(e)}  options={caliberOptions} />    
                </div></label>
                <label className="block my-2 mx-auto mb-24"><div className="block text-sm font-extralight tracking-wider">Grain</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="grain" value={ammoGrain} onChange={(e) => setAmmoGrain(e.target.value) } /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default EditAmmo;