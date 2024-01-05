import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import AmmoTable from "./ammoTable";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Ammo = (props) => {
    const [ammo, setAmmo] = React.useState([]);

    React.useEffect(() => {
        fetchAmmo();
    }, []);

    function fetchAmmo() {
        fetch(`${url}/ammo?user_id=`+props.UserId)
        .then((response) => response.json())
        .then((data) => setAmmo(data));
    }
    return (
        <div>
            <ul> <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/ammo/add">Add Ammo</Link></li></ul>
            <AmmoTable ammo={ammo} />
        </div>
    );
}

export default Ammo;