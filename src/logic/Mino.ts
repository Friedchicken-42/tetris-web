import { Vector3 } from './Vector3'
import { Point, Polygon } from 'intersection'
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
        for (let i = 0; i < this.blocks.length; i++){
            this.blocks[i].polygon.translate(x, y)
        }
        this.center.translate(x, y)
    }

    rotate(angle: number) {
        for (let i = 0; i < this.blocks.length; i++){
            this.blocks[i].polygon.rotateFromPoint(angle, this.center)
        }
    }

    round() {
        for (let i = 0; i < this.blocks.length; i++){
            const polygon = this.blocks[i].polygon
            for (let j = 0; j < polygon.points.length; j++) {
                polygon.points[j].x = Math.round(polygon.points[j].x * 10) / 10
                polygon.points[j].y = Math.round(polygon.points[j].y * 10) / 10
            }
            polygon.setCenter()
        }
    }
}
        
export { Mino, Block }
