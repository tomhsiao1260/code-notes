import { ADD_ARTICLE } from "../constants/action-types";

const initialState = {
  articles: [],
  remoteArticles: []
};

// reducer function 提供給 store 使用
// 只有初始化要提供 initial state
// 之後只要提供一個 action 並呼叫 store.dispatch(action) 
// 就會使用到 reducer 根據目前內部維護的 state 產生新的 state
function rootReducer(state = initialState, action) {
    if (action.type === ADD_ARTICLE) {
      // 為了讓 reducer 為 pure function 所以不能直接寫成
      // state.articles.push(action.payload);
      return Object.assign({}, state, {
        articles: state.articles.concat(action.payload)
      });
    }
    // 下面的 action 供 Redux thunk 使用
    if (action.type === "DATA_LOADED") {
      return Object.assign({}, state, {
        remoteArticles: state.remoteArticles.concat(action.payload)
      });
    }
    return state;
}

export default rootReducer;