var ORDER = 3;
var Color;
(function (Color) {
    Color[Color["White"] = 0] = "White";
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["Orange"] = 3] = "Orange";
    Color[Color["Green"] = 4] = "Green";
    Color[Color["Yellow"] = 5] = "Yellow";
})(Color || (Color = {}));
var CubeHorFace;
(function (CubeHorFace) {
    CubeHorFace[CubeHorFace["Front"] = 0] = "Front";
    CubeHorFace[CubeHorFace["Right"] = 1] = "Right";
    CubeHorFace[CubeHorFace["Back"] = 2] = "Back";
    CubeHorFace[CubeHorFace["Left"] = 3] = "Left";
})(CubeHorFace || (CubeHorFace = {}));
var CubeVerFace;
(function (CubeVerFace) {
    CubeVerFace[CubeVerFace["Front"] = 0] = "Front";
    CubeVerFace[CubeVerFace["Bottom"] = 1] = "Bottom";
    CubeVerFace[CubeVerFace["Back"] = 2] = "Back";
    CubeVerFace[CubeVerFace["Top"] = 3] = "Top";
})(CubeVerFace || (CubeVerFace = {}));
var Direction;
(function (Direction) {
    Direction[Direction["CW"] = 0] = "CW";
    Direction[Direction["CCW"] = 1] = "CCW"; // 逆时针
})(Direction || (Direction = {}));
var RollAction;
(function (RollAction) {
    RollAction[RollAction["Horizatal"] = 0] = "Horizatal";
    RollAction[RollAction["Vertical"] = 1] = "Vertical";
})(RollAction || (RollAction = {}));
var Surface = /** @class */ (function () {
    function Surface(color, order) {
        if (order === void 0) { order = ORDER; }
        this.order = order;
        this.name = Color[color];
        this.initColor(color);
    }
    Surface.prototype.initColor = function (color) {
        this.data = Array(this.order);
        for (var i = 0; i < this.order; i++) {
            this.setRowColorData(i, color);
        }
    };
    Surface.prototype.setRowColorData = function (rowIndex, colors) {
        if (Array.isArray(colors)) {
            this.data[rowIndex] = colors;
        }
        else {
            // @ts-ignore
            this.data[rowIndex] = Array(this.order).fill(null).map(function () { return colors; });
        }
    };
    ;
    Surface.prototype.setColumnColorData = function (colIndex, colors) {
        var _this = this;
        colors.forEach(function (color, i) {
            _this.data[i][colIndex] = colors[i];
        });
    };
    Surface.prototype.getRowColor = function (rowIndex) {
        return this.data[rowIndex];
    };
    Surface.prototype.getColumnColor = function (colIndex) {
        var _this = this;
        // @ts-ignore
        return Array(this.order).fill(null).map(function (e, index) {
            return _this.data[index][colIndex];
        });
    };
    Surface.prototype.clone = function () {
        var cloneFace = new Surface(Color[this.name], this.order);
        cloneFace.data = JSON.parse(JSON.stringify(this.data));
        return cloneFace;
    };
    Surface.prototype.rotate = function (dir) {
        var _this = this;
        if (dir === Direction.CW) {
            this.data = Array(this.order).fill(null).map(function (e, index) { return _this.getColumnColor(_this.order - index - 1).reverse(); }).reverse();
        }
        else {
            this.data = Array(this.order).fill(null).map(function (e, index) { return _this.getColumnColor(_this.order - index - 1); });
        }
    };
    Object.defineProperty(Surface.prototype, "complete", {
        get: function () {
            var _this = this;
            return !this.data.some(function (surfaceData) {
                return surfaceData.some(function (color) { return color !== _this.data[0][0]; });
            });
        },
        enumerable: true,
        configurable: true
    });
    Surface.prototype.consoleColor = function () {
        console.log("=========\u3010" + this.name + "\u3011=========");
        this.data.forEach(function (row) {
            console.log(row.map(function (color) {
                return Color[color];
            }));
        });
        console.log("==========-----===========\n");
    };
    return Surface;
}());
var Cube = /** @class */ (function () {
    function Cube(order) {
        if (order === void 0) { order = ORDER; }
        this.order = order;
        this.history = [];
        this.rollAction = RollAction.Vertical;
        this.createSurface();
    }
    Object.defineProperty(Cube.prototype, "top", {
        get: function () {
            var surface = this.vertFace[CubeVerFace.Top];
            surface.name = 'TOP';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "bottom", {
        get: function () {
            var surface = this.vertFace[CubeVerFace.Bottom];
            surface.name = 'BOTTOM';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "front", {
        get: function () {
            var surface = null;
            if (this.rollAction === RollAction.Vertical) {
                surface = this.vertFace[CubeVerFace.Front];
            }
            else {
                surface = this.horFace[CubeHorFace.Front];
            }
            surface.name = 'FRONT';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "back", {
        get: function () {
            var surface = null;
            if (this.rollAction === RollAction.Vertical) {
                surface = this.vertFace[CubeVerFace.Back];
            }
            else {
                surface = this.horFace[CubeHorFace.Back];
            }
            surface.name = 'BACK';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "left", {
        get: function () {
            var surface = this.horFace[CubeHorFace.Left];
            surface.name = 'LEFT';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "right", {
        get: function () {
            var surface = this.horFace[CubeHorFace.Right];
            surface.name = 'RIGHT';
            return surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "complete", {
        get: function () {
            return !this.horFace.some(function (surface) { return !surface.complete; });
        },
        enumerable: true,
        configurable: true
    });
    Cube.prototype.createSurface = function () {
        var front = new Surface(Color.Red, this.order);
        var back = new Surface(Color.Orange, this.order);
        var top = new Surface(Color.Yellow, this.order);
        var left = new Surface(Color.Blue, this.order);
        var bottom = new Surface(Color.White, this.order);
        var right = new Surface(Color.Green, this.order);
        this.horFace = new Array(front, right, back, left);
        this.vertFace = new Array(front, bottom, back, top);
    };
    Cube.prototype.rollX = function (dir) {
        this.rollAction = RollAction.Vertical;
        if (dir === Direction.CW) {
            this.vertFace.push(this.vertFace.shift());
            this.left.rotate(Direction.CCW);
            this.right.rotate(Direction.CW);
            this.back.data = this.back.data.map(function (row) { return row.slice().reverse(); }).reverse();
            this.bottom.data = this.bottom.data.map(function (row) { return row.slice().reverse(); }).reverse();
        }
        else {
            this.vertFace.unshift(this.vertFace.pop());
            this.left.rotate(Direction.CW);
            this.right.rotate(Direction.CCW);
            this.back.data = this.back.data.map(function (row) { return row.slice().reverse(); }).reverse();
            this.top.data = this.top.data.map(function (row) { return row.slice().reverse(); }).reverse();
        }
        this.horFace[0] = this.front;
        this.horFace[2] = this.back;
    };
    Cube.prototype.rollY = function (dir) {
        this.rollAction = RollAction.Horizatal;
        if (dir === Direction.CW) {
            this.horFace.push(this.horFace.shift());
            this.top.rotate(Direction.CW);
            this.bottom.rotate(Direction.CCW);
        }
        else {
            this.horFace.unshift(this.horFace.pop());
            this.top.rotate(Direction.CCW);
            this.bottom.rotate(Direction.CW);
        }
        this.vertFace[0] = this.front;
        this.vertFace[2] = this.back;
    };
    Cube.prototype.rollZ = function (dir) {
        this.rollX(Direction.CCW);
        this.rollY(dir === Direction.CCW ? Direction.CW : Direction.CCW);
        this.rollX(Direction.CW);
    };
    Cube.prototype.rotateFace = function (dir) {
        this.front.rotate(dir);
        this.rotateSide(dir, 0);
    };
    Cube.prototype.rotateSide = function (dir, index) {
        var topColors = this.top.getRowColor(this.order - 1 - index);
        var bottomColors = this.bottom.getRowColor(index);
        var rightColors = this.right.getColumnColor(index);
        var leftColors = this.left.getColumnColor(this.order - 1 - index);
        if (dir === Direction.CW) {
            this.top.setRowColorData(this.order - 1 - index, leftColors.reverse());
            this.right.setColumnColorData(index, topColors);
            this.bottom.setRowColorData(index, rightColors.reverse());
            this.left.setColumnColorData(this.order - 1 - index, bottomColors);
        }
        else {
            this.top.setRowColorData(this.order - 1 - index, rightColors);
            this.right.setColumnColorData(index, bottomColors.reverse());
            this.bottom.setRowColorData(index, leftColors);
            this.left.setColumnColorData(this.order - 1 - index, topColors.reverse());
        }
    };
    Cube.prototype.consoleFace = function () {
        this.front.consoleColor();
        this.right.consoleColor();
        this.back.consoleColor();
        this.left.consoleColor();
        this.top.consoleColor();
        this.bottom.consoleColor();
    };
    Cube.prototype.step = function (method, recovery) {
        if (recovery === void 0) { recovery = false; }
        if (!recovery)
            this.history.push(method);
        switch (method) {
            case "U":// 顶部顺时针 (向左)
                // ←
                // —
                // —
                this.rollX(Direction.CCW);
                this.rotateFace(Direction.CW);
                this.rollX(Direction.CW);
                break;
            case "U'":// 顶部逆时针
                // →
                // —
                // —
                this.rollX(Direction.CCW);
                this.rotateFace(Direction.CCW);
                this.rollX(Direction.CW);
                break;
            case "D'":// 底部逆时针
                // —
                // —
                // ←
                this.rollX(Direction.CW);
                this.rotateFace(Direction.CCW);
                this.rollX(Direction.CCW);
                break;
            case "D":// 底部顺时针
                // —
                // —
                // →
                this.rollX(Direction.CW);
                this.rotateFace(Direction.CW);
                this.rollX(Direction.CCW);
                break;
            case "E'":// 横向中间层向左
                // —
                // ←
                // —
                this.rollX(Direction.CCW);
                this.rotateSide(Direction.CW, 1);
                this.rollX(Direction.CW);
                break;
            case "E":// 横向中间层向右
                // —
                // →
                // —
                this.rollX(Direction.CCW);
                this.rotateSide(Direction.CCW, 1);
                this.rollX(Direction.CW);
                break;
            case "E2":// 横向中间层向右2次
                // —
                // →
                // —
                this.rollX(Direction.CCW);
                this.rotateSide(Direction.CCW, 1);
                this.rotateSide(Direction.CCW, 1);
                this.rollX(Direction.CW);
                break;
            case "R":// 右边向上
                // ||↑
                this.rollY(Direction.CW);
                this.rotateFace(Direction.CW);
                this.rollY(Direction.CCW);
                break;
            case "R'":// 右边向下
                // ||↓
                this.rollY(Direction.CW);
                this.rotateFace(Direction.CCW);
                this.rollY(Direction.CCW);
                break;
            case "L":// 左边
                // ↓||
                this.rollY(Direction.CCW);
                this.rotateFace(Direction.CW);
                this.rollY(Direction.CW);
                break;
            case "L'":// 左边
                // ↑||
                this.rollY(Direction.CCW);
                this.rotateFace(Direction.CCW);
                this.rollY(Direction.CW);
                break;
            case "M":// 垂直中间顺时针 （向下）
                // |↓|
                this.rollY(Direction.CCW);
                this.rotateSide(Direction.CW, 1);
                this.rollY(Direction.CW);
                break;
            case "M2":// 垂直中间顺时针 （向下）
                // |↓|
                this.rollY(Direction.CCW);
                this.rotateSide(Direction.CW, 1);
                this.rotateSide(Direction.CW, 1);
                this.rollY(Direction.CW);
                break;
            case "M'":// 垂直中间逆时针 （向上）
                // |↑|
                this.rollY(Direction.CCW);
                this.rotateSide(Direction.CCW, 1);
                this.rollY(Direction.CW);
                break;
            case "F":// 前面顺时针
                // ↑↓//
                this.rotateFace(Direction.CW);
                break;
            case "F'":// 前面逆时针
                // ↓↑//
                this.rotateFace(Direction.CCW);
                break;
            case "S":// Z方向中间顺时针
                // /↑↓/
                this.rotateSide(Direction.CW, 1);
                break;
            case "S2":// Z方向中间顺时针
                // /↑↓/
                this.rotateSide(Direction.CW, 1);
                this.rotateSide(Direction.CW, 1);
                break;
            case "S'":// Z方向中间逆时针
                // /↓↑/
                this.rotateSide(Direction.CCW, 1);
                break;
            case "B":// 背面顺时针
                // //↓↑
                this.rollY(Direction.CW);
                this.rollY(Direction.CW);
                this.rotateFace(Direction.CW);
                this.rollY(Direction.CCW);
                this.rollY(Direction.CCW);
                break;
            case "B'":// Z方向中间逆时针
                // //↑↓
                this.rollY(Direction.CW);
                this.rollY(Direction.CW);
                this.rotateFace(Direction.CCW);
                this.rollY(Direction.CCW);
                this.rollY(Direction.CCW);
                break;
            case 'x':
                this.rollX(Direction.CW);
                break;
            case "x'":
                this.rollX(Direction.CCW);
                break;
            case 'y':
                this.rollY(Direction.CW);
                break;
            case "y'":
                this.rollY(Direction.CCW);
                break;
            case 'z':
                this.rollZ(Direction.CW);
                break;
            case "z'":
                this.rollZ(Direction.CCW);
                break;
            case "u2":// 顶部两层顺时针 (向左)2次
                // ←
                // ←
                // —
                this.step('D', recovery);
                this.step('D', recovery);
                this.rollY(Direction.CW);
                this.rollY(Direction.CW);
                break;
            case "u":// 顶部两层顺时针 (向左)
                // ←
                // ←
                // —
                this.step('D', recovery);
                this.rollY(Direction.CW);
                break;
            case "u'":// 顶部两层逆时针 (向右)
                // ←
                // ←
                // —
                this.step('D', recovery);
                this.rollY(Direction.CCW);
                break;
            default:
                console.error('method is not exist');
        }
    };
    Cube.prototype.upset = function () {
        var _this = this;
        this.history = new Array((Math.random() * 5 + 15) | 0).fill('').map(function () {
            var action = steps[Math.random() * steps.length | 0];
            _this.step(action);
            return action;
        });
    };
    Cube.prototype.recovery = function () {
        var _this = this;
        this.history.reverse().forEach(function (action) {
            _this.step(action.replace(/(\w)('?)/, function ($0, $1, $2) { return $1 + ($2 ? '' : "'"); }), true);
        });
    };
    Cube.prototype.run = function (formulaStr) {
        var _this = this;
        formulaStr.replace(/\((.+?)\)2/g, '$1$1')
            .split(/(?=[a-zA-Z](?='|\d)?)/).forEach(function (method) { return _this.step(method); });
    };
    return Cube;
}());
var steps = [
    "U", "U'", "D", "D'", "E", "E'", "R", "R'", "L", "L'", "M", "M'", "F", "F'", "S", "S'", "B", "B'"
];
var tips = {
    "U": "\u2190\n\u2014\n\u2014\n",
    "U'": "\u2192\n\u2014\n\u2014\n",
    "D'": "\u2014\n\u2014\n\u2190\n",
    "D": "\u2014\n\u2014\n\u2192\n",
    "E'": "\u2014\n\u2190\n\u2014\n",
    "E": "\u2014\n\u2192\n\u2014\n",
    "R": "||\u2191",
    "R'": "||\u2193",
    "L": "\u2193||",
    "L'": "\u2191||",
    "M": "|\u2193|",
    "M'": "|\u2191|",
    "F": "\u2191\u2193//",
    "F'": "\u2193\u2191//",
    "S": "/\u2191\u2193/",
    "S'": "/\u2193\u2191/",
    "B": "//\u2193\u2191",
    "B'": "//\u2191\u2193",
};
var cube = new Cube();
// cube.upset()
// cube.consoleFace()
// console.log(cube.complete)
// cube.history.forEach(k => {
//     console.log(`====[${k}]====`)
//     console.log(tips[k])
//     console.log('')
// })
// cube.recovery()
//
// const guaijiao: Formula = [
//     "R", "U", "R'", "U'", "R'", "F", "R", "F'"
// ]
// const yizi: Formula = [
//     "F", "R", "U'", "R'", "U'", "R", "U", "R'", "F'"
// ]
//
// const LF: Formula = [
//     "L'", "U'", "L", "U'", "L'", "U'", "U'", "L"
// ]
var RF = [
    "R", "U", "R'", "U", "R", "U", "U", "R'"
];
// RF.forEach(a => {
//     cube.step(a)
//     console.log(`====[${a}]====`)
//     console.log(tips[a])
//     console.log('')
// })
// LF.forEach(a => {
//     cube.step(a)
//     console.log(`====[${a}]====`)
//     console.log(tips[a])
//     console.log('')
// })
var stra = RF.join('');
console.log(stra);
cube.run(stra);
cube.consoleFace();
console.log(cube.complete);
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
