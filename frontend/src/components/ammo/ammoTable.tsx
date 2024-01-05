import React from "react";

const AmmoTable = (props) => {
    if (props.guns?.length === 0) {
        return (
            <div>
                <p>No ammo yet.</p>
            </div>
        )
    } else { 
        return (
            <table className="mx-auto">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Count</th>
                </tr>
                </thead>
                <tbody>
                {props.ammo.map((item) => (
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default AmmoTable;   