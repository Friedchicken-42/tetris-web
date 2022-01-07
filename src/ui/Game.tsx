import { useEffect, useCallback, useRef } from 'react'
import { Playfield } from './Playfield'
import { Core } from '../logic/Core'

export const Game = () => {
    let core = new Core(10, 20)
    const gameRef = useRef<HTMLDivElement>(null)

    const handleKey = useCallback((event: KeyboardEvent) => {
        console.log(event.key)
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
