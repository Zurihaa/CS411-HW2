"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var speed = 100;
var direction = true;

var vertices = [
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0)
];

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),   // Black
    vec4(1.0, 0.0, 0.0, 1.0),   // Red
    vec4(1.0, 1.0, 0.0, 1.0),   // Yellow
    vec4(0.0, 1.0, 0.0, 1.0),   // Green
    vec4(0.0, 0.0, 1.0, 1.0),   // Blue
    vec4(1.0, 0.0, 1.0, 1.0),   // Magenta
    vec4(1.0, 1.0, 1.0, 1.0),   // White
    vec4(0.0, 1.0, 1.0, 1.0)    // Cyan
];

var cubeVertices = [
    1, 0, 3, 3, 2, 1,
    2, 3, 7, 7, 6, 2,
    3, 0, 4, 4, 7, 3,
    6, 5, 1, 1, 2, 6,
    4, 5, 6, 6, 7, 4,
    5, 4, 0, 0, 1, 5
];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

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

    // Initialize event handlers
    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };

    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };

    document.getElementById("Controls").onclick = function( event) {
        switch(event.target.index) {
            case 0:
                direction = !direction;
                break;

            case 1:
                speed /= 2.0;
                break;

            case 2:
                speed *= 2.0;
                break;
        }
    };

    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
            case '1':
                direction = !direction;
                break;

            case '2':
                speed /= 2.0;
                break;

            case '3':
                speed *= 2.0;
                break;
        }
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += direction ? 0.1 : -0.1;
    gl.uniform1f(thetaLoc, theta);

    for (var i = 0; i < 12; i++) {
        gl.drawArrays(gl.TRIANGLES, i * 6, 6);
    }

    setTimeout(function () {
        requestAnimFrame(render);
    }, speed);
}
