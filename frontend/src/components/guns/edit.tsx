import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable'; // Import GroupBase from react-select
import ValueType from "react-select";
import { Gun, GunContextType } from "../../Types";
import { GunContext } from "../contexts/gunContext";
import customStyles from "../../customStyles";


const EditGun = (props) => {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [caliberOptions, setCaliberOptions] = React.useState<Array<{ label: string; value: string; options?: readonly string[] }>>([]); // Update the type of caliberOptions
    const [calibers, setCalibers] = React.useState<string[]>([]);
    const [gun, setGun] = React.useState<Gun>({} as Gun);
    const [currentCaliber, setCurrentCaliber] = React.useState<any>('');
    let { id } = useParams();

    const { guns, editGun } = React.useContext(GunContext) as GunContextType;

    // breaking out gun components because state not updating properly
    const [gunName, setGunName] = React.useState<string>('');
    const [gunManufacturer, setGunManufacturer] = React.useState<string>('');
    const [gunModel, setGunModel] = React.useState<string>('');
    const [roundCountString, setRoundCountString] = React.useState<string>('');

    useEffect(() => {
        guns.map((gun) => {
            if (calibers.indexOf(gun.caliber) === -1) {
                caliberOptions.push({ label: gun.caliber, value: gun.caliber });
                // remove duplicates from calibers
                setCaliberOptions(caliberOptions);
                
                calibers.push(gun.caliber);
                setCalibers(calibers)
            }    
        });

        guns.filter((gun) => {
            if (gun.ID === id) {
                setGun(gun);
                setCurrentCaliber(gun.caliber);
                setGunName(gun.name);
                setGunManufacturer(gun.manufacturer);
                setGunModel(gun.model);
                setRoundCountString(String(gun.roundcount));
            }
        });
    }, []);

    function changeCaliber(value) {
        let newGun = gun;
        newGun.caliber = value; // if we use value.value, there's an error...  soemhow need to parse this at handleSumbit I guess
        console.log(newGun);
        setGun(newGun);
        setCurrentCaliber(value.value);
    }

    function changeName(value) {
        let newGun = gun;
        newGun.name = value;
        setGun(newGun);
    }
    
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const formJson = Object.fromEntries(formData.entries());

        // hate this, but there doesn't seem to be a good way to force INT type on roundcount
        const clearObject = JSON.parse(JSON.stringify(formJson));
        clearObject.user_id = props.UserId;
        clearObject.roundcount =  Number(formJson.roundcountstring);
        clearObject.caliber = currentCaliber;

        if (clearObject.name === "") {
            setSuccessMessage("*** Name is required ***");
            return;
        }

        if (clearObject.caliber === "") {
            setSuccessMessage("*** Caliber is required ***");
            return;
        }

        setSuccessMessage("Saving.....");
        
        editGun(id as string, clearObject, () => {setSuccessMessage("Saved Gun Successfully!");form.reset();});
        // clear form
        
    }
    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pistol-red.png" />Edit Gun</h1>
            <em className="text-center green-600 block my-2">{successMessage}</em>
            <form onSubmit={handleSubmit} className="px-4 pb-16">
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Name</div><div className="block w-full p-2 mx-auto"><input type="text" name="name" onChange={(e) => setGunName(e.target.value)} value={gunName}/></div></label> 
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Manufacturer</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="manufacturer" onChange={(e) => setGunManufacturer(e.target.value)} value={gunManufacturer} /></div></label>
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Model</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="text" name="model" onChange={(e) => setGunModel(e.target.value) } value={gunModel} /></div></label>
                <label className="block my-2 mx-auto "><div className="block text-sm font-extralight tracking-wider">Caliber</div><div className="block w-full p-2 w-1/2 mx-auto">
                    <CreatableSelect name="caliber" styles={customStyles} className="block w-full tracking-wider text-sm rounded-md" value={{label: currentCaliber, value: currentCaliber}} onChange={(e) => changeCaliber(e)}  options={caliberOptions} />
                </div></label>
                <label className="block my-2 mx-auto text-center mb-24"><div className="block w-1/3 mx-auto">Round Count</div><div className="block w-full p-2 w-1/2 mx-auto"><input type="number" name="roundcountstring" onChange={(e) => setRoundCountString(e.target.value) } value={roundCountString}/></div></label>
                <div className="bg-darkbg mt-4 flex justify-between pt-2 fixed bottom-[53px] w-full left-0 text-center">
                    <button className="rounded-3xl tracking-wider text-lg bg-redbg drop-shadow-lg text-white py-2 px-4 w-1/4 block text-center mx-auto">Submit</button>
                </div>
            </form>
        </>
    )
}

export default EditGun;