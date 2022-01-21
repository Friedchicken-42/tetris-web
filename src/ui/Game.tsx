import React, { useEffect, useCallback, useRef, useState } from 'react'
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
    const [board, setBoard] = useState<Board>()
    const [points, setPoints] = useState<number>(0)
    const [status, done] = useState<boolean>(false)
    const [time, setTime] = useState(Date.now())

    useEffect(() => {
        const init = async () => {
            const pieces: MinoJSON[] = await fetch(`${process.env.PUBLIC_URL  }/pieces.json`)
                .then(data => data.json())
            coreRef.current = new Core(10, 20, pieces)
            setBoard(coreRef.current.board)
            done(true)
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
            ' ': () => {
                core?.harddrop(movement)
            },
        }

        mapping[event.key]?.()
        setBoard(core?.board)
        setPoints(core?.score!)
    }, [])

    store.subscribe(() => {
        if (!coreRef.current) return;
        coreRef.current.setThreshold(store.getState().input.threshold)
    })

    useEffect(() => {
        if (!gameRef.current) return undefined
        const div: HTMLDivElement = gameRef.current
        div.addEventListener('keydown', handleKey)
        return () => {
            div.removeEventListener('keydown', handleKey)
        }
    }, [handleKey])

    useEffect(() => {
        const { movement } = store.getState().input
        const interval = setInterval(() => setTime(Date.now()), 400 * movement);
        const core = coreRef.current
        if (core) {
            core.move(0, movement)
            setBoard(core.board)
            setPoints(core.score!)
            if (!board) clearInterval(interval)
        }
        return () => {
            clearInterval(interval)
        }
    }, [time])

    return (
        <div ref={gameRef}>
            {!status
                ? <div className="game">
                    <div>
                    <Score points={0} />
                    <Playfield board={new Board(10, 20)} multiplier={50} />
                    </div>
                    <div className="preview">
                        <Preview queue={[null, null, null, null, null]} />
                    </div>
                </div>
                : <div className="game">
                    <div>
                        <Score points={points!} />
                        <Playfield board={board ?? coreRef.current?.backup!} multiplier={50} />
                    </div>
                    <div className="preview">
                        <Preview queue={coreRef.current!.queue} />
                    </div>
                </div>
            }
        </div>
    )
}
