import React, { useState, useEffect } from 'react';

// Hook 是一個 function
// 只能在 function components 或自定義的 Hook 內使用
// 它讓 function component 裡的 local 變數可以 "hook into"
// React engine 內部維護的各種功能，常見的有 useState, useEffect 兩種 Hook
// 例如： state 用 useState、life cycle method 用 useEffect ... 等

function A(props) {
  // useState 用來管理 state
  // 其輸入為 state 的初始值，只會在第一次呼叫 components 時被傳入
  // return 為一個 local state 和 更新此 state 的方法
  // React 會在重新 render 的頁面間保留這些 state
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

  // useEffect 用來管理 side effect
  // 就是指 React 更新 DOM "之後"執行的一些額外動作，例如：
  // 資料 fetch、設定 subscription、手動改變 component 中的 DOM
  // 此寫法簡潔的統一處理 life cycle method
  // 可視為 componentDidMount、componentDidUpdate、componentWillUnmount 的組合
  // 其輸入為一個 function (或稱為 effect)，會在 DOM 更新後(state改變)、第一次渲染後被呼叫
  useEffect(() => {
    document.title = `You clicked ${count} times`;
    // 也可 return 一個 function，會被預設為在這個 effect 後行的清除的指令
    // return function cleanup() { ... } 或匿名寫法 return () => { ... }
    // 每次 render 時都會跟著 useEffect 被呼叫一次，確保沒有資源沒被清乾淨
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
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
export {A};

// 也可自己定義 Hook，將重複的邏輯整理在 function 中
// 需以 use 開頭方便 linter 辨別

// 下面實作一個判斷使否在線的 Hook
function useFriendStatus(friendID) {
  // 建立一個 state 判斷是否在線
  const [isOnline, setIsOnline] = useState(null);
  // 設定 subscription 
  useEffect(() => {
    // 定義一個函數更新 state
    const handleStatusChange = (status) => setIsOnline(status.isOnline);
    // 用 API 建立 subscription
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    // 清除 subscription
    return () => { ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange); }
  });
  // 回傳是否在線
  return isOnline; 
}
// 使用上方實作好的 Hook
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  )
}
// 有兩種常用的方式在 component 來共享 stateful 邏輯
// 分別是 render props 和 higher-order component
// 現在改用 Hook 可以不用多加額外的 component 就能解決許多問題
// 當使用自定義的 hook 等同於直接把內容寫在 function component 內
// 所以不同的 function component 使用同個 hook 並不會共享 state，而是各自獨立運行


