import { Point, Polygon } from 'intersection'
import { Vector3 } from './Vector3'
import { Block } from './Block'
import { Color, hexToRGB } from './Color'

class Mino {
    name: string;

    blocks: Block[];

    center: Point;

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
    }
    
    getContainer(): Point {
        const container = this.blocks.reduce(( prev, block) => {
            let x = block.polygon.center.x + .5
            let y = block.polygon.center.y + .5
            x = x > prev.x ? x : prev.x
            y = y > prev.y ? y : prev.y
            return new Point(x, y)
        }, new Point(0, 0))

        return container
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
}
        
export { Mino }
