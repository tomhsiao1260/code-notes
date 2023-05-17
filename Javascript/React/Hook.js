import React from 'react';
import { useState, useEffect, useRef, useReducer } from 'react';
import { useCallback, useMemo, useContext, createContext } from 'react';

// component 裡的任何 state 變更都會觸發重新渲染 (值不變的更新不算)
// 父 component 的渲染也會觸發 子 component 的渲染 (就算子沒變也會重渲染)
// 不用 state 儲存的變數 (e.g. let, const) 不在 React 渲染監聽的範圍內
// 渲染表示會重新執行一次 Hook，並在渲染後觸發一些 side effect

// Hook 是一個 function
// 只能在 function components 或自定義的 Hook 內使用
// 它讓 function component 裡的 local 變數可以 "hook into"
// React engine 內部維護的各種功能，常見的有 useState, useEffect 兩種 Hook

// 有兩種常用的方式在 component 來共享 stateful 邏輯
// 分別是 render props 和 higher-order component
// 現在改用 Hook 可以不用多加額外的 component 就能解決許多問題

// Hook 使得使用者不必寫 class 就能使用 state 以及其他 React 的功能
// 同一套邏輯的 state 和對應的 side effect 可以寫在一起，而不像之前要被 life-cycle function 拆開
// useEffect 把新增、清除的機制寫在一起，比起之前使用 componentDidMount、componentWillUnmount 分開寫方便
// 不需要麻煩的 this 寫法，因為在 function component 內都是 local variable

// Hook 規則：
// 不要在迴圈、條件式或是巢狀的 function 內呼叫 Hook
// 且總是在 React function 的最上層使用 Hook
// 藉由遵循這些規則，可確保當每次 render 時 Hook 都依照正確的順序被呼叫
// 以確保每次 Hook 能與相應的 local variable (state) 正確的對應
// 例如：不要在 useEffect 外包判斷式，而是改在 useEffect 的函數內寫入判斷式

// 也可自己定義 Hook，將重複的邏輯整理在 function 中並拆分程式碼，需以 use 開頭方便 linter 辨別
// 自定義的 hook 等同於直接把內容寫在 function component 內
// 所以不同的 function component 使用同個 hook 並不會共享 state，而是各自獨立運行

function A(props) {
  ///////////////////////////////////////////////////////////
  //////////////////////// useState /////////////////////////
  ///////////////////////////////////////////////////////////

  // useState 用來管理 state
  // 其輸入為 state 的初始值，只會在第一次呼叫 components 時被傳入
  // return 為一個 local state 和 更新此 state 的方法
  // React 會在重新 render 的頁面間保留這些 state
  const [count, setCount] = useState(0);

  // setCount(...) 輸入可接受數值或函數
  // 數值：更新後的狀態值
  // 函數：以現在狀態作為輸入，回傳最新狀態 (e.g. (state) => ({...state, update: 'new'}))

  ///////////////////////////////////////////////////////////
  //////////////////////// useEffect ////////////////////////
  ///////////////////////////////////////////////////////////

  // useEffect 用來管理 side effect
  // 就是指 React 更新 DOM "之後"執行的一些額外動作，例如：
  // 資料 fetch、設定 subscription、手動改變 component 中的 DOM
  // 此寫法簡潔的統一處理 life cycle method
  // 可視為 componentDidMount、componentDidUpdate、componentWillUnmount 的組合
  // 其輸入為一個 function (或稱為 effect)，會在 DOM 更新後、渲染後被呼叫
  useEffect(() => {
    document.title = `You clicked ${count} times`;
    // 儘量把相關的 function 直接放進 effect 內部，以便預測其行為
    // 可在這裡 return 一個 function，會被預設為下次執行這個 effect 前會先執行的清除的指令
  }, [count]);
  // dependency 矩陣：在矩陣內的選項變更時，觸發 useEffect 函數一次 (不論函數內有無這個參數)
  // 為了預測行為，建議裡頭有用到的 state 都加進去，或全部不填 (eslint: exhaustive-deps)
  // 省略的話會在每次渲染後都執行，空矩陣 [] 則只在初始化執行一次

  ///////////////////////////////////////////////////////////
  ////////////////// useMemo & useCallback //////////////////
  ///////////////////////////////////////////////////////////

  // memoization 是一種優化技術主要用來加速程式透過存取複雜函數的計算結果
  // 並在下次相同輸入發生時直接回傳 cache 的結果

  function computeExpensiveValue() { return 1 * Math.PI; }
  // useMemo 會回傳 memorized 後的數值
  const memorizedResult = useMemo(() => computeExpensiveValue(), []);
  // useCallback 會回傳 memorized 後的函數
  const memorizedCallback = useCallback(() => computeExpensiveValue(), []);
  // 兩個本質上是相同的，只是一個回傳結果，另一個回傳函數，即
  // useCallback(fn, deps) 相等於 useMemo(() => fn, deps)
  useEffect(() => {
    console.log('useMemo', memorizedResult);         // PI
    console.log('useCallback', memorizedCallback()); // PI
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 這些 hook 與 useEffect 不同，是在渲染期間而不是渲染後執行
  // 所以像一些 side effect 還是要用 useEffect
  // 但會消耗較多運算資源的就可以改用 useMemo, useCallback
  // 不確定但我覺得使用上可以視為跟 useEffect 相似但有優化過的結果 (但會佔用些記憶體)

  ///////////////////////////////////////////////////////////
  ///////////////////////// useRef //////////////////////////
  ///////////////////////////////////////////////////////////
  
  // 如果想要更新參數，卻不想要重新 render，可以使用 useRef，其 current 屬性可以儲存參數
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(() => { console.log('tick'); }, 1000);
    return () => { clearInterval(intervalRef.current); };
    // 不需要也不建議加入 useRef 相關的 dependency 因為它不會觸發渲染
  });
  // 也可以用這個方法來提取 DOM，例如下面方法用 useRef 存取 input element
  // const inputEl = useRef(null);
  // const onButtonClick = () => { inputEl.current.focus(); };
  // <input ref={inputEl} type="text" />

  // 這篇寫得不錯：https://css-tricks.com/using-requestanimationframe-with-react-hooks/

  ///////////////////////////////////////////////////////////
  //////////////////////// useReducer ///////////////////////
  ///////////////////////////////////////////////////////////

  // 可以將多個狀態寫成同個 state 集中管理
  const [progress, setProgress] = useState({ enable: true, loaded: false });
  useEffect(() => { setProgress((state) => ({ ...state, enable: true })) }, []);
  useEffect(() => { console.log(progress) }, [progress]);

  // 或是當 state 邏輯較複雜，可以使用 useReducer
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  // 第三個參數會以第二個參數作為輸入值，並回傳初始狀態的函式，也可改用下方寫法直接初始化
  // const [reducerState, dispatch] = useReducer(reducer, { count: 0 });

  // Store: 唯一儲存所有 app 裡 states 的地方
  // Action: 為一個 object 包含了下面兩種特性: type 和 payload，以描述 state 的變更
  // Reducer: 為一個函數，以目前的 state 和 action 作為輸入，以產生新的 state

  // Redux 三大原則 (讓 state 更容易被預測、偵錯):
  // 1. 所有的 state 僅存在唯一的 store
  // 2. 改變 state 的唯一方式為送一個訊號，也就是送一個描述改變的 action (dispatching an action)
  // 3. state 是 immutable (不能被複寫的)，也就 reducer 必須是個 pure function

  function reducer(state, action) {
    switch (action.type) {
      case 'increment': return {count: state.count + 1};
      case 'decrement': return {count: state.count - 1};
      case 'reset': return init(action.payload);
      default: throw new Error();
    }
  }
  function init(value) { return { count: value }; };

  return (
    <div>
      {/* useState field */}
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>You clicked the button above {count} times</p>
      {/* useReducer field */}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'reset', payload: 0})}>reset</button>
      <p>useReducer value is: {reducerState.count}</p>
      {/* useContext field */}
      <ModeContext.Provider value={mode.mode2}><B /></ModeContext.Provider>
    </div>
  );
}

