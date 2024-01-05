import React from "react";
import { Link } from "react-router-dom";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const AddGun = (props) => {
    
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());
        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.roundcount =  Number(formJson.roundcountstring);

        // post formJson to our env var url
        fetch(`${url}/guns/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(clearObject)
        })
            .then(response => response.json())
            .then(data => console.log(data));

        // clear form
        form.reset();
        // this is just plain old json, work to feed it to Go
        console.log(formJson);
    }
    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Add Gun</h1>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" /></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="caliber" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcountstring" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default AddGun;