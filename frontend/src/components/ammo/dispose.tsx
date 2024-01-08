import React from "react";
import {Ammo} from "../../Types";

const Dispose = (props) => {
    const url = props.Url;

    const [successMessage, setSuccessMessage] = React.useState('');
    const [ammo, setAmmo] = React.useState<Ammo[]>([]);
    const [ammoId, setAmmoId] = React.useState('');
    const [quantity, setQuantity] = React.useState(0);

    // fetch ammo from url and store in ammo state 
    React.useEffect(() => {
        fetchAmmo();
    }, []);

    function fetchAmmo() {
        fetch(`${url}/ammo?user_id=`+props.UserId,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
        .then((response) => response.json())
        .then((data) => setAmmo(data));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        fetch(`${url}/ammo/dispose?ammo_id=`+ammoId+`&quantity=`+quantity, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
            .then(response => response.json())
            .then(data => console.log(data));

        setSuccessMessage("Ammo Disposed Successfully!");
        // clear form
        form.reset();
    }
    
    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Dispose of Ammo</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="text-center pb-16">
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Ammo</div><div className="block w-full p-2 mx-auto">
                        <select name="ammo_id" onChange={e => setAmmoId(e.target.value)}>
                            <option>Choose</option>
                            {ammo.map((item: Ammo) => (
                                <option value={item?.ID?.toString()} >{item.name}</option>
                            ))}
                        </select>
                </div></label> 
                <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Quantity</div><div className="block w-full p-2 mx-auto"><input type="number" onChange={e=>setQuantity(parseInt(e.target.value))} name="quantity" /></div></label>
                <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto">Submit</button>
            </form>
        </>
    )
}

export default Dispose;