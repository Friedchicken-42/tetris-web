import { Point, Polygon } from 'intersection'
import { Block } from './Block'
import { Color, hexToRGB, blend } from './Color'

class Cell {
    polygon: Polygon;
    position: Point;
    color: Color | null;
    area: number;

    constructor(x: number, y: number, area: number){
        this.polygon = new Polygon([
            new Point(x, y),
            new Point(x + 1, y),
            new Point(x + 1, y + 1),
            new Point(x, y + 1)
        ])
        this.position = new Point(x, y)
        this.color = null
        this.area = area
    }

    intersect(block: Block): number {
        const intersection = this.polygon.intersectPoly(block.polygon)
        if (!intersection) return 0;
        let area = intersection.area() * block.density;
        return area;
    }


    setColor(color: Color) {
        if(this.area === 0) return 
        this.color = this.color ? blend(this.color, color) : color
    }
}

export { Cell }
