let ORDER: number = 3
interface Formula extends Array<string>{
    [index: number]: string
}

enum Color {White, Red, Blue, Orange, Green, Yellow}

enum CubeHorFace {Front, Right, Back, Left}

enum CubeVerFace {Front, Bottom, Back, Top}

enum Direction {
    CW, // 顺时针
    CCW // 逆时针
}

enum RollAction {
    Horizatal,
    Vertical
}

interface SurfaceData extends Array<Color[]> {
    [index: number]: Color[]
}

class Surface {
    public name: string;
    public data: SurfaceData;
    constructor(color: Color, public order: number = ORDER) {
        this.name = Color[color]
        this.initColor(color)
    }

    initColor(color: Color): void {
        this.data = Array(this.order)
        for (let i = 0; i < this.order; i++) {
            this.setRowColorData(i, color)
        }
    }

    setRowColorData(rowIndex: number, colors: Color[] | Color): void {
        if (Array.isArray(colors)) {
            this.data[rowIndex] = colors
        } else {
            // @ts-ignore
            this.data[rowIndex] = Array(this.order).fill(null).map(() => colors)
        }
    };

    setColumnColorData(colIndex: number, colors: Color[]): void {
        colors.forEach((color, i) => {
            this.data[i][colIndex] = colors[i]
        })
    }

    getRowColor(rowIndex: number): Color[] {
        return this.data[rowIndex]
    }

    getColumnColor(colIndex: number): Color[] {
        // @ts-ignore
        return Array(this.order).fill(null).map((e, index) => {
            return this.data[index][colIndex]
        })
    }

    clone(): Surface {
        const cloneFace = new Surface(Color[this.name], this.order)
        cloneFace.data = JSON.parse(JSON.stringify(this.data))
        return cloneFace
    }

    rotate(dir: Direction): void {
        if (dir === Direction.CW) {
            this.data = Array(this.order).fill(null).map((e, index) => this.getColumnColor(this.order - index - 1).reverse()).reverse()
        } else {
            this.data = Array(this.order).fill(null).map((e, index) => this.getColumnColor(this.order - index - 1))
        }
    }

