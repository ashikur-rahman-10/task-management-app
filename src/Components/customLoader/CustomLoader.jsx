import React from "react";
import loader from "../../assets/Search.gif";
const CustomLoader = () => {
    return (
        <div className="h-screen bg-white w-full flex justify-center items-center">
            <img src={loader} alt="" />
        </div>
    );
};

export default CustomLoader;
