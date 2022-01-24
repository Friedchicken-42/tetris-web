import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import store from '../store'
import { Playfield } from './Playfield'
import { Preview } from './Preview'
import { Core, MinoJSON } from '../logic/Core'
import { Board } from '../logic/Board'
import './game.css'

type ScoreProps = {
    points: number
}

function Score({points}: ScoreProps) {
    const score = points.toString().padStart(10, '0')
    return <div className="score">{score}</div>
}

export function Game() {
    const coreRef = useRef<Core>()
    const [time, setTime] = useState(Date.now())
    const [_, setRender] = useState(Date.now())
    const [status, done] = useState<boolean>(false)

    const rerender = () => setRender(Date.now())

    useEffect(() => {
        const init = async () => {
            const pieces: MinoJSON[] = await fetch(`${process.env.PUBLIC_URL  }/pieces.json`)
                .then(data => data.json())
            coreRef.current = new Core(10, 20, pieces)
            done(true)
            rerender()
        }
        init()
    }, [])

    const gameRef = useRef<HTMLDivElement>(null)

    const handleKey = useCallback((event: KeyboardEvent) => {
        const core = coreRef.current
        if (!core) return;
        const { movement, rotation } = store.getState().input
        const radians = rotation * (Math.PI / 180)

        const mapping: { [key: string]: () => void } = {
            'ArrowRight': () => {
                core?.move(movement, 0)
            },
            'ArrowLeft': () => {
                core?.move(-movement, 0)
            },
            'ArrowDown': () => {
                core?.move(0, movement)
            },
            'z': () => {
                core?.rotate(radians)
            },
            'x': () => {
                core?.rotate(-radians)
            },
            'a': () => {
                core?.rotate(radians * 2)
            },
            's': () => {
                core?.rotate(-radians * 2)
            },
            'Shift': () => core?.holdMino(),
            ' ': () => {
                core?.harddrop(movement)
            },
        }

        if (core.board) mapping[event.key]?.()
        rerender()
    }, [])

    store.subscribe(() => {
        if (!coreRef.current) return;
        coreRef.current.setThreshold(store.getState().input.threshold)
    })

    const [show, setShow] = useState<boolean>(true)

    const handleFocus = useCallback((event: FocusEvent) => {
        setShow(event.type === 'focusout')
    }, [])

    useEffect(() => {
        if (!gameRef.current) return undefined
        const div: HTMLDivElement = gameRef.current
        div.addEventListener('keydown', handleKey)
        div.addEventListener('focusin', handleFocus)
        div.addEventListener('focusout', handleFocus)
        return () => {
            div.removeEventListener('keydown', handleKey)
            div.removeEventListener('focusin', handleFocus)
            div.removeEventListener('focusout', handleFocus)
        }
    }, [handleKey])

    useEffect(() => {
        const { movement } = store.getState().input
        const interval = setInterval(() => setTime(Date.now()), 400 * movement);
        const core = coreRef.current
        if (core) {
            core.move(0, movement)
            rerender()
        }
        return () => {
            clearInterval(interval)
        }
    }, [time])

    const preview = useMemo(() => (
        <div className="preview">
            <Preview
                queue={status ? coreRef.current!.queue : [null, null, null, null, null]}
            />
        </div>
    ), [coreRef.current?.mino])

    const hold = useMemo(() => {
        let board = new Board(5, 5)
        if(coreRef.current?.hold){
            coreRef.current!.hold.centerBoard(5, 5)
            board = board.merge(coreRef.current!.hold)!
        }
        return <div className="preview">
            <div className="container">
                <div className="element">
                    <Playfield board={board} multiplier={40} />
                </div>
            </div>
        </div>
    }, [coreRef.current?.mino])

    return (
        <div ref={gameRef}>
            <div className="game">
                {hold}
                <div className="board">
                    <Score points={status ? coreRef.current!.score : 0} />
                    <Playfield
                        board={!status ? new Board(10, 20) : coreRef.current!.board ?? coreRef.current!.backup}
                        multiplier={50}
                    />
                    {show && (
                    <div className="warning focus">Board not on focus</div>
                    )}
                    {status && !coreRef.current!.board && (
                    <div className="warning end">Game Over</div>
                    )}
                </div>
                {preview}
            </div>
        </div>
    )
}