///////////////////////////////////////////////////////////
//////////////////////// useContext ///////////////////////
///////////////////////////////////////////////////////////

// 有時候，不想要一層層往下以 props 傳某個狀態，覺得有點多餘
// 可以使用 useContext 跳過中間層傳給指定的 component

// 1. 要傳遞的資料選項
const mode = {
  mode1: { value: 'You are in mode 1' },
  mode2: { value: 'You are in mode 2' }
};

// 2. 產生 context，括號為預設的選項值
const ModeContext = createContext(mode.mode1);

// 3. 這樣一來，只要是這個 context.Provider 底下的所有子 component 都可以享有它的 props
// <ModeContext.Provider value={mode.mode2}><B /></ModeContext.Provider>

// 4. 其子 component 可透過 useContext 取得上層 provider 的 props (可隔多層)
function B() {
  const mode = useContext(ModeContext);
  return <div>{mode.value}</div>        // You are in mode 2
} 

// useContext 可用來做狀態管理，也可以在一個專案的不同層放置 Provider
// 以便把 state 提升到最適合的位置供下面的 component 使用 (state lifting)
// 可以學習下面連結 (3.) 裡 useContext, useState 和 useContext, useReducer 搭配的寫法 (中間開始)
// 一般來說，只與使用者 UI 有關的 state 都可以透過 useContext, useState, useReducer 管理
// 但有些 state 與 server 來往有關，為了效能會使用 cache 相關技術，而這些狀態的管理是相對困難的
// 這時候可以考慮 react-query、SWR 或更完整但大包的 Apollo client 去管理這些狀態

export { A };

// 1. 官方 FAQ：https://zh-hant.reactjs.org/docs/hooks-faq.html
// 2. 寫法推薦：https://github.com/mithi/react-philosophies#-1-the-bare-minimum
// 3. state 管理的最佳實踐：https://kentcdodds.com/blog/application-state-management-with-react
// 4. overrected (setState): https://overreacted.io/how-does-setstate-know-what-to-do/
// 5. overrected (useEffect): https://overreacted.io/a-complete-guide-to-useeffect/

// useEffect 因為是在渲染後才執行，所以通常不會有效能問題，大多時候都是用 useEffect
// 但如果 effect 本身與 DOM 操作有關 (useRef)，在樣式更新到進一步渲染中，會有時間差
// 這個時候使用 useLayoutEffect 也許會更適合，會在 DOM 更新完畢馬上執行且尚未渲染時執行
// https://kentcdodds.com/blog/useeffect-vs-uselayouteffect

// 另一種用法是 useLayoutEffect 可以確保在所有 effect 之前運行
// 所以如果只是希望某個參數在渲染時是最新的狀態，而不需要額外的 render
// 可以使用 useRef 搭配 useLayoutEffect 這個 pattern
// 解釋：https://epicreact.dev/the-latest-ref-pattern-in-react/

// const callbackRef = useRef(callback)
// useLayoutEffect(() => { callbackRef.current = callback })