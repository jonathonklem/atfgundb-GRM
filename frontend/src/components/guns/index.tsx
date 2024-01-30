import React from "react";
import {
    Link,
} from "react-router-dom";
import GunsTable from "./gunTable";

const Guns = (props) => {
  return (
    <div>
        <ul> <li><Link className="font-extralight tracking-wider text-xs px-4 w-full block mb-2 text-center mx-auto" to="/guns/add"><img className="mx-auto mb-2" src="add-btn.png" />Add Gun</Link></li></ul>
        <GunsTable />
    </div>
  );
};

export default Guns;