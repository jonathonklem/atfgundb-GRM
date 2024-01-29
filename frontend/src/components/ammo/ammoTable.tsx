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
                <p>No ammo yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto mb-16">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Count</th>
                </tr>
                </thead>
                <tbody>
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