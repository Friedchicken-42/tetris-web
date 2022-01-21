import { createStore } from 'redux'

const reducer = (state: any, action: any) => {
    const data = state
    switch(action.type) {
        case 'input':
            data.input = {
                ...data.input,
                ...action.payload
            }
            break
        default:
            break;
    }
    return data 
}

const store = createStore(reducer, {})
export default store;
