import React from 'react';
import { Link } from 'react-router-dom';

const Preferences = () => {
    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2">Account Preferences</h1>
            <div className="mb-32"></div>
            <hr />
            <p className="font-extralight mx-auto opacity-80 mb-4 p-4 block max-w-md tracking-wider text-base">If you would like to delete your account have have your information wiped from our database you can click the following button at any time:</p>
            <Link className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 max-w-md w-1/2 block mb-24 text-center mx-auto" to="/delete">Account Deletion</Link>
        </>
    );
}

export default Preferences;