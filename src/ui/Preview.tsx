import React from 'react'
import { Playfield } from './Playfield'
import { Mino } from '../logic/Mino'
import { Board } from '../logic/Board'
import './preview.css'

type PreviewProps = {
    queue: Mino[]
}

export function Preview({ queue }: PreviewProps) {
    return (
        <div className="container">
        {queue.slice(0, 5).map((mino: Mino, idx: number) => {
            let board = new Board(5, 5)
            board = board.merge(mino)!
            const multiplier = 20 * (idx === 0 ? 1.5 : 1)
            /* eslint-disable-next-line */
            return <div key={idx} className="element">
                <Playfield board={board} multiplier={multiplier} />
            </div>
        })}
        </div>
    )
}
