import React from "react";
import CreatableSelect from 'react-select/creatable';
import OptionsType from "react-select";
import ValueType from "react-select";

const AddAmmo = (props) => {
    const url = props.Url;

    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string }>>([]);
    const [calibers, setCalibers] = React.useState<string[]>([]);

    React.useEffect(() => {
        props.Guns.map((gun) => {
            if (calibers.indexOf(gun.caliber) === -1) {
                caliberOptions.push({ label: gun.caliber, value: gun.caliber });
                // remove duplicates from calibers
                setCaliberOptions(caliberOptions);
                
                calibers.push(gun.caliber);
                setCalibers(calibers)
            }
                
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.amount =  Number(formJson.count);

        setSuccessMessage("Adding.....");
        props.AddAmmo(clearObject, () => {setSuccessMessage("Added Ammo Successfully!");form.reset();});
    }
    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Add Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" /></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                <CreatableSelect className="text-neutral-700 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md;" name="caliber" options={caliberOptions} />    
                </div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Grain</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="grain" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default AddAmmo;