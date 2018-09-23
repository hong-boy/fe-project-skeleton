import React from "react";
import styles from "./index.less";
import {Button} from "antd";
import {get, post, put, del} from "@fetch";


class HelloWorld extends React.Component {

    state = {
        result: null
    }

    async get(){
        let ret = await get("/api/users");
        this.setState({
            result: ret
        });
    }

    async post(){
        let ret = await post("/api/users", {id:3, name:"A new user"});
        this.setState({
            result: ret
        });
    }
    async put(){
        let ret = await put("/api/users", {id:3, name:"An updated user"});
        this.setState({
            result: ret
        });
    }
    async del(){
        let ret = await del("/api/users");
        this.setState({
            result: ret
        });
    }

    render() {
        return (
            <div>
                <h1 className={styles["head-line"]}> Hello World </h1>
                <div>
                    <Button onClick={this.get.bind(this)}>GET请求</Button>
                    <Button onClick={this.post.bind(this)}>POST请求</Button>
                    <Button onClick={this.put.bind(this)}>PUT请求</Button>
                    <Button onClick={this.del.bind(this)}>DELETE请求</Button>
                </div>
                <div>
                    {/* 打印请求结果 */}
                    {JSON.stringify(this.state.result)}
                </div>
            </div>
        );
    }
}

export default HelloWorld;
