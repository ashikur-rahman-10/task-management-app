import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "react-daisyui";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1 className="text-7xl">Hello</h1>
            <Button>Daisy</Button>
        </>
    );
}

export default App;
