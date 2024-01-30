const customStyles = {
    control: (base, state) => ({
        ...base,
        background: "rgb(31 34 42 / var(--tw-bg-opacity))",
        color: "rgba(255,255,255,.6)",
        padding: ".5rem",
        // match with the menu
        borderRadius:  "0.375rem",
        border: "0px",
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "yellow" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "red" : "blue"
        }
    }),
    menu: base => ({
        ...base,
        // override border radius to match the box
        borderRadius: 0,
        // kill the gap
        marginTop: 0,
        color: "white"
    }),
    menuList: base => ({
        ...base,
        // kill the white space on first and last option
        padding: 0,
        color: "rgba(255,255,255,.6)",
    }),
    placeholder: (base, state) => ({
        ...base,
        color: "rgba(255,255,255,.6)",
    }),
    option: (base, state) => ({
        ...base,
        color: "rgba(255,255,255,.6)",
        background: "rgb(31 34 42 / var(--tw-bg-opacity))",
        "&:hover": {
        // Overwrittes the different states of border
        background: "rgb(31 34 42 / var(--tw-bg-opacity))"
        }
    }),
};

export default customStyles;