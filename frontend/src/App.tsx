import Navbar from "./Navbar";
import Header from "./Header";
import Table from "./Table";

import "./index.css";
import {useState} from "react";

const App = () => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    return (
        <div>
            <Navbar/>
            <div className="w-full p-8">
                <Header setSearchTerm={setSearchTerm}/>
                <Table searchTerm={searchTerm}/>
            </div>
        </div>
    )
};


export default App;
