import React, { createContext, useReducer } from 'react'
import ReactDom from 'react-dom'

import { Todo } from './components/Todo'
import { Head } from './components/Head'

import { reducers } from './js/combineReducer'

// 建立一個 context component ，並匯出給子 component 使用
const ReducerContext = createContext()
export { ReducerContext }

 
// 呼叫 combineReducer 後的 reducers
// 利用如果沒傳任何 action 就回傳目前的 state 來取得初始資料

const initState = reducers()

const App = () => {
    // 使用 useReducer 將創建後的 state 及 dispatch 放進 reducer
    // reducer = [state, dispatch]
    const reducer = useReducer(reducers, initState)
    return (
        // 透過 context component.Provider 將 reducer 傳下去
        <ReducerContext.Provider value={reducer}>
            <Head />
            <Todo />
        </ReducerContext.Provider>
    )
}

ReactDom.render(<App />, document.getElementById('root'))