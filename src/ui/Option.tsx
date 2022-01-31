import React, { useState } from 'react'
import store from '../store'
import './Option.css'

export const controls = [
    {
        key: 'ArrowLeft',
        title: 'move piece left',
        command: 'left',
    },
    {
        key: 'ArrowRight',
        title: 'move piece right',
        command: 'right',
    },
    {
        key: 'ArrowDown',
        title: 'soft drop',
        command: 'softdrop',
    },
    {
        key: ' ',
        title: 'hard drop',
        command: 'harddrop',
    },
    {
        key: 'z',
        title: 'rotate counterclockwise',
        command: 'ccw',
    },
    {
        key: 'x',
        title: 'rotate clockwise',
        command: 'cw',
    },
    {
        key: 'a',
        title: 'rotate twice counterclockwise',
        command: 'ccw2',
    },
    {
        key: 's',
        title: 'rotate twice clockwise',
        command: 'cw2',
    },
    {
        key: 'Shift',
        title: 'swap hold piece',
        command: 'hold',
    },
    {
        key: 'r',
        title: 'restart game',
        command: 'restart'
    },
]

type ControlProps = {
    bind: string;
    title: string;
    index: number;
}

type ControlType = {
    key: string;
    title: string;
    command: string;
}

function Control({ bind, title, index }: ControlProps) {
    const [value, setValue] = useState(bind)
    const [prev, setPrev] = useState(bind)

    const handleKey = (event: React.KeyboardEvent) => {
        event.preventDefault()
        setValue(event.key)
        controls[index].key = event.key
    }

    const handleFocusIn = (_: React.FocusEvent) => {
        setPrev(value)
        setValue('')
    }

    const handleFocusOut = (_: React.FocusEvent) => {
        if(value === '') setValue(prev)
    }

    return <div className="control">
        <div className="control-left">{title}</div>
        <div
            className="control-right"
            role="button"
            onKeyDown={handleKey}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
            tabIndex={0}
        >{value === ' ' ? 'Space' : value}</div>
    </div>
}

export function Option() {
    const { state } = store
    const { setPage } = state

    store.dispatch('controls', controls)

    const handleClick = () => {
        store.dispatch('controls', controls)
        setPage('menu')
    }

    return <div>
        <h1>Option</h1>
        <button type="button" onClick={handleClick}>
        Back
        </button>
        <div className="controls">
            {state.controls.map((c: ControlType, idx: number) => <Control key={c.key} bind={c.key} title={c.title} index={idx}/>)}
        </div>
    </div>
}
