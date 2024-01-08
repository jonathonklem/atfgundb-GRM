import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import GunsTable from "./gunTable";

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');

const Guns = (props) => {
  const [guns, setGuns] = React.useState([]);

  React.useEffect(() => {
    fetchGuns();
  }, []);

  function fetchGuns() {
    fetch(`${url}/guns?user_id=`+props.UserId, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + props.authToken
      }})
      .then((response) => response.json())
      .then((data) => setGuns(data));
  }
  return (
    <div>
        <ul> <li><Link className="bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 text-center mx-auto" to="/guns/add">Add Gun</Link></li></ul>
        <GunsTable guns={guns} />
    </div>
  );
};

export default Guns;