import { useEffect, useState, useRef, useCallback } from 'react'
import { Core, Board, Cell } from '../logic/Core'
import { RGBToHex } from '../logic/Color'

type PlayfieldProps = {
    core: Core;
}

export const Playfield = ({ core }: PlayfieldProps) => {
    const multiplier = 50
    const lineWidth = 1

    const [time, setTime] = useState(Date.now())
    const canvasRef = useRef<HTMLCanvasElement>(null)

/*
    useEffect(() => {
        setTimeout(() => {
            draw(core.merge())
        }, 500)
    }, [])
    */

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 50);
        if (core) draw(core.board)
        console.log('redraw')
        return () => {
            clearInterval(interval)
        }
    }, [time])
    
    const drawCell = (ctx: any, cell: Cell) => {
        const { position, color, area } = cell

        ctx.fillStyle = '#000'

        ctx.fillRect(
            position.x * multiplier,
            position.y * multiplier,
            multiplier,
            multiplier
        )
        
        const hex = RGBToHex(color)
        const alpha = Math.round(area * 255).toString(16)

        ctx.fillStyle = area === 0 ? '#111' : hex + alpha;

        ctx.fillRect(
            position.x * multiplier + lineWidth,
            position.y * multiplier + lineWidth,
            multiplier - lineWidth * 2,
            multiplier - lineWidth * 2
        )

        ctx.fillStyle = '#fff'
        ctx.font = '18px Arial'
        ctx.fillText(area, (position.x + .4) * multiplier, (position.y + .5) * multiplier)
    }

    const draw = (board: Board) => {
        if (!canvasRef.current) return
        const canvas: HTMLCanvasElement = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineWidth = 0

        board.cells.forEach((cells: Cell[]) => {
            cells.forEach((cell: Cell) => {
                drawCell(ctx, cell)
            })
        })
    }

    return <canvas ref={canvasRef} width={core.width * multiplier} height={core.height * multiplier} tabIndex={1}/>
}
