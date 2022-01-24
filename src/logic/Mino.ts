import { Point, Polygon } from 'intersection'
import { Vector3 } from './Vector3'
import { Block } from './Block'
import { Color, hexToRGB } from './Color'

type Container = {
    start: Point
    end: Point
}

class Mino {
    name: string;

    blocks: Block[];

    center: Point;

    rotation: number;

    color: Color;

    constructor(name: string, coords: Vector3[], center: number[] | null, color: string) {
        this.name = name;
        this.color = hexToRGB(color);
        this.blocks = []
        for (const { x, y, z } of coords) {
            const square = new Polygon([
                new Point(x, y),
                new Point(x + 1, y),
                new Point(x + 1, y + 1),
                new Point(x, y + 1)
            ])
            this.blocks.push(new Block(square, z))
        }

        this.rotation = 0

        if (center) {
            this.center = new Point(center[0] + .5, center[1] + .5)
        } else {
            const centers = this.blocks.map((block: Block) => block.polygon.center)
            this.center = new Polygon(centers).center
        }
    }
    
    move(x: number, y: number) {
        for (let i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].polygon.translate(x, y)
        }
        this.center.translate(x, y)
    }

    rotate(angle: number) {
        for (let i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].polygon.rotateFromPoint(angle, this.center)
        }
        this.rotation = (this.rotation + angle) % (Math.PI * 2)
    }
    
    container(): Container {
        const end = this.blocks.reduce(( prev, block) => {
            let { x, y } = block.polygon.center
            x += .5
            y += .5
            x = x > prev.x ? x : prev.x
            y = y > prev.y ? y : prev.y
            return new Point(x, y)
        }, this.blocks[0].polygon.points[0])

        const start = this.blocks.reduce(( prev, block) => {
            let { x, y } = block.polygon.center
            x -= .5
            y -= .5
            x = x < prev.x ? x : prev.x
            y = y < prev.y ? y : prev.y
            return new Point(x, y)
        }, this.blocks[0].polygon.points[0])

        return { start, end }
    }

    round() {
        for (let i = 0; i < this.blocks.length; i += 1) {
            const {polygon} = this.blocks[i]
            for (let j = 0; j < polygon.points.length; j += 1) {
                this.blocks[i].polygon.points[j].x = Math.round(polygon.points[j].x * 10) / 10
                this.blocks[i].polygon.points[j].y = Math.round(polygon.points[j].y * 10) / 10
            }
            polygon.setCenter()
        }
    }

    centerBoard(boardWidth: number, boardHeight: number) {
        const { start, end } = this.container() 
        const width = end.x - start.x
        const resw = boardWidth / 2 - width / 2
        const offX = resw - start.x

        const height = end.y - start.y
        const resh = boardHeight / 2 - height / 2
        let offY = resh - start.y
        offY = boardHeight === 0 ? 0 : offY

        this.move(offX, offY)
    }
}
        
export { Mino }
