import React from "react";
import CreatableSelect from 'react-select/creatable';

import { GunContext } from "../contexts/gunContext";
import { GunContextType } from "../../Types";
import { UserDataContext } from "../contexts/userDataContext";
import { UserDataContextType } from "../../Types";
import { AmmoContext } from "../contexts/ammoContext";
import { AmmoContextType } from "../../Types";
import customStyles from "../../customStyles";


const AddAmmo = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [calibers, setCalibers] = React.useState<string[]>([]);
    
    const formRef = React.useRef(null);
    const [ammo, setAmmo] = React.useState({ name: "", caliber: "", grain: "" });
    
    const { guns } = React.useContext(GunContext) as GunContextType;
    const { userId } = React.useContext(UserDataContext) as UserDataContextType;
    const { addAmmo } = React.useContext(AmmoContext) as AmmoContextType;

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
    }, []);

    function saveAmmo(e) {
        e.preventDefault();

        setSuccessMessage("");

        if (ammo.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (ammo.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }
        setSuccessMessage("Adding.....");
        addAmmo(ammo, (response) => {
            if (response.success) {
                setSuccessMessage("Added Ammo Successfully!");

                if (formRef.current) {
                    (formRef.current as HTMLFormElement)?.reset();
                }

                setAmmo({ name: "", caliber: "", grain: "" });

                setTimeout(() => {
                    setSuccessMessage('');
                }, 1500);
            } else {
                setSuccessMessage("Error adding ammo");
            }
        });
    }

    const updateAmmo = (field, value) => {
        setAmmo({ ...ammo, [field]: value });
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/bullet-red.png" />Add Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" value={ammo.name} onChange={(e) => updateAmmo('name', e.target.value)} /></div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                <CreatableSelect styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" name="caliber" value={{label: ammo.caliber, value: ammo.caliber}} onChange={(e) => updateAmmo('caliber', e?.value)} options={caliberOptions} />    
                </div></label>
                <label className="block my-2 mx-auto mb-24"><div className="block text-sm font-extralight tracking-wider">Grain</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="grain" value={ammo.grain} onChange={(e) => updateAmmo('grain', e.target.value)} /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveAmmo} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default AddAmmo;