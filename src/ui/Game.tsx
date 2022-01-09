import { useEffect, useCallback, useRef, useState } from 'react'
import { Playfield } from './Playfield'
import { Core, MinoJSON } from '../logic/Core'

export const Game = () => {
    const coreRef = useRef<Core>()
    const [_, done] = useState<boolean>(false)

    useEffect(() => {
        const init = async () => {
            let pieces: MinoJSON[] = await fetch(process.env.PUBLIC_URL + '/pieces.json')
                .then(data => data.json())
            coreRef.current = new Core(10, 20, pieces)
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
                core?.move(0, 1)
            },
            'z': () => {
                core?.rotate(Math.PI / 4)
            },
            'x': () => {
                core?.rotate(-Math.PI / 4)
            },
            ' ': () => {
                core?.place()
            },
            'd': () => {
                console.log(core?.mino)
                console.log(core?.board)
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
            {coreRef.current
                ? <Playfield core={coreRef.current}/>
                : <div>Loading pieces</div>
            }
        </div>
    )
}
