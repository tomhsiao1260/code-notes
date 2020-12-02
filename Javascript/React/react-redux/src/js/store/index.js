import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import { forbiddenWordsMiddleware } from "../middleware/index";
import thunk from "redux-thunk";

// 透過 redux 的 createStore 產生 store
// 第一個參數為欲使用的 reducer
// 第二個參數為 middleware (非必要)
const store = createStore(
    rootReducer,
    applyMiddleware(forbiddenWordsMiddleware)
);
// 若有多個 middleware 可寫為：
// applyMiddleware( middleware1, middleware2 )
// 並透過 next(action) 接棒
export {store};

// 若需要使用 AJAX 語法，可使用 Redux Thunk 的 middleware，則 store 需改寫如下：
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeThunk = createStore(
    rootReducer,
    storeEnhancers(applyMiddleware(forbiddenWordsMiddleware, thunk))
);
export default storeThunk;

// 可以把 store 和 action 綁定到 browser 的全域變數
// 即可在 google console 使用 store 了解其運作邏輯

// window.store = store;
// window.addArticle = addArticle;

// 可使用下面三種方法，說明如下：
// store.getState();
// store.subscribe();
// store.dispatch();

// store.getState()
// 獲得目前的 store，為一個 object，初始為 {article:[]}

// store.subscribe(() => console.log('Look ma, Redux!!'))
// 訂閱事件，會在 dispatch action 後被觸發
// 還會回傳一個結束訂閱的 function
// 使用 const unsubscribe = store.subscribe(...)
// 想結束訂閱時，即可呼叫 unsubscribe();

// store.dispatch( addArticle({ title: 'React Redux Tutorial for Beginners', id: 1 }) )
// 透過 addArticle 產生一個 action，會透過 reducer 來更新 store 
// 因為前一步有訂閱，會同時觸發訂閱並顯示 'Look ma, Redux!!'

// store.getState()
// 獲得更新的狀態 {article: [{ title: 'React Redux Tutorial for Beginners', id: 1 }]}