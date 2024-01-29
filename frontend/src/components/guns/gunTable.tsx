import React from "react";
import {
    Link,
} from "react-router-dom";
import {Gun, GunContextType} from "../../Types";

import { GunContext } from "../contexts/gunContext";


const GunTable = (props) => {
    const { guns } = React.useContext(GunContext) as GunContextType;
    if (guns?.length === 0 || guns instanceof Array === false) {
        return (
            <div>
                <p className="font-light text-base tracking-wider">No guns yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto mb-16 mt-4">
                <thead className="border-b border-gray-600">
                <tr>
                    <th className="font-light text-base tracking-wider text-left">Name</th>
                    <th className="font-light text-base tracking-wider text-right">
                        <span className="h-4 border-gray-600 border-l inline-block float-left"></span>Round Count
                    </th>
                </tr>
                </thead>
                <tbody className="font-light text-sm tracking-wider">
                {guns.map((gun) => (
                    <tr>
                        <td>
                            <Link to={`/guns/view/`+gun.ID}>{gun.name}</Link>
                        </td>
                        <td className="text-right">{String(gun.roundcount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default GunTable;   