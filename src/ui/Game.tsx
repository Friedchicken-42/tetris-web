import React, { useEffect, useCallback, useRef, useState } from 'react'
import { Playfield } from './Playfield'
import { Preview } from './Preview'
import { Core, MinoJSON } from '../logic/Core'
import { Board } from '../logic/Board'

export function Game() {
    const coreRef = useRef<Core>()
    const [board, setBoard] = useState<Board>()
    const [status, done] = useState<boolean>(false)

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
        const mapping: { [key: string]: () => void } = {
            'ArrowRight': () => {
                core?.move(.5, 0)
            },
            'ArrowLeft': () => {
                core?.move(-.5, 0)
            },
            'ArrowDown': () => {
                core?.move(0, .5)
            },
            'z': () => {
                core?.rotate(Math.PI / 4)
            },
            'x': () => {
                core?.rotate(-Math.PI / 4)
            },
            ' ': () => {
                core?.harddrop(.5)
            },
            'd': () => {
                console.log(core?.mino)
                console.log(core?.board)
            },
        }

        mapping[event.key]?.()
        setBoard(core?.board)
    }, [])

    useEffect(() => {
        if (!gameRef.current) return undefined
        const div: HTMLDivElement = gameRef.current
        div.addEventListener('keydown', handleKey)
        return () => {
            div.removeEventListener('keydown', handleKey)
        }
    }, [handleKey])


    return (
        <div ref={gameRef}>
            {!status
                ? <div>Loading pieces</div>
                : <div>
                    <Playfield board={board!} multiplier={50} />
                    <Preview queue={coreRef.current!.queue} />
                </div>
            }
        </div>
    )
}
