import React, { useState, ReactNode }  from 'react'
import './App.css';
import { Game } from './Game'
import { UserInput } from './UserInput'
import { Option, controls } from './Option'
import { HowTo } from './HowTo'
import store from '../store'

function Menu() {
    const { setPage } = store.state
    store.dispatch('controls', controls)

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
            How this works 
        </button>
        </div>
    </div>
}

function Main() {
    const { setPage } = store.state
    // add back button

    return <div className="Main">
        <UserInput />
        <Game />
        <div />
    </div>
}

function Editor() {
    const { setPage } = store.state

    return <div>
        <h1>Editor</h1>
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
    store.dispatch('setPage', setPage)

    return (
        <div className="App">
            {pages[page]()}
        </div>
    );
}

export { App }
