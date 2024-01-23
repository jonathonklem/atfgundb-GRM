import {
    Link,
} from "react-router-dom";

const AmmoTable = (props) => {
    if (props.guns?.length === 0 || props.ammo instanceof Array === false) {
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
                {props.ammo.map((item) => (
                    <tr>
                        <td>
                            <Link to={`/ammo/view/`+item.ID}>{item.name}</Link>
                        </td>
                        <td className="text-right">{item.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )  
    }
}
export default AmmoTable;   