import React from "react";
import {
    Link,
} from "react-router-dom";
import AmmoTable from "./ammoTable";

const AmmoIndex = (props) => {
    return (
        <div>
            <ul className="text-center"> 
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/add">Add</Link></li>
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/purchase">Purchase</Link></li>
                <li className="inline-block mx-2"><Link className="bg-red-800 text-slate-50 py-2 px-4 block my-2 text-center mx-auto" to="/ammo/dispose">Dispose</Link></li>
            </ul>
            <AmmoTable />
        </div>
    );
}

export default AmmoIndex;