import React from "react";
import {
    Link,
} from "react-router-dom";

const GunTable = (props) => {
    if (props.guns?.length === 0) {
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
                {props.guns.map((gun) => (
                    <tr>
                        <td>
                            <Link to={`/guns/view/`+gun.ID}>{gun.name}</Link>
                        </td>
                        <td className="text-right">{gun.roundcount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default GunTable;   