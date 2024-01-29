import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {Ammo} from "../../Types";
import { AmmoContext } from "../contexts/ammoContext";
import { AmmoContextType } from "../../Types";

const ViewAmmo = (props) => {
    const [subjectAmmo, setSubjectAmmo] = useState<Ammo>({} as Ammo);
    const [clickDelete, setClickDelete] = useState<boolean>(false);
    const [confirmText, setConfirmText] = useState<string>('');

    const { ammo, removeAmmo } = React.useContext(AmmoContext) as AmmoContextType;

    const navigate = useNavigate();

    let { id } = useParams();

    useEffect(() => {
        ammo.map((ammo) => {
            if (ammo.ID === id) {
                console.log(ammo)
                setSubjectAmmo(ammo);
            }
        });
    }, []);

    function handleRemove() {
        if (!confirmText) {
            setClickDelete(true);
        }

        if (confirmText === "Delete") {
            removeAmmo(String(id));
            navigate("/")
        }
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">{subjectAmmo.name}</h1>
            <table className="mx-auto mb-16">
                <tbody>
                    <tr>
                        <td>Amount On Hand</td><td>{String(subjectAmmo.amount)}</td>
                    </tr>
                    <tr>
                        <td>Grain</td><td>{subjectAmmo.grain}</td>
                    </tr>
                    <tr>
                        <td>Average Price</td><td>{subjectAmmo.average_price?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Last Price</td><td>{subjectAmmo.last_price?.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <Link to={`/ammo/edit/`+subjectAmmo.ID} className="block rounded-md bg-red-800 text-xs text-slate-50 py-1 px-4 w-20 block mb-8 text-center mx-auto">Edit</Link>

            { clickDelete ? <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Type Delete to Confirm And Click Again</div><div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div></label> 
 : null}
            <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 mb-20 text-center mx-auto" onClick={handleRemove}>Delete</button>

        </>
    );
}

export default ViewAmmo;