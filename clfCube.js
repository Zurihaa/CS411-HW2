"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var speed = 100;
var direction = true;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Define cube vertices
    var vertices = [
        // Front face
        vec3(-1, -1, 1), 
        vec3(1, -1, 1),  
        vec3(1, 1, 1),   
        vec3(-1, 1, 1),
        // Back face
        vec3(-1, -1, -1), 
        vec3(1, -1, -1),  
        vec3(1, 1, -1),   
        vec3(-1, 1, -1)   
    ];

    // Define cube colors with opacity
    var colors = [
        vec4(0.0, 0.0, 0.0, 1.0),   
        vec4(1.0, 0.0, 0.0, 1.0),   
        vec4(1.0, 0.0, 1.0, 1.0),   
        vec4(0.0, 1.0, 0.0, 1.0),   
        vec4(0.0, 0.0, 1.0, 1.0),   
        vec4(1.0, 0.0, 1.0, 1.0),   
        vec4(1.0, 1.0, 1.0, 1.0),   
        vec4(0.0, 1.0, 1.0, 1.0)    
    ];

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    // Define a buffer for colors
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");

    // Initialize event handlers

    //slider
    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };
    //button
    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };
    //menu
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
    //keyboard
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

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, 36); // Draw the cube

    setTimeout(
        function () {requestAnimFrame( render );},
        speed
    );
}