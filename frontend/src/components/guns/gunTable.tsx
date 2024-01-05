import React from "react";

const GunTable = (props) => {
    if (props.guns?.length === 0) {
        return (
            <div>
                <p>No guns yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Round Count</th>
                </tr>
                </thead>
                <tbody>
                {props.guns.map((gun) => (
                    <tr key={gun.id}>
                    <td>{gun.name}</td>
                    <td>{gun.roundcount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default GunTable;   