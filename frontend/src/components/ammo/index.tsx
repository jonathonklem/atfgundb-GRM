import React from "react";
import {
    Link,
} from "react-router-dom";
import AmmoTable from "./ammoTable";

const AmmoIndex = (props) => {
    return (
        <div>
            <ul className="text-center"> 
                <li className="inline-block mx-2"><Link className="font-extralight tracking-wider text-xs px-4 w-full block mb-2 text-center mx-auto" to="/ammo/add"><img className="mx-auto mb-2" src="/ammo-add.png" />Add</Link></li>
                <li className="inline-block mx-2"><Link className="font-extralight tracking-wider text-xs px-4 w-full block mb-2 text-center mx-auto" to="/ammo/purchase"><img className="mx-auto mb-2" src="/ammo-purchase.png" />Purchase</Link></li>
                <li className="inline-block mx-2"><Link className="font-extralight tracking-wider text-xs px-4 w-full block mb-2 text-center mx-auto" to="/ammo/dispose"><img className="mx-auto mb-2" src="/ammo-dispose.png" />Dispose</Link></li>
            </ul>
            <AmmoTable />
        </div>
    );
}

export default AmmoIndex;