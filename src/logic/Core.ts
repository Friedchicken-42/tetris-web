import { Point } from 'intersection'
import { Vector3 } from './Vector3'
import { Mino, Block } from './Mino'
import { Cell } from './Cell'

class Field {
    cells: Cell[][];

    constructor(width: number, height: number) {
        this.cells = []
        for(let i = 0; i < height + 1; i++){
            this.cells.push([])
            for(let j = -1; j < width + 1; j++){
                const density = (i === height || j === -1 || j === width) ? 1 : 0;
                this.cells[i].push(new Cell(j, i, density));
            }
        }
    }
}

type MinoJSON = {
    name: string;
    blocks: [number, number, number][];
    center: number[];
    color: string;
}

type ArrayLeastOne<T> = [T, ...T[]];

class Core {
    width: number;
    height: number;
    field: Field;
    pieces: ArrayLeastOne<MinoJSON>;
    queue: ArrayLeastOne<Mino>;
    queueLimit: number;
    current: Mino;

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.field = new Field(width, height)

        this.pieces = [{
            name: 'I',
            blocks: [[0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1]],
            center: [2, 0],
            color: 'ff8000'
        }]

        this.queueLimit = 10
        let queue = []
        while(queue.length <= this.queueLimit){
            queue.push(...this.newBag())
        }
        this.queue = queue as ArrayLeastOne<Mino>
        console.log(this.queue)

        this.current = this.nextMino()
        this.current.move(4, 0)
        console.log(this.current)
    }

    nextMino(): Mino {
        if (this.queue.length <= this.queueLimit || this.queue.length <= 0) this.queue.push(...this.newBag());
        return this.queue.shift()!
    }

    newBag(): ArrayLeastOne<Mino> {
        let bag: Mino[] = []
        
        for(const { name, blocks, center, color } of this.pieces){
            bag.push(new Mino(
                name,
                blocks.map(([x, y, z]) => new Vector3(x, y, z)),
                new Point(center[0], center[1]),
                color
            ))
        }

        bag.sort((_, __) => Math.random() * 2 - 1)

        return bag as ArrayLeastOne<Mino>
    }

    copyField(): Field {
        let board = new Field(this.width, this.height)
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                board.cells[i][j].area = this.field.cells[i][j].area;
                board.cells[i][j].color = this.field.cells[i][j].color;
            }
        }
        return board
    }

    getNeighborsBlock(block: Block): Set<Point> {
        const neighbors = new Set<Point>()
        const center = block.polygon.center;

        for (let y of [-1, 0, 1]){
            for (let x of [-1, 0, 1]){
                const point = new Point(Math.round(center.x) + x, Math.round(center.y) + y)
                if (
                    point.x >= -1 && point.x <= this.width &&
                    point.y >= 0 && point.y <= this.height
                ) neighbors.add(point)
            }
        }
        return neighbors
    }

    getNeighbors(): Set<Point> {
        let neighbors = new Set<Point>()

        for (const block of this.current.blocks) {
            this.getNeighborsBlock(block)
                .forEach((point: Point) => neighbors.add(point))
        }

        return neighbors
    }

    merge() {
        let board = this.copyField()
        let neighbors = this.getNeighbors()
        // set broken with object -> map
        console.log(neighbors)

        return board
    }
}

export { Core, Field, Cell };
