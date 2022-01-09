import { useEffect, useCallback, useRef } from 'react'
import { Playfield } from './Playfield'
import { Core } from '../logic/Core'

export const Game = () => {
    let core = new Core(10, 20)
    const gameRef = useRef<HTMLDivElement>(null)

    const handleKey = useCallback((event: KeyboardEvent) => {
        const mapping: { [key: string]: () => void } = {
            'ArrowRight': () => {
                core.move(.5, 0)
            },
            'ArrowLeft': () => {
                core.move(-.5, 0)
            },
            'ArrowDown': () => {
                core.move(0, 1)
            },
            'z': () => {
                core.rotate(Math.PI / 4)
            },
            'x': () => {
                core.rotate(-Math.PI / 4)
            },
            ' ': () => {
                core.place()
            },
            'd': () => {
                console.log(core.mino)
                console.log(core.board)
            },
        }

        mapping[event.key]?.()
    }, [])

    useEffect(() => {
        if (!gameRef.current) return
        const div: HTMLDivElement = gameRef.current
        div.addEventListener('keydown', handleKey)
        return () => {
            div.removeEventListener('keydown', handleKey)
        }
    }, [handleKey])

    return (
        <div ref={gameRef}>
            <Playfield core={core}/>
        </div>
    )
}
