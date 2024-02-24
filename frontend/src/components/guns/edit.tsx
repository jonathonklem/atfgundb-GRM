import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable'; // Import GroupBase from react-select
import ValueType from "react-select";
import { Gun, GunContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import customStyles from "../../customStyles";


const EditGun = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string; options?: readonly string[] }>>([]); // Update the type of caliberOptions
    const [calibers, setCalibers] = React.useState<string[]>([]);
    let { id } = useParams();

    const { guns, editGun } = React.useContext(GunContext) as GunContextType;

    const [gun, setGun] = React.useState({} as Gun);

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

        guns.filter((gun) => {
            if (gun.ID === id) {
                setGun(gun);
            }
        });
    }, []);
    
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

        setSuccessMessage("Saving.....");
        
        editGun(id as string, gun, (data) => {
            if (data.success) {
                setSuccessMessage("Saved Gun Successfully!");
            } else {
                setSuccessMessage("Error saving gun");
            }
        });
        // clear form
        
    }

    const updateGun = (field, value) => {
        setGun({...gun, [field]: value});
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />Edit Gun</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form className="px-4 pb-16">
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" onChange={(e) => updateGun('name', e.target.value)} value={gun.name}/></div></label> 
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" onChange={(e) => updateGun('manufacturer', e.target.value)} value={gun.manufacturer} /></div></label>
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" onChange={(e) => updateGun('model', e.target.value) } value={gun.model} /></div></label>
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect name="caliber" styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" value={{label: gun.caliber, value: gun.caliber}} onChange={(e) => updateGun('caliber', e?.value)}  options={caliberOptions} />
                </div></label>
                <label className="block my-2 mx-auto text-center mb-24"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcountstring" onChange={(e) => updateGun('roundcount', e.target.value) } value={gun.roundcount ? gun.roundcount.toString() : ""}/></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveGun} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default EditGun;