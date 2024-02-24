import React from "react";
import {Ammo} from "../../Types";

import { AmmoContext } from "../contexts/ammoContext";
import { AmmoContextType } from "../../Types";

const Dispose = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [ammoId, setAmmoId] = React.useState('');
    const [quantity, setQuantity] = React.useState(0);

    const formRef = React.useRef(null);

    const { disposeAmmo, ammo } = React.useContext(AmmoContext) as AmmoContextType;

    const saveDispose = (e) => {
        e.preventDefault();

        setSuccessMessage("Disposing.....")
        disposeAmmo(ammoId, quantity, (data) => {
            if (data.success) {
                setSuccessMessage("Ammo Disposed Successfully!");
                if (formRef.current) {
                    (formRef.current as HTMLFormElement)?.reset();
                }

                setAmmoId('');
                setQuantity(0);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 1500);
            } else {
                setSuccessMessage("Error disposing ammo");
            }
        });
    }
    
    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/bullet-red.png" />Dispose Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form ref={formRef} className="px-4 pb-16">
                <label className="block my-2 mx-auto"><div className="block text-sm font-extralight tracking-wider">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id" onChange={e => setAmmoId(e.target.value)}>
                            <option>Choose</option>
                            {ammo.map((item: Ammo) => (
                                <option value={item?.ID?.toString()} >{item.name}</option>
                            ))}
                        </select>
                </div></label> 
                <label className="block my-2 mx-auto mb-24 text-center"><div className="block text-sm font-extralight tracking-wider">Quantity</div><div className="block w-full p-2 mx-auto"><input type="number" onChange={e=>setQuantity(parseInt(e.target.value))} name="quantity" /></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button onClick={saveDispose} className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Dispose;