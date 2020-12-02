import React from "react";
import { connect } from "react-redux";

// 從 store 中篩選某些 state 作為元件的 props，也稱作 selector
// 第一個參數為 Redux store 中的 state
const mapStateToProps = state => {
  // 回傳一個 object 並合併到 props 裡
  return { articles: state.articles };
};

// 此時 props 已經有 article 屬性，這裡用解構賦值提取
const ConnectedList = ({ articles }) => (
  <ul>
    {articles.map(el => (
      <li key={el.id}>{el.title}</li>
    ))}
  </ul>
);

// 利用 Redux 的 connect 產生新的 component
const List = connect(mapStateToProps)(ConnectedList);
// 此元件會訂閱 Redux store 的更新
// 並在每次的更新時呼叫 mapStateToProps
// 若不希望訂閱更新，可讓 mapStateToProps 改回傳 null

export default List;