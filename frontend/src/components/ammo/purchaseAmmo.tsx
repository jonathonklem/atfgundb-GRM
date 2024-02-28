import React from "react";
import {Ammo} from "../../Types";
import {AmmoPurchaseContext} from "../contexts/ammoPurchaseContext";
import {AmmoPurchaseContextType} from "../../Types";
import {AmmoContext} from "../contexts/ammoContext";
import {AmmoContextType, AmmoPurchase} from "../../Types";

const PurchaseAmmo = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [calculateCpr, setCalculateCpr] = React.useState(false);
    const formRef = React.useRef(null);

    const { purchaseAmmo } = React.useContext(AmmoPurchaseContext) as AmmoPurchaseContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    const [ammoPurchase, setAmmoPurchase] = React.useState({
        ammo_id: 0,
        price: 0,
        quantity: 0,
    } as AmmoPurchase);

    const savePurchase = (e) => {
        e.preventDefault();

        const purchaseToSave = {...ammoPurchase};
        if (calculateCpr) {
            purchaseToSave.price = Math.round((Number(ammoPurchase.cost)/Number(ammoPurchase.quantity))*100)/100;
        }

        setSuccessMessage("Saving.....");
        purchaseAmmo(purchaseToSave, (data) => {
            if (data.success) {
                setSuccessMessage("Purchased Ammo Successfully!");
                if (formRef.current) {
                    (formRef.current as HTMLFormElement)?.reset();
                }
            } else {
                setSuccessMessage("Error purchasing ammo");
            }
        });
    }

    const updateAmmoPurchase = (field, value) => {
        setAmmoPurchase({...ammoPurchase, [field]: value});
    }

    if (ammo.length === 0) {
        return (<div>No ammo types to purchase yet.  Add ammo first.</div>)
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/bullet-red.png" />Purchase Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select value={ammoPurchase.ammo_id} onChange={(e) => updateAmmoPurchase('ammo_id', e.target.value)} name="ammo_id">
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
                            <div className="block w-full p-2 w-1/2 mx-auto"><input onChange={(e) => updateAmmoPurchase('cost', parseFloat(e.target.value))} step="0.01"  type="number" name="price" /></div>
                        </label>
                        <button onClick={(e) => setCalculateCpr(false)} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Switch to Cost Per Round</button>
                    </>
                )}
                {!calculateCpr && (
                    <>
                        <label className="block my-2 mx-auto">
                            <div className="block text-sm font-extralight tracking-wider">Cost Per Round</div>
                            <div className="block w-full p-2 w-1/2 mx-auto"><input onChange={(e) => updateAmmoPurchase('price', parseFloat(e.target.value)) } step="0.01" type="number" name="price" /></div>
                        </label>
                        <button onClick={(e) => setCalculateCpr(true)} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 block text-center mx-auto">Switch to Total Cost of Purchase</button>
                    </>
                )}
                <label className="block my-2 mx-auto mb-24"><div className="block text-sm font-extralight tracking-wider">Quantity</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" value={ammoPurchase.quantity ? ammoPurchase.quantity : ""} onChange={(e) => updateAmmoPurchase('quantity', Number(e.target.value))} name="quantity" /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={savePurchase} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )

}

export default PurchaseAmmo;