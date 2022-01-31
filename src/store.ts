type Callback = () => void;

type Store = {
    state: any;
    callbacks: Callback[];
    dispatch: (name: string, payload: any) => void;
    subscribe:(callback: Callback) => void;
}

const store: Store = {
    state: {},
    callbacks: [],
    dispatch(name: string, payload: any) {
        this.state[name] = payload
        this.callbacks.forEach(callback => callback())
    },
    subscribe(callback: Callback) {
        this.callbacks.push(callback)
    },
}

export default store;
