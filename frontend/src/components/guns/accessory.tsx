import React from "react";
import {Gun} from "../../Types";

const Accessory = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [gunId, setGunId] = React.useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        setSuccessMessage("Adding.....")
        props.AddAccessory(gunId, formJson, () => {
            setSuccessMessage("Accessory added successfully!");
            form.reset();
        });
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Accessories</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Gun</div><div className="block w-full p-2 mx-auto">
                    <select name="gun_id" onChange={e => {setGunId(e.target.value)}}>
                        <option>Choose</option>
                        {props.Guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="name" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default Accessory;