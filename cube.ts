let ORDER: number = 3
enum Color {White, Red, Blue, Orange, Green, Yellow}
enum CubeHorFace {Front, Right, Back, Left}
enum CubeVerFace {Front, Bottom, Back, Top}
enum Direction {
    CW, // 顺时针
    CCW // 逆时针
}
interface SurfaceData extends Array<Color[]> {
    [index: number]: Color[]
}

class Surface {
    public name: string;
    public data: SurfaceData;
    constructor (color: Color,public order: number = ORDER) {
        this.name = Color[color]
        this.initColor(color)
    }

    initColor (color: Color): void {
        this.data = Array(this.order)
        for (let i = 0; i < this.order; i++) {
            this.setRowColorData(i, color)
        }
    }
    setRowColorData (rowIndex: number, colors: Color[] | Color): void {
        if (Array.isArray(colors)) {
            this.data[rowIndex] = colors
        } else {
            this.data[rowIndex] = Array(this.order).fill(null).map(() => colors)
        }
    };

    setColumnColorData (colIndex: number, colors: Color[]): void {
        colors.forEach((color, i) => {
            this.data[i][colIndex] = colors[i]
        })
    }

    getRowColor (rowIndex: number): Color[] {
        return this.data[rowIndex]
    }

    getColumnColor (colIndex: number): Color[] {
        return Array(this.order).fill(null).map((e, index) => {
            return this.data[index][colIndex]
        })
    }

    clone (): Surface {
        const cloneFace = new Surface(Color[this.name], this.order)
        cloneFace.data = JSON.parse(JSON.stringify(this.data))
        return cloneFace
    }
    
    rotate (dir: Direction): void {
        if (dir === Direction.CW) {
            this.data =  Array(this.order).fill(null).map((e, index) => this.getColumnColor(this.order - index - 1).reverse()).reverse()
        } else {
            this.data =  Array(this.order).fill(null).map((e, index) => this.getColumnColor(this.order - index - 1))
        }
    }

    consoleColor (): void {
        console.log(`======Surface【${this.name}】=======`)
        this.data.forEach(row => {
            console.log(row.map(color => {
                return Color[color]
            }))
        })
        console.log(`==========-----===========`)
        console.log('')
    }
}

class Cube {
    public horFace: Surface[]
    public vertFace: Surface[]
    constructor (public order: number = ORDER) {
        this.createSurface()
    }

    get top (): Surface {
        return this.horFace[CubeVerFace.Top]
    }
    get bottom (): Surface {
        return this.horFace[CubeVerFace.Bottom]
    }
    get front (): Surface {
        return this.horFace[CubeVerFace.Front]
    }
    get back (): Surface {
        return this.horFace[CubeVerFace.Back]
    }
    get left (): Surface {
        return this.vertFace[CubeHorFace.Left]
    }
    get right (): Surface {
        return this.vertFace[CubeHorFace.Right]
    }

    createSurface (): void {
        const front = new Surface(Color.Red, this.order)
        const back = new Surface(Color.Orange, this.order)
        const top = new Surface(Color.Yellow, this.order)
        const left = new Surface(Color.Blue, this.order)
        const bottom = new Surface(Color.White, this.order)
        const right = new Surface(Color.Green, this.order)
        this.horFace = new Array(front, right, back, left)
        this.vertFace = new Array(front, bottom, back, top)

    }

    rollX (dir: Direction): void {
        if (dir === Direction.CW) { // 整体向上
            this.horFace.push(this.horFace.shift())
        } else {
            this.horFace.unshift(this.horFace.pop())
        }
    }

    rollY (dir: Direction): void {
        if (dir === Direction.CW) { // 整体向左
            this.horFace.push(this.horFace.shift())
        } else {
            this.horFace.unshift(this.horFace.pop())
        }
    }

    rotateFace (dir: Direction): void {
        this.front.rotate(dir)
        this.rotateSide(dir)
    }

    rotateSide (dir: Direction) {
        const topColors = this.top.getRowColor(this.order - 1)
        const bottomColors = this.bottom.getRowColor(0)
        const rightColors = this.right.getColumnColor(0)
        const leftColors = this.left.getColumnColor(this.order - 1)
        if (dir === Direction.CW) {
            this.top.setRowColorData(this.order - 1, leftColors.reverse())
            this.right.setColumnColorData(0, topColors)
            this.bottom.setRowColorData(0, rightColors.reverse())
            this.left.setColumnColorData(this.order - 1, bottomColors)
        } else {
            this.top.setRowColorData(this.order - 1, rightColors)
            this.right.setColumnColorData(0, bottomColors.reverse())
            this.bottom.setRowColorData(0, leftColors)
            this.left.setColumnColorData(this.order - 1, topColors.reverse())
        }
    }

}

new Cube()
//
// let front = new Surface(Color.Orange)
// front.data = [
//     [Color.Blue, Color.Blue, Color.Red],
//     [Color.White, Color.Orange, Color.Blue],
//     [Color.White, Color.Yellow, Color.Yellow]
// ]
//
// let t = new Surface(Color.Yellow)
// t.data = [
//     [Color.Orange, Color.Yellow, Color.Blue],
//     [Color.Orange, Color.Yellow, Color.Blue],
//     [Color.White, Color.White, Color.Yellow]
// ]
//
// let r = new Surface(Color.Blue)
// r.data = [
//     [Color.Green, Color.Orange, Color.Orange],
//     [Color.Yellow, Color.Blue, Color.Red],
//     [Color.Orange, Color.Red, Color.Red]
// ]
//
// let l = new Surface(Color.Blue)
// l.data = [
//     [Color.Yellow, Color.Green, Color.Red],
//     [Color.Green, Color.Green, Color.Orange],
//     [Color.Red, Color.Green, Color.Orange]
// ]
//
// let b = new Surface(Color.Blue)
// b.data = [
//     [Color.Green, Color.Red, Color.Green],
//     [Color.Red, Color.White, Color.White],
//     [Color.Blue, Color.White, Color.White]
// ]
//
// front.top = t
// front.right = r
// front.left = l
// front.bottom = b
//
//
// front.rotate(Direction.CW)
//
// console.log(front)
//
// front.consoleColor()
// t.consoleColor()
// l.consoleColor()
// r.consoleColor()
// b.consoleColor()
