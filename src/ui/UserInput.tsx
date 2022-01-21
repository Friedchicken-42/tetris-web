import React, { useState, useReducer } from 'react'
import './userInput.css'

type InputProps = {
    name: string
    value: number 
    callback: (name: string, value: number) => void 
}

function Input({name, value, callback}: InputProps) {
    const [v, setValue] = useState(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value)
        setValue(num)
    }

    return <div className="input-element">
        <span>{name}</span>
        <input
            type="number"
            id={name}
            value={v || ''}
            onChange={handleChange}
            onBlur={() => callback(name, v || 0)}
            onKeyUp={(e) => e.key === 'Enter' && callback(name, v || 0)}
        />
    </div>
}

type Inputs = {
    [key: string]: number
}

export function UserInput() {
    const base = {
        "Movement": 1,
        "Rotation": 90,
        "Threshold": 10,
    }
    
    const reducer = (inputs: Inputs, action: {name: string, value: number}) => ({
        ...inputs,
        [action.name]: action.value
    })

    const [inputs, dispatch] = useReducer(reducer, base)

    return <div className="container-input" >
        {Object.entries(inputs).map(
            ([key, value]) => <Input
                key={key}
                name={key}
                value={value}
                callback={(a, b) => dispatch({name: a, value: b})}
            />
        )}
    </div>
}
