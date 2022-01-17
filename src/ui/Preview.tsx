import React from 'react'
import { Playfield } from './Playfield'
import { Mino } from '../logic/Mino'
import { Board } from '../logic/Board'

type PreviewProps = {
    queue: Mino[]
}

export function Preview({ queue }: PreviewProps) {
    return (
        <div>
        {queue.slice(0, 5).map((mino: Mino, idx: number) => {
            let board = new Board(6, 6)
            board = board.merge(mino)!
            /* eslint-disable-next-line */
            return <Playfield key={idx} board={board} multiplier={20} />
        })}
        </div>
    )
}
