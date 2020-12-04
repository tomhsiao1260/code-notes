const initState = {
    list: [{ listKey: 1, name: 'Hello World !' }]
}

// 與 Redux 的 reducer 寫法相同
const todoReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            let newKey = 1
            if (state.list.length !== 0){
                newKey = state.list[state.list.length - 1].listKey + 1
            }
            // 為了要讓 reducer 為 pure function 
            // 所以用 spread operator 以便重新回傳 state 的變動
            return {
                ...state,
                list: [...state.list, { listKey: newKey, name: action.payload.name }]
            }
        default:
            return state
    }
}

export { todoReducer }