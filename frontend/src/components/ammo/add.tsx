import React from "react";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const AddAmmo = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.amount =  Number(formJson.count);

        // post formJson to our env var url
        fetch(`${url}/ammo/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data));
        setSuccessMessage("Added Ammo Successfully!");
        // clear form
        form.reset();
    }
    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Add Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" /></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="caliber" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Grain</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="grain" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default AddAmmo;