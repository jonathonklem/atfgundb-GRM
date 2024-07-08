import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GunContext } from "../contexts/gunContext";
import { AmmoContext } from "../contexts/ammoContext";
import { RangeTripContext } from "../contexts/rangeTripContext";
import { RangeTripType, RangeTripContextType, AmmoContextType } from "../../Types";
import {Gun, GunContextType} from "../../Types";

interface AmmoList {
    name: string,
    amount: number,
}

const ViewGun = (props) => {
    const [gun, setGun] = useState<Gun>({} as Gun);
    const [clickDelete, setClickDelete] = useState<boolean>(false);
    const [confirmText, setConfirmText] = useState<string>('');
    const [gunRangeTrips, setGunRangeTrips] = useState<RangeTripType[]>([]);
    const [currentFilter, setCurrentFilter] = useState<number>(5);
    const [consumedAmmo, setConsumedAmmo] = useState<AmmoList[]>([]);

    const { guns, removeGun } = React.useContext(GunContext) as GunContextType;
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;
    const { rangeTrips } = React.useContext(RangeTripContext) as RangeTripContextType;

    const navigate = useNavigate();

    let { id } = useParams();

    const dateFormat = (date: Date) => {
        date.getMonth()
        var month = date.getMonth()+1;
        var day   = date.getDate().toString().padStart(2,'0');
        var year  = date.getFullYear().toString().substr(-2);


        return month + "/" + day + "/" + year;
    }

    const showAllTrips = () => {
        setCurrentFilter(gunRangeTrips.length);
    }

    useEffect(() => {
        guns.map((gun) => {
            if (gun.ID === id) {
                setGun(gun);
            }
        });

        const tempAmmoMap = {} as any;
        rangeTrips.filter((rangeTrip) => {
            if (rangeTrip.gun_id === id) {
                setGunRangeTrips(gunRangeTrips => [rangeTrip, ...gunRangeTrips]);

                if (!tempAmmoMap[rangeTrip.ammo_id]) {
                    tempAmmoMap[rangeTrip.ammo_id] = rangeTrip.quantity_used;
                } else {
                    tempAmmoMap[rangeTrip.ammo_id] += rangeTrip.quantity_used;
                }
            }
        });

        const tempAmmoArray = [] as AmmoList[];
        Object.keys(tempAmmoMap).map((ammoId) => {
            ammo.map((ammoElement) => {
                if (ammoElement.ID === ammoId) {
                    tempAmmoArray.push(
                        {
                            name: ammoElement.name,
                            amount: tempAmmoMap[ammoId]
                        }
                    );
                }
            });
        });

        setConsumedAmmo(tempAmmoArray);
    }, []);

    const handleRemove = () => {
        if (!confirmText) {
            setClickDelete(true);
        }

        if (confirmText === "Delete") {
            removeGun(String(id), (data) => {
                if (data.success) {
                    navigate("/");
                } else {
                    alert('Error deleting gun')
                }
            });
        }
    }

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />{gun.name}</h1>
            <table className="mx-auto mb-8 font-light text-sm tracking-wider">
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
            <Link to={`/guns/edit/`+gun.ID} className="mb-4 rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 w-16 block text-center mx-auto">Edit</Link>

            {consumedAmmo.length > 0 && (
                <>
                    <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left"  src="/pie-chart-red.png" />Consumed Ammo</h1>
                    <table className="mx-auto mb-4 font-light text-sm tracking-wider">
                        <thead>
                            <tr>
                                <th className="text-left">Type</th>
                                <th className="text-right">Rounds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumedAmmo.map((ammo) => (
                                <tr>
                                    <td className="text-left">{ammo.name}</td>
                                    <td className="text-right">{String(ammo.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            
            {gunRangeTrips.length > 0 && (
                <>
                    <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/range-red.png" />Recent Range Trips</h1>
                    <table className="mx-auto mb-8 font-light text-sm tracking-wider">
                        <thead>
                            <tr>
                                <th className="text-left">Date</th>
                                <th className="text-left">Loc.</th>
                                <th className="text-right">Rnds</th>
                                <th>&nbsp;</th>
                                <th className="text-left">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gunRangeTrips.filter((element, index) => index < currentFilter).map((rangeTrip) => (
                                <tr key={String(rangeTrip.ID)}>
                                    <td className="text-left">{dateFormat(new Date(rangeTrip.date_done))}</td>
                                    <td className="text-left">{rangeTrip.location}</td>
                                    <td className="text-right">{String(rangeTrip.quantity_used)}</td>
                                    <td>&nbsp;</td>
                                    <td className="text-left">{rangeTrip.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {currentFilter < gunRangeTrips.length && (
                        <>
                            <button className="rounded-3xl tracking-wider text-xs mt-4 bg-redbg drop-shadow-lg text-white py-1 px-2 w-1/8 block text-center mx-auto" onClick={(e) => {e.preventDefault(); showAllTrips()}} > Show All </button>
                        </>
                    )}
                        
                </>
            )}
            {gun.accessories?.length > 0 &&     
                <>
                    <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/scope-red.png" />Accessories</h1>
                    <table className="mx-auto mb-8 font-light text-sm tracking-wider">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Manufacturer</th>
                                <th className="text-left">Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gun.accessories?.map((accessory) => (
                                <tr>
                                    <td className="text-left">{accessory.name}</td>
                                    <td className="text-left">{accessory.manufacturer}</td>
                                    <td className="text-left">{accessory.model}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
            {gun.maintenance?.length > 0 &&
                <>
                    <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/tool-red.png" />Maintenance</h1>
                    <table className="mx-auto mb-16 font-light text-sm tracking-wider">
                        <thead>
                            <tr>
                                <th className="text-left">Date</th>
                                <th className="text-left">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gun.maintenance?.map((maintenance) => (
                                <tr>
                                    <td className="text-left">{new Date(maintenance.date_done).toLocaleDateString("en-US")}</td>
                                    <td className="text-left">{maintenance.maintenance_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
            { clickDelete ? <label className="block my-2 mx-auto text-center"><div className="block w-1/3 mx-auto">Type Delete to Confirm And Click Again</div><div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div></label> 
 : null}
  
            <button className="rounded-3xl mb-24 tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto" onClick={handleRemove}>Delete Gun</button>

        </>
    )

}

export default ViewGun;