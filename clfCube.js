"use strict";

// WebGL variables
let canvas;
let gl;

// Cube properties
var points = [];
var colors = [];

// Rotation axes and angles
const xAxis = 0;
const yAxis = 1;
const zAxis = 2;
let currentAxis = xAxis;
const rotationAngles = [0, 0, 0];

let thetaLoc;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    createColorCube(); // Reference from https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/04/cube.html
    //
    // Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the CPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");

    // Initailize event handler

    // X axis
    document.getElementById("xButton").onclick = function () {
        currentAxis = xAxis;
    };

    // Y Axis
    document.getElementById("yButton").onclick = function () {
        currentAxis = yAxis;
    };

    // Z Axis
    document.getElementById("zButton").onclick = function () {
        currentAxis = zAxis;
    };

    render();
};

function createColorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0], // Black
        [1.0, 0.0, 0.0, 1.0], // Red
        [1.0, 1.0, 0.0, 1.0], // Yellow
        [0.0, 1.0, 0.0, 1.0], // Green
        [0.0, 0.0, 1.0, 1.0], // Blue
        [1.0, 0.0, 1.0, 1.0], // Magenta
        [1.0, 1.0, 1.0, 1.0], // White
        [0.0, 1.0, 1.0, 1.0]  // Cyan
    ];

    var indices = [a, b, c, a, c, d];

    for (let i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    rotationAngles[currentAxis] += 2.0;
    gl.uniform3fv(thetaLoc, rotationAngles);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    requestAnimFrame(render);
}
