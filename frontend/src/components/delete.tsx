import React, { useState } from 'react';
import { UserDataContext } from "./contexts/userDataContext";
import { UserDataContextType } from '../Types';

const DeleteScreen = (props) => {
    const [confirmText, setConfirmText] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { removeAccount } = React.useContext(UserDataContext) as UserDataContextType;
    function handleRemove() {
        console.log("In handle remove");

        if (confirmText === "PROCEED") {
            removeAccount();
            setSuccessMessage("Account Deleted");
        } else {
            setSuccessMessage("Please type PROCEED in all caps to confirm");
        }
    }

    return (
        <>
            <h1 className="text-center font-bold text-xl py-2 bg-red-800 text-slate-50">Delete Account</h1>
            <p className="text-justify mx-auto mb-8 p-4 block max-w-md">This action is instantaneous and permanent.  All data related to your account will be purged from our database and will not be recoverable.</p>
            <p className="text-justify mx-auto mb-8 p-4 block max-w-md">If you would like to proceed, please type "PROCEED" in all caps below and then click the delete button</p>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <div className="block w-full p-2 mx-auto"><input type="text" name="confirm" onChange={(e) => setConfirmText(e.target.value)} /></div>
            <button className="rounded-md bg-red-800 text-slate-50 py-2 px-4 w-1/4 block my-2 mb-20 text-center mx-auto" onClick={handleRemove}>Delete</button>
           
        </>
    )
}

export default DeleteScreen;