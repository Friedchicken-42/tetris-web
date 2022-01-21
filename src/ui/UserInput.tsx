import React, { useState, useReducer } from 'react'
import './userInput.css'
import store from '../store'

type InputProps = {
    name: string
    value: number 
}

function Input({name, value }: InputProps) {
    const [v, setValue] = useState(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value)
        setValue(num)
    }

    const save = (a: string, b: number) => store.dispatch({type: 'input', payload: {[a]: b}})

    return <div className="input-element">
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <input
            type="number"
            id={name}
            value={v || ''}
            onChange={handleChange}
            onBlur={() => save(name, v || 0)}
            onKeyUp={(e) => e.key === 'Enter' && save(name, v || 0)}
        />
    </div>
}

export function UserInput() {
    const base = {
        "movement": 1,
        "rotation": 90,
        "threshold": 10,
    }

    Object.entries(base).map(([key, value]) => store.dispatch({type: 'input', payload: {[key]: value}}))
    
    return <div className="container-input" >
        {Object.entries(store.getState().input).map(
            ([key, value]) => <Input
                key={key}
                name={key}
                value={value as number}
            />
        )}
    </div>
}
