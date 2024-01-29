import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable'; // Import GroupBase from react-select
import ValueType from "react-select";
import { Gun, GunContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";

const EditGun = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string; options?: readonly string[] }>>([]); // Update the type of caliberOptions
    const [calibers, setCalibers] = React.useState<string[]>([]);
    const [gun, setGun] = React.useState<Gun>({} as Gun);
    const [currentCaliber, setCurrentCaliber] = React.useState<any>('');
    let { id } = useParams();

    const { guns, editGun } = React.useContext(GunContext) as GunContextType;

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
                setCurrentCaliber(gun.caliber);
            }
        });
    }, []);

    function changeCaliber(value) {
        let newGun = gun;
        newGun.caliber = value; // if we use value.value, there's an error...  soemhow need to parse this at handleSumbit I guess
        console.log(newGun);
        setGun(newGun);
        setCurrentCaliber(value.value);
    }
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.roundcount =  Number(formJson.roundcountstring);
        clearObject.caliber = currentCaliber;

        if (clearObject.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (clearObject.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }

        setSuccessMessage("Saving.....");
        
        editGun(id as string, clearObject, () => {setSuccessMessage("Saved Gun Successfully!");form.reset();});
        // clear form
        
    }
    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Add Gun</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" value={gun.name}/></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" value={gun.manufacturer} /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" value={gun.model} /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect name="caliber" className="text-neutral-700 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md;" value={{label: currentCaliber, value: currentCaliber}} onChange={(e) => changeCaliber(e)}  options={caliberOptions} />
                </div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcountstring"  value={String(gun.roundcount)}/></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default EditGun;