import React from "react";
import {
    Link,
} from "react-router-dom";

import { AmmoContext } from "../contexts/ammoContext";
import { AmmoContextType } from "../../Types";

const AmmoTable = (props) => {
    const { ammo } = React.useContext(AmmoContext) as AmmoContextType;

    if (ammo instanceof Array === false) {
        return (
            <div>
                <p className="font-light text-base tracking-wider">No ammo yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto mb-16 mt-4">
                <thead className="border-b border-gray-600">
                <tr>
                    <th className="w-1/2 font-light text-base tracking-wider text-left">Name</th>
                    <th className="w-1/2 font-light text-base tracking-wider text-right">
                        <span className="h-4 border-gray-600 border-l inline-block float-left"></span>Count
                    </th>
                </tr>
                </thead>
                <tbody className="font-light text-sm tracking-wider">
                {ammo.map((item) => (
                    <tr>
                        <td>
                            <Link to={`/ammo/view/`+item.ID}>{item.name}</Link>
                        </td>
                        <td className="text-right">{String(item.amount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default AmmoTable;   