import { Point } from 'intersection'
import { Vector3 } from './Vector3'
import { Mino, Block } from './Mino'
import { Cell } from './Cell'

class Board {
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
    width: number
    height: number;
    _board: Board;
    board: Board;
    pieces: ArrayLeastOne<MinoJSON>;
    queue: ArrayLeastOne<Mino>;
    queueLimit: number;
    mino: Mino;

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this._board = new Board(width, height)
        this.board = this._board

        this.pieces = [{
            name: 'I',
            blocks: [[0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1]],
            center: [2, 0],
            color: '00ffff'
        }]

        this.queueLimit = 10
        let queue = []
        while(queue.length <= this.queueLimit){
            queue.push(...this.newBag())
        }
        this.queue = queue as ArrayLeastOne<Mino>
        console.log(this.queue)

        this.mino = this.nextMino()
        // temp
        this.mino.move(3, 7)
        this.board = this.merge()!
        console.log(this.mino)
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
                new Point(center[0] + .5, center[1] + .5),
                color
            ))
        }

        bag.sort((_, __) => Math.random() * 2 - 1)

        return bag as ArrayLeastOne<Mino>
    }

    copyBoard(): Board {
        let board = new Board(this.width, this.height)
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                board.cells[i][j].area = this._board.cells[i][j].area;
                board.cells[i][j].color = this._board.cells[i][j].color;
            }
        }
        return board
    }

    getNeighbors(block: Block): Map<string, Point> {
        const neighbors = new Map<string, Point>()
        const center = block.polygon.center;

        for (let y of [-1, 0, 1]){
            for (let x of [-1, 0, 1]){
                const point = new Point(Math.round(center.x - .5) + x, Math.round(center.y - .5) + y)
                if (
                    point.x >= -1 && point.x <= this.width &&
                    point.y >= 0 && point.y <= this.height
                ) {
                    const key = '' + point.y + '-' + point.x
                    neighbors.set(key, point)
                }
            }
        }
        return neighbors
    }

    merge(): Board | null {
        let board = this.copyBoard()
        let error = false;
        for (const block of this.mino.blocks) {
            let neighbors = this.getNeighbors(block)

            for(const { x, y } of Array.from(neighbors.values())){
                const cell = board.cells[y][x + 1]
                error ||= cell.intersect(block)
                cell.setColor(this.mino.color)
            }
        }
        return !error ? board : null
    }

    move(x: number, y: number) {
        this.mino.move(x, y)
        const newBoard = this.merge()
        if (newBoard) {
            this.board = newBoard
        } else {
            this.mino.move(-x, -y)
        }
    }

    rotate(angle: number) {
        this.mino.rotate(angle)
        const newBoard = this.merge()
        if (newBoard) {
            this.board = newBoard
        } else {
            this.mino.rotate(-angle)
        }
    }

    place() {
        this._board = this.board;
        this.mino = this.nextMino()
        this.merge()
    }
}

export { Core, Board, Cell };
