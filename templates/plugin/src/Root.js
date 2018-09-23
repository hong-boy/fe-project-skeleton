import React from "react";
import HelloWorld from "./components/HelloWorld";
// import HelloWorld from "../dist/bundle.js";
import "antd/dist/antd.css";


export default class Root extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <HelloWorld />
            </div>
        );
    }
}
