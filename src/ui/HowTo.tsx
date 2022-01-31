import React from 'react'
import { Board } from '../logic/Board'
import { Playfield } from './Playfield'
import store from '../store'
import { Mino } from '../logic/Mino'
import { MinoJSON } from '../logic/Core'
import { Vector3 } from '../logic/Vector3'
import './HowTo.css'

function createMino({ name, blocks, center, color }: MinoJSON): Mino {
    return new Mino(
        name,
        blocks.map(([x, y, z]) => new Vector3(x, y, z)),
        center,
        color
    )
}

type BeforeAfterProps = {
    mino: MinoJSON
    callback: (mino: Mino) => void
    text: string
}

function BeforeAfter({ mino, callback, text }: BeforeAfterProps) {
    const m1 = createMino(mino)
    let before = new Board(5, 5)
    before = before.merge(m1)!
    
    const m2 = createMino(mino)
    callback(m2)
    let after = new Board(5, 5)
    after = after.merge(m2)!
    return <div className="example">
        <div className="example-container">
            <Playfield board={before} multiplier={18} />
            <div className="example-arrow">{'=>'}</div>
            <Playfield board={after} multiplier={18} />
        </div>
        <div className="example-text">{text}</div>
    </div>
}

export function HowTo() {
    const { setPage } = store.state

    const T: MinoJSON = {
        name: "T",
        blocks: [[2, 1, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1]],
        center: [2, 2],
        color: "#ff00ff"
    }
    const move = (mino: Mino) => mino.move(.5, 0)
    const rotate = (mino: Mino) => mino.rotate(Math.PI / 4)

    return <div>
        <h1>How This Works</h1>
        <h3>Standard tetris rules applies</h3>
        <h2>Differences</h2>
        <div>
            <h3>Inputs</h3>
            <div>Movement and Rotation change how the pieces interact</div>
            <div>Threshold is how much a line need to be filled before can be removed</div>
        </div>
        <div>
            <h3>Fading</h3>
            <div>The alpha describes how much a specific square on the board is filled</div>
            <div>Standard pieces normally fill a square completely</div>
            <div>But by moving a piece half a unit we fill some square only by 50%,</div>
            <div>so that we need to fill those square with another piece to completely fill them</div>
        </div>
        <div>
            <h3>Example</h3>
            <BeforeAfter mino={T} callback={move} text="After a half block translation to the right"/>
            <BeforeAfter mino={T} callback={rotate} text="After a 45 degree clockwise rotation"/>
        </div>

        <button type="button" onClick={() => setPage('menu')}>
            Back 
        </button>
    </div>
}

