import React, { useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import { GunContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import customStyles from "../../customStyles";

const AddGun = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [calibers, setCalibers] = React.useState<string[]>([]);
    const { guns, addGun } = React.useContext(GunContext) as GunContextType;

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
        console.log(calibers)
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.roundcount =  Number(formJson.roundcountstring);

        if (clearObject.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (clearObject.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }

        setSuccessMessage("Adding.....");
        
        addGun(clearObject, () => {setSuccessMessage("Added Gun Successfully!");form.reset();});
        // clear form
        
    }
    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />Add Gun</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" /></div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" /></div></label>
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" /></div></label>
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect name="caliber" styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" options={caliberOptions} />
                </div></label>
                <label className="block my-2 mx-auto text-center mb-24"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcountstring" /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default AddGun;