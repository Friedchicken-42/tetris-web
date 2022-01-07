import { Vector3 } from './Vector3'
import { Point, Polygon } from 'intersection'

class Block {
    polygon: Polygon;
    density: number;

    constructor(polygon: Polygon, density: number) {
        this.polygon = polygon
        this.density = density
    }
}

class Mino {
    name: string;
    blocks: Block[];
    center: Point;
    color: string;

    constructor(name: string, coords: Vector3[], center: Point | null, color: string) {
        this.name = name;
        this.color = color;
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
            this.center = center
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
}
        
export { Mino, Block }
