import { Polygon } from 'intersection'

class Block {
    polygon: Polygon;
    density: number;

    constructor(polygon: Polygon, density: number) {
        this.polygon = polygon
        this.density = density
    }
}

export { Block }
