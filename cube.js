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
    Surface.prototype.consoleColor = function () {
        console.log("======Surface\u3010" + this.name + "\u3011=======");
        this.data.forEach(function (row) {
            console.log(row.map(function (color) {
                return Color[color];
            }));
        });
        console.log("==========-----===========");
        console.log('');
    };
    return Surface;
}());
var Cube = /** @class */ (function () {
    function Cube(order) {
        if (order === void 0) { order = ORDER; }
        this.order = order;
        this.createSurface();
    }
    Object.defineProperty(Cube.prototype, "top", {
        get: function () {
            return this.horFace[CubeVerFace.Top];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "bottom", {
        get: function () {
            return this.horFace[CubeVerFace.Bottom];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "front", {
        get: function () {
            return this.horFace[CubeVerFace.Front];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "back", {
        get: function () {
            return this.horFace[CubeVerFace.Back];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "left", {
        get: function () {
            return this.vertFace[CubeHorFace.Left];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cube.prototype, "right", {
        get: function () {
            return this.vertFace[CubeHorFace.Right];
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
        if (dir === Direction.CW) {
            this.horFace.push(this.horFace.shift());
        }
        else {
            this.horFace.unshift(this.horFace.pop());
        }
    };
    Cube.prototype.rollY = function (dir) {
        if (dir === Direction.CW) {
            this.horFace.push(this.horFace.shift());
        }
        else {
            this.horFace.unshift(this.horFace.pop());
        }
    };
    Cube.prototype.rotateFace = function (dir) {
        this.front.rotate(dir);
        this.rotateSide(dir);
    };
    Cube.prototype.rotateSide = function (dir) {
        var topColors = this.top.getRowColor(this.order - 1);
        var bottomColors = this.bottom.getRowColor(0);
        var rightColors = this.right.getColumnColor(0);
        var leftColors = this.left.getColumnColor(this.order - 1);
        if (dir === Direction.CW) {
            this.top.setRowColorData(this.order - 1, leftColors.reverse());
            this.right.setColumnColorData(0, topColors);
            this.bottom.setRowColorData(0, rightColors.reverse());
            this.left.setColumnColorData(this.order - 1, bottomColors);
        }
        else {
            this.top.setRowColorData(this.order - 1, rightColors);
            this.right.setColumnColorData(0, bottomColors.reverse());
            this.bottom.setRowColorData(0, leftColors);
            this.left.setColumnColorData(this.order - 1, topColors.reverse());
        }
    };
    return Cube;
}());
new Cube();
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
