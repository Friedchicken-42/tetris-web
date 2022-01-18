import { Vector3 } from './Vector3'
import { Mino } from './Mino'
import { Cell } from './Cell'
import { Board } from './Board'

export type MinoJSON = {
    name: string;
    blocks: [number, number, number][];
    center: number[];
    color: string;
}

class Core {
    width: number

    height: number;

    backup: Board;

    board: Board;

    pieces: MinoJSON[]
 
    queue: Mino[];

    queueLimit: number;

    mino: Mino;

    threshold: number;

    score: number;

    lock: number;
    
    constructor(width: number, height: number, pieces: MinoJSON[]) {
        this.width = width
        this.height = height
        this.backup = new Board(width, height)
        this.board = this.backup

        this.pieces = pieces

        this.queueLimit = 10
        const queue = []
        while(queue.length <= this.queueLimit){
            queue.push(...this.newBag())
        }
        this.queue = queue as Mino[]

        this.mino = this.nextMino()

        this.board = this.board.merge(this.mino)!

        this.threshold = 1
        this.score = 0
        this.lock = 0
    }

    nextMino(): Mino {
        if (this.queue.length <= this.queueLimit || this.queue.length <= 0) this.queue.push(...this.newBag());
        return this.queue.shift()!
    }

    newBag(): Mino[] {
        const bag: Mino[] = []
        
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

    tryAction(action: () => void, rollback: () => void): boolean {
        action()

        const newBoard = this.backup.merge(this.mino)
        if (newBoard) {
            this.board = newBoard
            return true
        } 
        rollback()
        
        return false
    }

    move(x: number, y: number) {
        const status = this.tryAction(
            () => this.mino.move(x, y),
            () => this.mino.move(-x, -y)
        )

        if (y > 0 && !status) {
            this.lock += 1
            if (this.lock > 10) this.place();
        }
        console.log(this.lock)
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
        );
        this.place()
    }

    clearLines() {
        const lines = this.board.clearLines(this.threshold)
        const points = lines ** 2 * 100
        this.score += points
    }

    place() {
        this.lock = 0
        this.backup = this.board
        this.clearLines()
        this.mino = this.nextMino()
        this.mino.move(1, 1)
        this.board = this.board.merge(this.mino)!
    }
}

export { Core, Board, Cell };