    consoleColor(): void {
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
    public history: string[] = []
    public rollAction: RollAction = RollAction.Vertical;
    constructor(public order: number = ORDER) {
        this.createSurface()
    }

    get top(): Surface {
        const surface = this.vertFace[CubeVerFace.Top]
        surface.name = 'TOP'
        return surface
    }

    get bottom(): Surface {
        const surface = this.vertFace[CubeVerFace.Bottom]
        surface.name = 'BOTTOM'
        return surface
    }

    get front(): Surface {
        let surface = null
        if (this.rollAction === RollAction.Vertical) {
            surface = this.vertFace[CubeVerFace.Front]
        } else {
            surface = this.horFace[CubeHorFace.Front]
        }
        surface.name = 'FRONT'
        return surface
    }

    get back(): Surface {
        let surface = null
        if (this.rollAction === RollAction.Vertical) {
            surface = this.vertFace[CubeVerFace.Back]
        } else {
            surface = this.horFace[CubeHorFace.Back]
        }
        surface.name = 'BACK'
        return surface
    }

    get left(): Surface {
        const surface =  this.horFace[CubeHorFace.Left]
        surface.name = 'LEFT'
        return surface
    }

    get right(): Surface {
        const surface = this.horFace[CubeHorFace.Right]
        surface.name = 'RIGHT'
        return surface
    }

    createSurface(): void {
        const front = new Surface(Color.Red, this.order)
        const back = new Surface(Color.Orange, this.order)
        const top = new Surface(Color.Yellow, this.order)
        const left = new Surface(Color.Blue, this.order)
        const bottom = new Surface(Color.White, this.order)
        const right = new Surface(Color.Green, this.order)
        this.horFace = new Array(front, right, back, left)
        this.vertFace = new Array(front, bottom, back, top)

    }

    rollX(dir: Direction): void {
        this.rollAction = RollAction.Vertical
        if (dir === Direction.CW) { // 整体向上
            this.vertFace.push(this.vertFace.shift())
            this.left.rotate(Direction.CCW)
            this.right.rotate(Direction.CW)
            this.back.data = this.back.data.map(row => [...row].reverse()).reverse()
            this.bottom.data = this.bottom.data.map(row => [...row].reverse()).reverse()
        } else {
            this.vertFace.unshift(this.vertFace.pop())
            this.left.rotate(Direction.CW)
            this.right.rotate(Direction.CCW)
            this.back.data = this.back.data.map(row => [...row].reverse()).reverse()
            this.top.data = this.top.data.map(row => [...row].reverse()).reverse()
        }
        this.horFace[0] = this.front
        this.horFace[2] = this.back
    }

    rollY(dir: Direction): void {
        this.rollAction = RollAction.Horizatal
        if (dir === Direction.CW) { // 整体向左
            this.horFace.push(this.horFace.shift())
            this.top.rotate(Direction.CW)
            this.bottom.rotate(Direction.CCW)
        } else {
            this.horFace.unshift(this.horFace.pop())
            this.top.rotate(Direction.CCW)
            this.bottom.rotate(Direction.CW)
        }
        this.vertFace[0] = this.front
        this.vertFace[2] = this.back
    }

    rotateFace(dir: Direction): void {
        this.front.rotate(dir)
        this.rotateSide(dir, 0)
    }

    rotateSide(dir: Direction, index: number): void {
        const topColors = this.top.getRowColor(this.order - 1 - index)
        const bottomColors = this.bottom.getRowColor(index)
        const rightColors = this.right.getColumnColor(index)
        const leftColors = this.left.getColumnColor(this.order - 1 - index)
        if (dir === Direction.CW) {
            this.top.setRowColorData(this.order - 1 - index, leftColors.reverse())
            this.right.setColumnColorData(index, topColors)
            this.bottom.setRowColorData(index, rightColors.reverse())
            this.left.setColumnColorData(this.order - 1 - index, bottomColors)
        } else {
            this.top.setRowColorData(this.order - 1 - index, rightColors)
            this.right.setColumnColorData(index, bottomColors.reverse())
            this.bottom.setRowColorData(index, leftColors)
            this.left.setColumnColorData(this.order - 1 - index, topColors.reverse())
        }
    }

    consoleFace (): void {
        this.front.consoleColor()
        this.right.consoleColor()
        this.back.consoleColor()
        this.left.consoleColor()
        this.top.consoleColor()
        this.bottom.consoleColor()
    }

    step (method: string, recovery: boolean = false): void {
        if (!recovery) this.history.push(method)
        switch (method) {
            case "U": // 顶部顺时针 (向左)
                // ←
                // —
                // —
                this.rollX(Direction.CCW)
                this.rotateFace(Direction.CW)
                this.rollX(Direction.CW)
                break
            case "U'": // 顶部逆时针
                // →
                // —
                // —
                this.rollX(Direction.CCW)
                this.rotateFace(Direction.CCW)
                this.rollX(Direction.CW)
                break
            case "D'": // 底部逆时针
                // —
                // —
                // ←
                this.rollX(Direction.CW)
                this.rotateFace(Direction.CCW)
                this.rollX(Direction.CCW)
                break
            case "D": // 底部顺时针
                // —
                // —
                // →
                this.rollX(Direction.CW)
                this.rotateFace(Direction.CW)
                this.rollX(Direction.CCW)
                break
            case "E'": // 横向中间层向左
                // —
                // ←
                // —
                this.rollX(Direction.CCW)
                this.rotateSide(Direction.CW, 1)
                this.rollX(Direction.CW)
                break
            case "E": // 横向中间层向右
                // —
                // →
                // —
                this.rollX(Direction.CCW)
                this.rotateSide(Direction.CCW, 1)
                this.rollX(Direction.CW)
                break
            case "R": // 右边向上
                // ||↑
                this.rollY(Direction.CW)
                this.rotateFace(Direction.CW)
                this.rollY(Direction.CCW)
                break
            case "R'": // 右边向下
                // ||↓
                this.rollY(Direction.CW)
                this.rotateFace(Direction.CCW)
                this.rollY(Direction.CCW)
                break
            case "L": // 左边
                // ↓||
                this.rollY(Direction.CCW)
                this.rotateFace(Direction.CW)
                this.rollY(Direction.CW)
                break
            case "L'": // 左边
                // ↑||
                this.rollY(Direction.CCW)
                this.rotateFace(Direction.CCW)
                this.rollY(Direction.CW)
                break
            case "M": // 垂直中间顺时针 （向下）
                // |↓|
                this.rollY(Direction.CCW)
                this.rotateSide(Direction.CW, 1)
                this.rollY(Direction.CW)
                break
            case "M'": // 垂直中间逆时针 （向上）
                // |↑|
                this.rollY(Direction.CCW)
                this.rotateSide(Direction.CCW, 1)
                this.rollY(Direction.CW)
                break
            case "F": // 前面顺时针
                // ↑↓//
                this.rotateFace(Direction.CW)
                break
            case "F'": // 前面逆时针
                // ↓↑//
                this.rotateFace(Direction.CCW)
                break
            case "S": // Z方向中间顺时针
                // /↑↓/
                this.rotateSide(Direction.CW, 1)
                break
            case "S'": // Z方向中间逆时针
                // /↓↑/
                this.rotateSide(Direction.CCW, 1)
                break
            case "B": // 背面顺时针
                // //↓↑
                this.rollY(Direction.CW)
                this.rollY(Direction.CW)
                this.rotateFace(Direction.CW)
                this.rollY(Direction.CCW)
                this.rollY(Direction.CCW)
                break
            case "B'": // Z方向中间逆时针
                // //↑↓
                this.rollY(Direction.CW)
                this.rollY(Direction.CW)
                this.rotateFace(Direction.CCW)
                this.rollY(Direction.CCW)
                this.rollY(Direction.CCW)
                break
            default:
                console.error('method is not exist')
        }
    }
    
    upset (): void {
        this.history = new Array((Math.random() * 5 + 15) | 0).fill('').map(() => {
            const action = steps[Math.random() * steps.length | 0]
            this.step(action)
            return action
        })
    }

    recovery (): void {
        this.history.reverse().forEach(action => {
            this.step(action.replace(/(\w)('?)/, ($0, $1, $2) =>  $1 + ($2 ? '' : "'")), true)
        })
    }
}
const steps: string[] = [
    "U", "U'", "D", "D'", "E", "E'", "R", "R'", "L", "L'", "M", "M'", "F", "F'", "S", "S'", "B", "B'"
]
const tips = {
    "U": `←\n—\n—\n`,
    "U'": `→\n—\n—\n`,
    "D'":`—\n—\n←\n`,
    "D":`—\n—\n→\n`,
    "E'":`—\n←\n—\n`,
    "E":`—\n→\n—\n`,
    "R":`||↑`,
    "R'":`||↓`,
    "L":`↓||`,
    "L'":`↑||`,
    "M":`|↓|`,
    "M'":`|↑|`,
    "F": `↑↓//`,
    "F'": `↓↑//`,
    "S": `/↑↓/`,
    "S'": `/↓↑/`,
    "B": `//↓↑`,
    "B'": `//↑↓`,
}

const cube = new Cube();

cube.upset()
cube.consoleFace()

cube.history.forEach(k => {
    console.log(`====[${k}]====`)
    console.log(tips[k])
    console.log('')
})
cube.recovery()
cube.consoleFace()

const guaijiao: Formula = [
    "R", "U", "R'", "U'", "R'", "F", "R", "F'"
]
const yizi: Formula = [
    "F", "R", "U'", "R'", "U'", "R", "U", "R'", "F'"
]

const LF: Formula = [
    "L'", "U'", "L", "U'", "L'", "U'", "U'", "L", "U'"
]
const RF: Formula = [
    "R", "U", "R'", "U", "R", "U", "U", "R'", "U"
]


// cube.front.data = [
//     [Color.Orange, Color.Green, Color.Green],
//     [Color.White, Color.Red, Color.Red],
//     [Color.Yellow, Color.White, Color.Yellow]
// ]
// cube.top.data = [
//     [Color.Yellow, Color.Yellow, Color.White],
//     [Color.Blue, Color.Yellow, Color.Red],
//     [Color.Blue, Color.Yellow, Color.Orange]
// ]
// cube.right.data = [
//     [Color.White, Color.Blue, Color.Blue],
//     [Color.White, Color.Green, Color.Blue],
//     [Color.Red, Color.Orange, Color.Red]
// ]
// cube.left.data = [
//     [Color.Green, Color.White, Color.Yellow],
//     [Color.Orange, Color.Blue, Color.Green],
//     [Color.Red, Color.Orange, Color.Green]
// ]
// cube.bottom.data = [
//     [Color.Orange, Color.Orange, Color.Blue],
//     [Color.Blue, Color.White, Color.Green],
//     [Color.White, Color.Green, Color.White]
// ]
// cube.back.data = [
//     [Color.Orange, Color.Red, Color.Red],
//     [Color.Yellow, Color.Orange, Color.Yellow],
//     [Color.Green, Color.Red, Color.Blue]
// ]

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
