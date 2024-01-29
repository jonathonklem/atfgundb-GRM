import React from "react";
import {
    Link,
} from "react-router-dom";
import GunsTable from "./gunTable";

const Guns = (props) => {
  return (
    <div>
        <ul> <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/guns/add">Add Gun</Link></li></ul>
        <GunsTable />
    </div>
  );
};

export default Guns;