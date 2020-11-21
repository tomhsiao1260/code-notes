import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class Posts extends Component {
    render() {
        // 理論上資料應該在後台管理，這裡先產生假資料
        const postIDs = ["1", "3", "5", "7", "9"];
        const lists = postIDs.map((i, index) => (
            // 如果文章在後台管理，可以 assign 每一篇文章一個 unique ID
            // 然後就可以利用這個 ID 來當 <li> 的 unique keys
            // 這裡暫時用 index 取代
            <li key={index}>
                <NavLink to={"/posts/" + i}>Posts #{i}</NavLink>
            </li>
        ));
        return (
            <div>
                <h3>Click to view article ---</h3>
                {lists}
            </div>
        );
    }
}
