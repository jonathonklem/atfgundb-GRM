import React, { useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import { GunContextType, Gun } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import customStyles from "../../customStyles";

const AddGun = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [calibers, setCalibers] = React.useState<string[]>([]);
    const { guns, addGun } = React.useContext(GunContext) as GunContextType;

    const [gun, setGun] = React.useState({} as Gun);
    const formRef = React.useRef(null);

    useEffect(() => {
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

    const updateGun = (field, value) => {
        setGun({...gun, [field]: value});
    }

    const saveGun = (e) => {
        e.preventDefault();

        if (gun.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (gun.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }

        setSuccessMessage("Adding.....");
        
        addGun(gun, (data) => {
            if (data.success) {
                setSuccessMessage("Added Gun Successfully!");
                if (formRef.current) {
                    (formRef.current as HTMLFormElement)?.reset();
                }
                setGun({} as Gun);
            } else {
                setSuccessMessage("Error adding gun");
            }
        });
        // clear form
        
    }
    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />Add Gun</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" value={gun.name} onChange={(e) => updateGun('name', e.target.value)}/></div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer"  value={gun.manufacturer} onChange={(e) => updateGun('manufacturer', e.target.value)}/></div></label>
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model"   value={gun.model} onChange={(e) => updateGun('model', e.target.value)}/></div></label>
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect name="caliber" styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" value={{label: gun.caliber, value: gun.caliber}} onChange={(e) => updateGun('caliber', e?.value)} options={caliberOptions} />
                </div></label>
                <label className="block my-2 mx-auto text-center mb-24"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcount" value={gun.roundcount ? gun.roundcount.toString() : ''} onChange={(e) => updateGun('roundcount', Number(e.target.value))}/></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveGun} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default AddGun;