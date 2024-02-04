import React from "react";
import {Ammo} from "../../Types";
import {AmmoPurchaseContext} from "../contexts/ammoPurchaseContext";
import {AmmoPurchaseContextType} from "../../Types";
import {AmmoContext} from "../contexts/ammoContext";
import {AmmoContextType} from "../../Types";

const PurchaseAmmo = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [calculateCpr, setCalculateCpr] = React.useState(false);
    const [costPerRound, setCostPerRound] = React.useState(0);
    const [costOfPurchase, setCostOfPurchase] = React.useState(0);

    const { purchaseAmmo } = React.useContext(AmmoPurchaseContext) as AmmoPurchaseContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.quantity =  Number(formJson.quantity);

        if (calculateCpr) {
            clearObject.price =  Math.round((Number(costOfPurchase)/clearObject.quantity)*100)/100;
        } else {
            clearObject.price =  Number(costPerRound);
        }

        setSuccessMessage("Saving.....");
        purchaseAmmo(clearObject, (data) => {
            if (data.success) {
                setSuccessMessage("Purchased Ammo Successfully!");
                form.reset();
            } else {
                setSuccessMessage("Error purchasing ammo");
            }
        });
    }

    if (ammo.length === 0) {
        return (<div>No ammo types to purchase yet.  Add ammo first.</div>)
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/bullet-red.png" />Purchase Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id">
                            <option>Choose</option>
                            {ammo.map((item: Ammo) => (
                                <option value={item?.ID?.toString()}>{item.name}</option>
                            ))}
                        </select>
                    </div></label> 
                {calculateCpr && (
                    <>
                        <label className="block my-2 mx-auto">
                            <div className="block text-sm font-extralight tracking-wider">Cost of Purchase</div>
                            <div className="block w-full p-2 w-1/2 mx-auto"><input onChange={(e) => setCostOfPurchase(parseFloat(e.target.value))} type="number" name="price" /></div>
                        </label>
                        <button onClick={(e) => setCalculateCpr(false)} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Switch to Cost Per Round</button>
                    </>
                )}
                {!calculateCpr && (
                    <>
                        <label className="block my-2 mx-auto">
                            <div className="block text-sm font-extralight tracking-wider">Cost Per Round</div>
                            <div className="block w-full p-2 w-1/2 mx-auto"><input onChange={(e) => setCostPerRound(parseFloat(e.target.value)) } type="number" name="price" /></div>
                        </label>
                        <button onClick={(e) => setCalculateCpr(true)} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Switch to Total Cost of Purchase</button>
                    </>
                )}
                <label className="block my-2 mx-auto mb-24"><div className="block text-sm font-extralight tracking-wider">Quantity</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="quantity" /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )

}

export default PurchaseAmmo;