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
    const { guns, fetchGuns } = React.useContext(GunContext) as GunContextType;

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
        addMaintenance(gunId, formJson, () => {fetchGuns(); setSuccessMessage("Maintenance added successfully!"); form.reset();});
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/tool-red.png" />Maintenance</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Gun</div><div className="block w-full p-2 mx-auto">
                    <select name="gun_id" onChange={e => {setGunId(e.target.value)}}>
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block text-sm font-extralight tracking-wider">Maintenance Type</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="maintenance_type" /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    );
}

export default Maintenance;