import React from "react";
import {
    Link,
} from "react-router-dom";
import AmmoTable from "./ammoTable";

const Ammo = (props) => {
    const url = props.Url;
    const [ammo, setAmmo] = React.useState([]);

    React.useEffect(() => {
        fetchAmmo();
    }, []);

    function fetchAmmo() {
        fetch(`${url}/ammo?user_id=`+props.UserId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + props.authToken
            }
        })
        .then((response) => response.json())
        .then((data) => setAmmo(data));
    }
    return (
        <div>
            <ul className="text-center"> 
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/add">Add</Link></li>
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/purchase">Purchase</Link></li>
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/dispose">Dispose</Link></li>
            </ul>
            <AmmoTable ammo={ammo} />
        </div>
    );
}

export default Ammo;