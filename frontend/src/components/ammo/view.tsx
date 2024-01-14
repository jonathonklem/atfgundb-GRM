import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {Ammo} from "../../Types";

const ViewAmmo = (props) => {
    const [ammo, setAmmo] = useState<Ammo>({} as Ammo);
    const [clickDelete, setClickDelete] = useState<boolean>(false);
    const [confirmText, setConfirmText] = useState<string>('');

    const navigate = useNavigate();

    let { id } = useParams();

    useEffect(() => {
        props.Ammo.map((ammo) => {
            if (ammo.ID === id) {
                console.log(ammo)
                setAmmo(ammo);
            }
        });
    }, []);

    function handleRemove() {
        if (!confirmText) {
            setClickDelete(true);
        }

        if (confirmText === "Delete") {
            props.RemoveAmmo(id);
            navigate("/")
        }
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">{ammo.name}</h1>
            <table className="mx-auto mb-16">
                <tbody>
                    <tr>
                        <td>Amount On Hand</td><td>{String(ammo.amount)}</td>
                    </tr>
                    <tr>
                        <td>Grain</td><td>{ammo.grain}</td>
                    </tr>
                    <tr>
                        <td>Average Price</td><td>{ammo.average_price?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Last Price</td><td>{ammo.last_price?.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            { clickDelete ? <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Type Delete to Confirm And Click Again</div><div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div></label> 
 : null}
            <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 mb-20 text-center mx-auto" onClick={handleRemove}>Delete</button>

        </>
    );
}

export default ViewAmmo;