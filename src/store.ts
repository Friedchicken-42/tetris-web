import { createStore } from 'redux'

const reducer = (state: any, action: any) => {
    const data = state

    data[action.type] = {
        ...data[action.type],
        ...action.payload
    }

    return data 
}

const store = createStore(reducer, {})
export default store;
