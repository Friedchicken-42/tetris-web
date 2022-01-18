import { Point } from 'intersection'
import { Cell } from './Cell'
import { Block } from './Block'
import { Mino } from './Mino'

class Board {
    width: number

    height: number

    cells: Cell[][];

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.cells = []
        for(let i = 0; i < height + 1; i += 1){
            this.cells.push([])
            for(let j = -1; j < width + 1; j += 1){
                const density = (i === height || j === -1 || j === width) ? 1 : 0;
                this.cells[i].push(new Cell(j, i, density));
            }
        }
    }

    copy(): Board {
        const board = new Board(this.width, this.height)
        for(let i = 0; i < this.height; i += 1){
            for(let j = 0; j < this.width + 1; j += 1){
                board.cells[i][j].area = this.cells[i][j].area;
                board.cells[i][j].color = this.cells[i][j].color;
            }
        }
        return board
    }

    getNeighbors(block: Block): Point[] {
        const neighbors: Point[] = []
        const { center } = block.polygon;

        for (const y of [-1, 0, 1]){
            for (const x of [-1, 0, 1]){
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

    merge(mino: Mino): Board | null {
        const board = this.copy()
        let error = false;
        for (const block of mino.blocks) {
            const neighbors = this.getNeighbors(block)

            for(const { x, y } of neighbors){
                const cell = board.cells[y][x + 1]
                const area = cell.intersect(block)
                if (area === 0) continue;
                if (cell.area + area > 1) {
                    error = true
                    break
                }
                cell.area += area
                // cell.area = Math.round(cell.area * 20) / 20
                cell.setColor(mino.color)
            }
        }
        return !error ? board : null
    }

    clearLines(threshold: number): number {
        let lines = 0

        for(let i = 0; i < this.height; i += 1) {
            let total = this.cells[i].reduce((prev: number, cell: Cell) => prev + cell.area, 0)
            total -= 2

            if (total < threshold * this.width) continue;

            lines += 1

            for (let j = i; j > 0; j -= 1) {
                this.cells[j] = this.cells[j - 1]
            }

            this.cells[0] = this.cells[0].map(
                (_, idx: number) => new Cell(idx - 1, 0, (idx === 0 || idx === this.width + 1) ? 1 : 0)
            )
        }
        return lines
    }
}

export { Board }
