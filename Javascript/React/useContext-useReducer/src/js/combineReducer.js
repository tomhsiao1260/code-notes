import { todoReducer } from './todoReducer.js'

// 透過這個函數將各處的 reducer 合併為一個
// 此寫法參照 Redux 內的 combineReducer
const combineReducer = reducers => {
  const reducerKeys = Object.keys(reducers)
  let objInitState = {}

  reducerKeys.forEach((key) => {
    const initState = reducers[key](undefined, { type: '' })
    if (initState === 'undefined'){
      throw new Error(`${key} does not return state.`)
    }
    objInitState[key] = initState
  })

  return (state, action) => {
    if(action){
      reducerKeys.forEach((key) => {
        const previousState = objInitState[key]
        objInitState[key] = reducers[key](previousState, action)
      })
    }

    return { ...objInitState }
  }
}

// 將多個 Reducer 合併 (雖然範例只有一個 reducer)
const reducers = combineReducer({
  todo: todoReducer,
})

// const reducers = combineReducer({
//   todo: todoReducer,
//   test: testReducer,
// })

// 注意用此方法獲得的 state 為

// {
//   todo: {...},
//   test: {...},
// }

// 使用 state.todo 取得 todo 的 state

export { reducers }