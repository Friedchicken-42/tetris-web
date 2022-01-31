import React, { useState } from 'react'
import './userInput.css'
import store from '../store'

type InputProps = {
    name: string
    value: number 
    min: number
    max: number | undefined
}

function Input({ name, value, min, max }: InputProps) {
    const [v, setValue] = useState<string>(value.toString())

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const save = (a: string, b: string) => {
        const num = parseFloat(b)
        if(num >= min && (max === undefined || num <= max))
            store.dispatch('input', {
                ...store.state.input,
                [a]: num,
            })
        else 
            setValue(store.state.input[a])
    }

    return <div className="input-element">
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <input
            type="number"
            min={min}
            id={name}
            value={v || ''}
            onChange={handleChange}
            onBlur={() => save(name, v || '')}
            onKeyUp={(e) => e.key === 'Enter' && save(name, v || '')}
        />
    </div>
}

export function UserInput() {
    const base = [
        {
            name: "movement",
            value: .5,
            min: .01,
            max: 1,
        },
        {
            name: "rotation",
            value: 45,
            min: 1,
        },
        {
            name: "threshold",
            value: 10,
            min: 1,
        }
    ]
    store.dispatch('input', base.reduce((prev, curr) => ({ ...prev, [curr.name]: curr.value }), {}))
    
    return <div className="container-input" >
        {base.map(
            ({ name, value, min, max }) => <Input
                key={name}
                name={name}
                value={value as number}
                min={min}
                max={max}
            />
        )}
    </div>
}
