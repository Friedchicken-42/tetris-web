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
        console.log(this.queue)

        this.mino = this.nextMino()
        // temp
        this.mino.move(3, 7)
        this.board = this.board.merge(this.mino)!
        console.log(this.mino)
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
        // this.mino.round()
        const newBoard = this.backup.merge(this.mino)
        if (newBoard) {
            this.board = newBoard
            return true
        } 
            rollback()
        
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
        );
        this.place()
    }

    place() {
        this.backup = this.board
        this.mino = this.nextMino()
        this.mino.move(1, 1)
        this.board = this.board.merge(this.mino)!
    }
}

export { Core, Board, Cell };
