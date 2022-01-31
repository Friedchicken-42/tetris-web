import React, { useEffect, useState, useRef } from 'react'
import { Board, Cell } from '../logic/Core'
import { RGBToHex } from '../logic/Color'
import { windowDimension } from './Dimension'

type PlayfieldProps = {
    board: Board
    multiplier: number
}

export function Playfield({ board, multiplier }: PlayfieldProps) {
    const lineWidth = 1

    const [time, setTime] = useState(Date.now())
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { height } = windowDimension();
    const multi = multiplier === 0
        ? (height - 200) / board.height
        : multiplier
    
    const drawCell = (ctx: any, cell: Cell) => {
        const { position, color, area } = cell

        const hex = RGBToHex(color)
        const alpha = Math.round(area * 255).toString(16)

        ctx.fillStyle = area === 0 ? '#111' : hex + alpha;

        ctx.fillRect(
            position.x * multi + lineWidth,
            position.y * multi + lineWidth,
            multi - lineWidth * 2,
            multi - lineWidth * 2
        )

        /*
        ctx.fillStyle = '#fff'
        ctx.font = '18px Arial'
        ctx.fillText(area, (position.x + .4) * multiplier, (position.y + .5) * multiplier)
        */
    }

    const draw = () => {
        if (!canvasRef.current) return
        if (!board) return
        const canvas: HTMLCanvasElement = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        board.cells.forEach((cells: Cell[]) => {
            cells.forEach((cell: Cell) => {
                drawCell(ctx, cell)
            })
        })
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 50);
        draw()
        return () => {
            clearInterval(interval)
        }
    }, [time])

    return <div className="playfield">
        {/* eslint-disable-next-line */}
        <canvas ref={canvasRef} width={board.width * multi} height={board.height * multi} tabIndex={1}/>
    </div>
}
