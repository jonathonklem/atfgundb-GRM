import React from "react";
import { UserDataContext } from "../contexts/userDataContext";
import { UserDataContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import { GunContextType, Accessory as AccessoryType } from "../../Types";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Accessory = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [gunId, setGunId] = React.useState('');
    const { authToken } = React.useContext(UserDataContext) as UserDataContextType;
    const { guns, fetchGuns } = React.useContext(GunContext) as GunContextType;
    const [accessory, setAccessory] = React.useState({} as AccessoryType);
    const formRef = React.useRef(null);

    const addAccessory = (gunId, formJson, callback) => {
        // post formJson to our env var url
        fetch(url+ '/guns/addAccessory?gun_id='+gunId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }, 
            body: JSON.stringify(formJson)
        })
            .then(response => response.json())
            .then(callback());
    }

    const saveAccessory = (e) => {
        e.preventDefault();

        if (gunId === "") {
            setSuccessMessage("*** Gun is required ***");
            return;
        }

        if (accessory.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }
        
        setSuccessMessage("Adding.....")
        addAccessory(gunId, accessory, () => {
            setSuccessMessage("Accessory added successfully!");
            fetchGuns();
            if (formRef.current) {
                (formRef.current as HTMLFormElement)?.reset();
            }
        });
    }

    const updateAccessory = (field, value) => {
        setAccessory({...accessory, [field]: value});
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/scope-red.png" />Add Accessory</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Gun</div><div className="block w-full p-2 mx-auto">
                    <select name="gun_id" onChange={e => {setGunId(e.target.value)}}>
                        <option>Choose</option>
                        {guns.map((gun) => (
                            <option value={gun.ID}>{gun.name}</option>
                        ))}
                    </select>
                </div></label> 
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" className="drop-shadow-lg" name="name" value={accessory.name} onChange={(e) => updateAccessory('name', e.target.value)}/></div></label>
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" className="drop-shadow-lg" name="manufacturer" value={accessory.manufacturer} onChange={(e) => updateAccessory('manufacturer', e.target.value)}/></div></label>
                <label className="block my-2 mx-auto mb-24"><div className="block text-sm font-extralight tracking-wider">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" className="drop-shadow-lg" name="model" value={accessory.model} onChange={(e) => updateAccessory('model', e.target.value)} /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveAccessory} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Accessory;