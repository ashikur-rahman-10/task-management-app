import React, { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";

const Greeting = () => {
    const [greeting, setGreeting] = useState("");
    const { user } = useAuth();

    const setGreetingMessage = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        if (currentHour >= 5 && currentHour < 12) {
            setGreeting("Good Morning");
        } else if (currentHour >= 12 && currentHour < 17) {
            setGreeting("Good Afternoon");
        } else {
            setGreeting("Good Evening");
        }
    };

    useEffect(() => {
        setGreetingMessage();
    }, []);

    return (
        <div className="w-full md:h-[250px]">
            <h1 className="text-2xl md:text-5xl md:pt-16 ">
                {greeting}, {user?.displayName}
            </h1>
            <h3 className="md:text-4xl md:pt-5 pb-8 md:">Welcome...</h3>
        </div>
    );
};

export default Greeting;
