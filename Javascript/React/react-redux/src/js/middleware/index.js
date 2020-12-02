import { ADD_ARTICLE } from "../constants/action-types";

const forbiddenWords = ["spam", "money"];

// 此 middleware 函數會在 dispatch action 到達 reducer 前先被執行
// 輸入為 store，可用解構賦值取得 getState, dispatch
export function forbiddenWordsMiddleware({ dispatch }) {
  return function(next) {
    // 獲得 action
    return function(action) {
      // 下面可撰寫 middleware 的內容
      if (action.type === ADD_ARTICLE) {

        const foundWord = forbiddenWords.filter(word =>
          action.payload.title.includes(word)
        );
        // 若 submit 的 text 含有 "spam" 或 "money"，則改為下面的 dispatch
        if (foundWord.length) {
          alert("this word is forbidden");
          // 此 type 並沒有在 reducer 定義，所以就不會更動 state
          return dispatch({ type: "FOUND_BAD_WORD" });
        }
      }
      // 會傳遞給下一個 middleware，若沒有下個，則會開始執行 reducer
      // 若漏寫 next(action) 則不會執行 reducer
      return next(action);
    };
  };
}