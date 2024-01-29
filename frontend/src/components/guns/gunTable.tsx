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
                <p>No guns yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto mb-16">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Round Count</th>
                </tr>
                </thead>
                <tbody>
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