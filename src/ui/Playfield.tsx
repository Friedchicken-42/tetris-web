import { useEffect, useState, useRef, useCallback } from 'react'
import { Core, Field, Cell } from '../logic/Core'

type PlayfieldProps = {
    core: Core;
}

export const Playfield = ({ core }: PlayfieldProps) => {
    const multiplier = 50
    const lineWidth = 1

    const [time, setTime] = useState(Date.now())
    const canvasRef = useRef<HTMLCanvasElement>(null)

    setTimeout(() => {

        draw(core.merge())
    }, 500)
/*
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 200);
        if (core) draw(core.field)
        console.log('redraw')
        return () => {
            clearInterval(interval)
        }
    }, [time])
*/
    const drawCell = (ctx: any, cell: Cell) => {
        const { position, color } = cell

        ctx.fillStyle = '#000'

        ctx.fillRect(
            position.x * multiplier,
            position.y * multiplier,
            multiplier,
            multiplier
        )

        ctx.fillStyle = cell.area === 0 ? '#111' : color;

        ctx.fillRect(
            position.x * multiplier + lineWidth,
            position.y * multiplier + lineWidth,
            multiplier - lineWidth * 2,
            multiplier - lineWidth * 2
        )
    }

    const draw = (field: Field) => {
        if (!canvasRef.current) return
        const canvas: HTMLCanvasElement = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineWidth = 0

        field.cells.forEach((cells: Cell[]) => {
            cells.forEach((cell: Cell) => {
                drawCell(ctx, cell)
            })
        })
    }

    return <canvas ref={canvasRef} width={core.width * multiplier} height={core.height * multiplier} tabIndex={1}/>
}
