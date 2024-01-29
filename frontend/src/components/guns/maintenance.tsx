import React from "react";
import { UserDataContext } from "../contexts/userDataContext";
import { UserDataContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import { GunContextType } from "../../Types";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Maintenance = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [gunId, setGunId] = React.useState('');
    const { authToken } = React.useContext(UserDataContext) as UserDataContextType;
    const { guns } = React.useContext(GunContext) as GunContextType;

    function addMaintenance(gunId, formJson, callback) {
        // post formJson to our env var url
        fetch(url + '/guns/addMaintenance?gun_id='+gunId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }, 
            body: JSON.stringify(formJson)
        })
            .then(response => response.json())
            .then(data => console.log(data)).then(() => callback());
    }

    function handleSubmit(e)  {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        if (formJson.maintenance_type === "" || formJson.gun_id === "") {
            setSuccessMessage("*** All fields are required ***");
            return;
        }
        setSuccessMessage("Adding.....");
        addMaintenance(gunId, formJson, () => {setSuccessMessage("Maintenance added successfully!"); form.reset();});
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Maintenance</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Gun</div><div className="block w-full p-2 mx-auto">
                    <select name="gun_id" onChange={e => {setGunId(e.target.value)}}>
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Maintenance Type</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="maintenance_type" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    );
}

export default Maintenance;