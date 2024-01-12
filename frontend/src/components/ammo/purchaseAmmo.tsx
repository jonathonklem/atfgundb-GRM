import React from "react";
import {Ammo} from "../../Types";

const PurchaseAmmo = (props) => {
    const url = props.Url;
    const [successMessage, setSuccessMessage] = React.useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.quantity =  Number(formJson.quantity);
        clearObject.price =  Number(formJson.price);

        setSuccessMessage("Saving.....");
        props.PurchaseAmmo(clearObject, () => {setSuccessMessage("Purchased Ammo Successfully!");form.reset();});
    }

    if (props.Ammo.length === 0) {
        return (<div>No ammo types to purchase yet.  Add ammo first.</div>)
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Purchase Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id">
                            <option>Choose</option>
                            {props.Ammo.map((item: Ammo) => (
                                <option value={item?.ID?.toString()}>{item.name}</option>
                            ))}
                        </select>
                    </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Price</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="price" /></div></label>
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Quantity</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="quantity" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )

}

export default PurchaseAmmo;