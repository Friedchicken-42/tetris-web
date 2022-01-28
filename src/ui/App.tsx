import React  from 'react'
import './App.css';
import { Game } from './Game'
import { UserInput } from './UserInput'

function Main() {
    return <div className="Main">
        <UserInput />
        <Game />
        <div />
    </div>
}

function App() {
    return (
        <div className="App">
            <Main />
        </div>
    );
}

export { App }
