import React, { useState, ReactNode }  from 'react'
import './App.css';
import { Game } from './Game'
import { UserInput } from './UserInput'
import { Option, controls } from './Option'
import store from '../store'

function Menu() {
    const { setPage } = store.getState().page
    store.dispatch({type: 'controls', payload: {keys: controls}})

    return <div>
        <h1>Hello</h1>
        <h2>This is a stupid game</h2>
        <div>
        <button type="button" onClick={() => setPage('game')}>
            Play
        </button>
        </div>
        <div>
        <button type="button" onClick={() => setPage('option')}>
            Option 
        </button>
        </div>
        <div>
        <button type="button" onClick={() => setPage('editor')}>
            Editor 
        </button>
        </div>
        <div>
        <button type="button" onClick={() => setPage('howto')}>
            How to play 
        </button>
        </div>
    </div>
}

function Main() {
    const { setPage } = store.getState().page
    // add back button

    return <div className="Main">
        <UserInput />
        <Game />
        <div />
    </div>
}

function Editor() {
    const { setPage } = store.getState().page

    return <div>
        <h1>Editor</h1>
        <h2>WIP</h2>
        <button type="button" onClick={() => setPage('menu')}>
            Back 
        </button>
    </div>
}

function HowTo() {
    const { setPage } = store.getState().page
    
    return <div>
        <h1>HowTo</h1>
        <h2>WIP</h2>
        <button type="button" onClick={() => setPage('menu')}>
            Back 
        </button>
    </div>
}

type PageType = 'menu' | 'game' | 'option' | 'editor' | 'howto'
type PagesType<T> = {
    [key in PageType]: () => T; 
}

const pages: PagesType<ReactNode> = {
    menu: () => <Menu />,
    game: () => <Main />,
    option: () => <Option />,
    editor: () => <Editor />,
    howto: () => <HowTo />,
}

function App() {
    const [page, setPage] = useState<PageType>('menu')
    store.dispatch({type: 'page', payload: {setPage}})


    return (
        <div className="App">
            {pages[page]()}
        </div>
    );
}

export { App }
