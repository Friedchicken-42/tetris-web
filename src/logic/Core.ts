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

export type MinoJSON = {
    name: string;
    blocks: [number, number, number][];
    center: number[];
    color: string;
}

class Core {
    width: number
    height: number;
    _board: Board;
    board: Board;
    pieces: MinoJSON[] 
    queue: Mino[];
    queueLimit: number;
    mino: Mino;

    constructor(width: number, height: number, pieces: MinoJSON[]) {
        this.width = width
        this.height = height
        this._board = new Board(width, height)
        this.board = this._board

        this.pieces = pieces

        this.queueLimit = 10
        let queue = []
        while(queue.length <= this.queueLimit){
            queue.push(...this.newBag())
        }
        this.queue = queue as Mino[]
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

    newBag(): Mino[] {
        let bag: Mino[] = []
        
        for(const { name, blocks, center, color } of this.pieces){
            bag.push(new Mino(
                name,
                blocks.map(([x, y, z]) => new Vector3(x, y, z)),
                center,
                color
            ))
        }

        bag.sort((_, __) => Math.random() * 2 - 1)

        return bag
    }

    copyBoard(): Board {
        let board = new Board(this.width, this.height)
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width + 1; j++){
                board.cells[i][j].area = this._board.cells[i][j].area;
                board.cells[i][j].color = this._board.cells[i][j].color;
            }
        }
        return board
    }

    getNeighbors(block: Block): Point[] {
        const neighbors: Point[] = []
        const center = block.polygon.center;

        for (let y of [-1, 0, 1]){
            for (let x of [-1, 0, 1]){
                const point = new Point(Math.round(center.x - .5) + x, Math.round(center.y - .5) + y)
                if (
                    point.x >= -1 && point.x <= this.width &&
                    point.y >= 0 && point.y <= this.height
                ) {
                    neighbors.push(point)
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

            for(const { x, y } of neighbors){
                const cell = board.cells[y][x + 1]
                const area = cell.intersect(block)
                if (area === 0) continue;
                if (cell.area + area > 1) {
                    error = true
                    continue
                }
                cell.area += area
                cell.area = Math.round(cell.area * 10) / 10
                cell.setColor(this.mino.color)
            }
        }
        return !error ? board : null
    }

    tryAction(action: () => void, rollback: () => void): boolean {
        action()
        this.mino.round()
        const newBoard = this.merge()
        if (newBoard) {
            this.board = newBoard
            return true
        } else {
            rollback()
        }
        return false
    }

    move(x: number, y: number) {
        this.tryAction(
            () => this.mino.move(x, y),
            () => this.mino.move(-x, -y)
        )
    }

    rotate(angle: number) {
        this.tryAction(
            () => this.mino.rotate(angle),
            () => this.mino.rotate(-angle)
        )
    }

    harddrop(offset: number) {
        while(
            this.tryAction(
                () => this.mino.move(0, offset),
                () => this.mino.move(0, -offset)
            )
        ){}
        this.place()
    }

    place() {
        this._board = this.board
        this.mino = this.nextMino()
        this.mino.move(1, 1)
        this.board = this.merge()!
    }
}

export { Core, Board, Cell };
