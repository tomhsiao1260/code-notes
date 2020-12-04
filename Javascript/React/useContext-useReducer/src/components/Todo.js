import React, { useState, useContext } from 'react'
import {v4 as uuid} from 'uuid'

// 匯入從 Main 中創建的 context component
import { ReducerContext } from '../index'

const Todo = () => {
    // 輸入欄的 listName 狀態用 useState 局部管理即可，不放到集中的 store
    const [listName, setListName] = useState('')
    
    // 用 useContext 獲得上層物件的 value
    // 即為 useReducer 提供的 state, dispatch
    const [state, dispatch] = useContext(ReducerContext)
    
    const addTodo = (e) => {
        e.preventDefault();
        // dispatch 新欄位進 store
        dispatch({ type: 'ADD_TODO', payload: { name: listName } })
        setListName('')
    }

    return (
        <>
            <form>
                <input value={listName}
                    onChange={e => setListName(e.target.value)} />
                <input type='submit' value='submit' onClick={addTodo} />
            </form>
            <ul>
                {
                    state.todo.list.map((list) => {
                        const id = uuid();
                        return (<li key={id}>{list.name}</li>)
                    })
                }
            </ul>
        </>
    )
}

export { Todo }