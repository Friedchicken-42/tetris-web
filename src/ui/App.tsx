import React from 'react'
import './App.css';
import { Game } from './Game'
import { UserInput } from './UserInput'

function App() {
    return (
        <div className="App">
            <UserInput />
            <Game />
            <div />
        </div>
    );
}

export { App }
