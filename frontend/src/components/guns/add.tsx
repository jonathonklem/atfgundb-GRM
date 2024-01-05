import React from "react";
import { Link } from "react-router-dom";

const AddGun = (props) => {
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());
        // this is just plain old json, work to feed it to Go
        console.log(formJson);
    }
    return (
        <>
            <Link className="bg-red-800 text-slate-50 py-2 px-4 w-2/12 block my-2 text-center mx-auto" to="/guns">Back</Link>
            <form onSubmit={handleSubmit} className="text-center">
                <label className="block my-2 mx-auto text-center">
                    <div className="block w-1/3 mx-auto">Name</div><div className="block w-1/2 mx-auto"><input type="text" className="text-neutral-700 p-1" name="name" /></div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Manufacturer</div><div className="block w-1/2 mx-auto"><input type="text" className="text-neutral-700 p-1" name="manufacturer" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Model</div><div className="block w-1/2 mx-auto"><input type="text" className="text-neutral-700 p-1" name="model" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Caliber</div><div className="block w-1/2 mx-auto"><input type="text" className="text-neutral-700 p-1" name="caliber" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-1/2 mx-auto"><input type="text" className="text-neutral-700 p-1" name="round_count" /></div></label>
                <button className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default AddGun;