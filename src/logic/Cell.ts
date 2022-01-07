import { Point, Polygon } from 'intersection'

class Cell {
    polygon: Polygon;
    position: Point;
    color: string;
    area: number;

    constructor(x: number, y: number, area: number){
        this.polygon = new Polygon([
            new Point(x, y),
            new Point(x + 1, y),
            new Point(x + 1, y + 1),
            new Point(x, y + 1)
        ])
        this.position = new Point(x, y)
        this.color = '#000'
        this.area = area
    }
}

export { Cell }
