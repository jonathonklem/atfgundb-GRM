import React from "react";
import {Gun} from "../../Types";

const Accessory = (props) => {
    const [guns, setGuns] = React.useState<Gun[]>([]);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [gunId, setGunId] = React.useState('');

    React.useEffect(() => {
        fetchGuns();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // post formJson to our env var url
        fetch(props.Url + '/guns/addAccessory?gun_id='+gunId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(formJson)
        })
            .then(response => response.json())
            .then(data => console.log(data));

        setSuccessMessage("Accessory added successfully!");
        // clear form
        form.reset();
    }

    function fetchGuns() {
        fetch(props.Url+'/guns?user_id='+props.UserId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
            .then(response => response.json())
            .then(data => setGuns(data));
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Accessories</h1>
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
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="name" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default Accessory;