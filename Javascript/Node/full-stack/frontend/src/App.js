import React, { useState } from 'react'
import { clickToGet } from './axios'

// 因為與後端要資源，所以需要 async 非同步的寫法
// 透過 axios 與後端溝通並拿到資源
// 拿到的資源用 message 這個 state 存取
// state 發生改變會自動重新 rerender
function App() {
  const [ message, setMessage ] = useState('nothing');
  return (
    <div className="App">
      <button 
        onClick={async () => {
          const msg = await clickToGet();
          setMessage(msg);
        }}
      >
      Click me !
      </button>
      <div>{message}</div>
    </div>
  );
}

export default App;
