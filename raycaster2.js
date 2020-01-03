var c = document.querySelector("canvas");
        
c.width = 600;
c.height = 450;

var ctx = c.getContext("2d");

const HALFHEIGHT = c.height / 2;

var vals = document.getElementById("vals");

function intersect(ln1, ln2) {
    var x1 = ln1[0][0];
    var y1 = ln1[0][1];
    var x2 = ln1[1][0];
    var y2 = ln1[1][1];
    var x3 = ln2[0][0];
    var y3 = ln2[0][1];
    var x4 = ln2[1][0];
    var y4 = ln2[1][1];
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }
    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    if (denominator === 0) {
        return false;
    }
    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }
    var x = x1 + ua * (x2 - x1);
    var y = y1 + ua * (y2 - y1);
    return [x, y];
}

function sin(angle) {
    return Math.sin(angle * Math.PI / 180);
}

function cos(angle) {
    return Math.cos(angle * Math.PI / 180);
}

Array.min = function(array) {
    return Math.min.apply(Math, array);
};

function drawRotatedRect(x, y, width, height, degrees = 0) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fill();
    ctx.restore();
}

class Player {
    constructor(x, y, r) {
        this._x = x;
        this._y = y;
        this._r = r;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get r() { return this._r; }

    takeStep() {
        var rads = this._r * Math.PI / 180;
        var disX = Math.sin(rads) / 4;
        var disY = Math.cos(rads) / 4;
        this._x += disX;
        this._y += disY;
        var hitbox1 = [[this._x - 0.26, this._y], [this._x + 0.26, this._y]];
        var hitbox2 = [[this._x, this._y - 0.26], [this._x, this._y + 0.26]];
        var collision = false;
        for (var i = 0; i < field.lines.length; i++) {
            if (intersect(hitbox1, field.lines[i]) !== false) collision = true;
            if (intersect(hitbox2, field.lines[i]) !== false) collision = true;
        }
        if (collision) {
            this._x -= disX;
            hitbox1 = [[this._x - 0.25, this._y], [this._x + 0.25, this._y]];
            hitbox2 = [[this._x, this._y - 0.25], [this._x, this._y + 0.25]];
            collision = false;
            for (var i = 0; i < field.lines.length; i++) {
                if (intersect(hitbox1, field.lines[i]) !== false) collision = true;
                if (intersect(hitbox2, field.lines[i]) !== false) collision = true;
            }
            if (collision) {
                this._x += disX;
                this._y -= disY;
                hitbox1 = [[this._x - 0.25, this._y], [this._x + 0.25, this._y]];
                hitbox2 = [[this._x, this._y - 0.25], [this._x, this._y + 0.25]];
                collision = false;
                for (var i = 0; i < field.lines.length; i++) {
                    if (intersect(hitbox1, field.lines[i]) !== false) collision = true;
                    if (intersect(hitbox2, field.lines[i]) !== false) collision = true;
                }
                if (collision) {
                    this._x -= disX;
                }
            }
        }
    }

    rotate(degrees) {
        this._r += degrees;
        this._r = this._r % 360;
        while (this._r < 0) { this._r += 360; }
    }
}
let player = new Player(2, 2, 0);

const SQUARESIZE = 1;

class Field {
    constructor(terrain, width) {
        this._width = width;
        this._terrain = terrain;
        this.computeLines();
    }

    get terrain() { return this._terrain; }
    get width() { return this._width; }
    get lines() { return this._lines; }

    computeLines() {
        var lineArray = [];
        for (var i = 0; i < this._terrain.length; i++) {
            var x = i % this._width;
            var y = (i - x) / this._width;
            if (this._terrain[i] == 1) {
                var ptA = [x * SQUARESIZE, y * SQUARESIZE];
                var ptB = [x * SQUARESIZE + SQUARESIZE, y * SQUARESIZE];
                var ptC = [x * SQUARESIZE + SQUARESIZE, y * SQUARESIZE + SQUARESIZE];
                var ptD = [x * SQUARESIZE, y * SQUARESIZE + SQUARESIZE];
                lineArray.push([ptA, ptB]);
                lineArray.push([ptB, ptC]);
                lineArray.push([ptC, ptD]);
                lineArray.push([ptD, ptA]);
            }
        }
        this._lines = lineArray;
    }
}

var field = new Field([
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
], 40);

function toHex(n) { // Converts an integer into a hex string
    if (n > 255) n = 255;
    if (n < 0) n = 0;
    var upperNible = n >> 4;
    lowerNible = n & 15;
    var map = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var hexString = map[upperNible] + map[lowerNible];
    return hexString;
}

function drawWall(distance, degrees) { // Renders a vertical line, used for displaying walls
    ctx.beginPath();
    if (distance < 1) distance = 1;
    var distanceInHex = toHex(distance * 4);
    ctx.strokeStyle = "#" + distanceInHex + distanceInHex + distanceInHex;
    ctx.moveTo(c.width * degrees / 90, HALFHEIGHT + HALFHEIGHT / distance);
    ctx.lineTo(c.width * degrees / 90, HALFHEIGHT - HALFHEIGHT / distance);
    ctx.moveTo(c.width * (degrees + 0.1) / 90, HALFHEIGHT + HALFHEIGHT / distance);
    ctx.lineTo(c.width * (degrees + 0.1) / 90, HALFHEIGHT - HALFHEIGHT / distance);
    ctx.stroke();
}

function fixRotation(rotation) {
    rotation = rotation % 360;
    while (rotation < 0) rotation += 360;
    return rotation;
}

function unDistort(distance, rotationRelativeToPlayersCenter) {
    return Math.abs(distance * Math.cos(rotationRelativeToPlayersCenter * Math.PI / 180));
}

const SIGHT = 100;

function renderWalls() {
    for (var i = 0; i <= 90; i += 0.1) {
        var rotationRelativeToPlayersCenter = fixRotation(i - 45);
        var rotationRelativeToZero = fixRotation(rotationRelativeToPlayersCenter + player.r);
        var sightLine = [[player.x, player.y],[player.x + sin(rotationRelativeToZero) * SIGHT, player.y + cos(rotationRelativeToZero) * SIGHT]];
        var intersections = [];
        for (var j = 0; j < field.lines.length; j++) {
            if (intersect(field.lines[j], sightLine) !== false) {
                intersections.push(intersect(field.lines[j], sightLine));
            }
        }
        var intersectionDistance = Array.min(intersections.map(x => Math.sqrt((x[0] - player.x) ** 2 + (x[1] - player.y) ** 2)));
        drawWall(unDistort(intersectionDistance, rotationRelativeToPlayersCenter), i);
    }
}   

let keys = {};
onkeydown = onkeyup = function(e) { // Keypress handler
    e = e || window.event;
    keys[e.key] = (e.type == 'keydown');
}

function loop() {
    requestAnimationFrame(loop);
    if (keys["w"]) {
        player.takeStep();
    }
    if (keys["a"]) {
        player.rotate(-4)
    }
    if (keys["s"]) {
        player.rotate(180);
        player.takeStep();
        player.rotate(-180);
    }
    if (keys["d"]) {
        player.rotate(4);
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#777777";
    ctx.fillRect(0, HALFHEIGHT, c.width, HALFHEIGHT);
    renderWalls();
    ctx.fillStyle = "red";
    drawRotatedRect((c.width / 2) - 2, HALFHEIGHT - 2, 4, 4, 0);
    vals.innerHTML = "X:&nbsp;" + Math.round(player.x) + "&nbsp;Y:&nbsp;" + Math.round(player.y) + "&nbsp;Rotation:&nbsp;" + player.r + "&deg;";
}
loop();