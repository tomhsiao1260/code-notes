import React, { useContext } from 'react'
import { ReducerContext } from '../index'

const Head = () => {
    // 用 useContext 獲得上層物件的 value
    // 即為 useReducer 提供的 state, dispatch
    const [state] = useContext(ReducerContext)
    
    return (
        <div>
            <span>todos number: {state.todo.list.length}</span>
        </div>
    )
}

export { Head }