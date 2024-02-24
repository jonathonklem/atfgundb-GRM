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

    const handleRemove = () => {
        if (!confirmText) {
            setClickDelete(true);
        }

        if (confirmText === "Delete") {
            removeAmmo(String(id), (data) => {
                if (data.success) {
                    navigate("/")
                } else {
                    alert('Error deleting ammo')
                }
            });
            
        }
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />{subjectAmmo.name}</h1>
            <table className="mx-auto mb-4 font-light text-sm tracking-wider">
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
            <Link to={`/ammo/edit/`+subjectAmmo.ID} className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 w-16 block text-center mx-auto">Edit</Link>

            { clickDelete ? <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Type Delete to Confirm And Click Again</div><div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div></label> 
 : null}
            <button className="rounded-3xl mt-16 mb-24 tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto" onClick={handleRemove}>Delete</button>

        </>
    );
}

export default ViewAmmo;