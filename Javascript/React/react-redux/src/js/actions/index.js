import { ADD_ARTICLE } from "../constants/action-types";

// 為 return 一個 action 的函數
// action 為一個 object，包含 type 和 payload:
// type: 描述這次 state 改變的方式
// payload: state 改變的內容
export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload }
};

// 此為 action 的非同步寫法，須搭配 Redux thunk 使用
export function getData() {
    // 一般的 action 只能回傳純物件而非 promise，所以需要 thunk 協助
    return function(dispatch) {
      return fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => {
          dispatch({ type: "DATA_LOADED", payload: json });
        });
    };
}