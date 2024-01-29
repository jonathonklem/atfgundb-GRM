import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GunContext } from "../contexts/gunContext";

import {Gun, GunContextType} from "../../Types";


const ViewGun = (props) => {
    const [gun, setGun] = useState<Gun>({} as Gun);
    const [clickDelete, setClickDelete] = useState<boolean>(false);
    const [confirmText, setConfirmText] = useState<string>('');
    const { guns, removeGun } = React.useContext(GunContext) as GunContextType;

    const navigate = useNavigate();

    let { id } = useParams();

    useEffect(() => {
        guns.map((gun) => {
            if (gun.ID === id) {
                setGun(gun);
            }
        });
    }, []);

    function handleRemove() {
        if (!confirmText) {
            setClickDelete(true);
        }

        if (confirmText === "Delete") {
            removeGun(String(id));
            navigate("/")
        }
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">{gun.name}</h1>
            <table className="mx-auto mb-16">
                <tbody>
                    <tr>
                        <td>Manufacturer</td><td>{gun.manufacturer}</td>
                    </tr>
                    <tr>
                        <td>Model</td><td>{gun.model}</td>
                    </tr>
                    <tr>
                        <td>Caliber</td><td>{gun.caliber}</td>
                    </tr>
                    <tr>
                        <td>Round Count</td><td>{String(gun.roundcount)}</td>
                    </tr>
                </tbody>
            </table>

            {gun.accessories?.length > 0 &&     
                <>
                    <h1 className="text-center block mx-auto ps-4 w-1/2 font-bold text-xl py-2 bg-red-800 text-slate-50">Accessories</h1>
                    <table className="mx-auto mb-16">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Manufacturer</th>
                                <th>Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gun.accessories?.map((accessory) => (
                                <tr>
                                    <td>{accessory.name}</td>
                                    <td>{accessory.manufacturer}</td>
                                    <td>{accessory.model}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
            {gun.maintenance?.length > 0 &&
                <>
                    <h1 className="text-center block mx-auto px-4 w-1/2 font-bold text-xl py-2 bg-red-800 text-slate-50">Maintenance</h1>
                    <table className="mx-auto mb-16">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gun.maintenance?.map((maintenance) => (
                                <tr>
                                    <td>{new Date(maintenance.date_done).toLocaleDateString("en-US")}</td>
                                    <td>{maintenance.maintenance_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
            { clickDelete ? <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Type Delete to Confirm And Click Again</div><div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div></label> 
 : null}
            <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 mb-20 text-center mx-auto" onClick={handleRemove}>Delete</button>

        </>
    )

}

export default ViewGun;