
function lib3D() {

const VERTEX_SIZE = 3;

let shaderHeader = `
precision highp float;
float noise(vec3 v) {
   vec4 r[2];
   const mat4 E = mat4(0.,0.,0.,0., 0.,.5,.5,0., .5,0.,.5,0., .5,.5,0.,0.);
   for (int j = 0 ; j < 2 ; j++)
   for (int i = 0 ; i < 4 ; i++) {
      vec3 p = .60*v + E[i].xyz, C = floor(p), P = p - C-.5, A = abs(P), D;
      C += mod(C.x+C.y+C.z+float(j),2.) * step(max(A.yzx,A.zxy),A)*sign(P);
      D  = 314.1*sin(59.2*float(i+4*j) + 65.3*C + 58.9*C.yzx + 79.3*C.zxy);
      r[j][i] = dot(P=p-C-.5,fract(D)-.5) * pow(max(0.,1.-2.*dot(P,P)),4.);
   }
   return 6.50 * (r[0].x+r[0].y+r[0].z+r[0].w+r[1].x+r[1].y+r[1].z+r[1].w);
}
`;

let nHeaderLines = 0;
for (let i = 0 ; i < shaderHeader.length ; i++)
   if (shaderHeader.charAt(i) == '\n')
      nHeaderLines++;

addEventListenersToCanvas = function(canvas) {
   let r = canvas.getBoundingClientRect();
   let toX = x => (2 * x - r.left - r.right) / canvas.height,
       toY = y => 1 - 2 * (y - r.top) / canvas.height;

   if (! onDrag      ) onDrag       = (x, y) => { };
   if (! onMove      ) onMove       = (x, y) => { };
   if (! onPress     ) onPress      = (x, y) => { };
   if (! onRelease   ) onRelease    = (x, y) => { };
   if (! onKeyPress  ) onKeyPress   = key => { };
   if (! onKeyRelease) onKeyRelease = key => { };

   canvas.addEventListener('mousemove', function(e) {
      let response = canvas.isDown ? onDrag : onMove;
      response(toX(e.clientX), toY(e.clientY));
   });
   canvas.addEventListener('mousedown', function(e) {
      onPress(toX(e.clientX), toY(e.clientY));
      canvas.isDown = true;
   });
   canvas.addEventListener('mouseup'  , function(e) {
      onRelease(toX(e.clientX), toY(e.clientY));
      canvas.isDown = false;
   });
   window.addEventListener('keydown', function(e) {
      if (! isEditing()) {
         switch (e.keyCode) {
         case  32: // SPACE
         case  33: // PAGE UP
         case  34: // PAGE DOWN
            e.preventDefault();
         }
         onKeyPress(e.keyCode);
      }
   }, true);
   window.addEventListener('keyup', function(e) {
      if (! isEditing())
         onKeyRelease(e.keyCode);
   }, true);
}

addEventListenersToCanvas(myCanvas);

let squareVertexBuffer = [ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ];

function gl_start(canvas, vertexShader, fragmentShader) {           // START WEBGL RUNNING IN A CANVAS

   addEventListenersToCanvas(canvas);

   setTimeout(function() {
      try { 
         canvas.gl = canvas.getContext('experimental-webgl');              // Make sure WebGl is supported.
      } catch (e) { throw 'Sorry, your browser does not support WebGL.'; }

      let gl = canvas.gl;

      canvas.setShaders = function(vertexShader, fragmentShader) {         // Add the vertex and fragment shaders:

         let program = gl.createProgram();                                 // Create the WebGL program.

         function addshader(type, src) {                                        // Create and attach a WebGL shader.

            let shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);

            if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	                                                                  // Get the correct line number in the
               let msg = gl.getShaderInfoLog(shader);                     // error message by subtracting the
	       msg = msg.substring(9, msg.length);                        // number of lines in the shaderHeader.
	       let lineNumber = parseInt(msg);
	       msg = (lineNumber - nHeaderLines) + msg.substring(msg.indexOf(':'), msg.length);

	       error = {
	          name: 'Error at line',
		  message: msg
	       };
            }
	    else
               gl.attachShader(program, shader);
         };

         addshader(gl.VERTEX_SHADER  , shaderHeader + vertexShader);            // Add the vertex and fragment shaders.
         addshader(gl.FRAGMENT_SHADER, shaderHeader + fragmentShader);

         try {
            gl.linkProgram(program);                                            // Link the program, report any errors.
            gl.useProgram(program);
         } catch (e) {
	    console.log("AHA!!!", e);
	 }
         gl.getProgramParameter(program, gl.LINK_STATUS);
         gl.program = program;
         gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());                     // Create a square as a triangle strip

         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ]), gl.STATIC_DRAW);

         gl.enable(gl.DEPTH_TEST);
         gl.depthFunc(gl.LEQUAL);
         gl.clearDepth(-1);
         gl.enable(gl.BLEND);
         gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

         let bpe = Float32Array.BYTES_PER_ELEMENT;

         let aPos = gl.getAttribLocation(program, 'aPos');                      // Set aPos attribute for each vertex.
         gl.enableVertexAttribArray(aPos);
         gl.vertexAttribPointer(aPos , 3, gl.FLOAT, false, VERTEX_SIZE * bpe,  0 * bpe);
      }

      canvas.setShaders(vertexShader, fragmentShader);                     // Initialize everything,

   }, 30); // Wait 100 milliseconds after page has loaded before starting WebGL.
}

S.setUniform = function(type, name, a, b, c, d, e, f) {
   if (S.gl.init) {
      let loc = S.gl.getUniformLocation(S.gl.program, name);
      (S.gl['uniform' + type])(loc, a, b, c, d, e, f);
   }
}

let defaultVS = 'attribute vec3 aPos;varying vec3 vPos;void main(){gl_Position=vec4(vPos=aPos,1.);}';
let defaultFS = 'varying vec3 vPos;void main(){gl_FragColor=vec4(sqrt(vPos),1.);}';

let vertexShader = defaultVS, fragmentShader = defaultFS;

S.setVertexShader = str => {
   if (S.gl.init && str != vertexShader)
      myCanvas.setShaders(vertexShader = str, fragmentShader);
}

S.setFragmentShader = str => {
   if (S.gl.init && str != fragmentShader)
      myCanvas.setShaders(vertexShader, fragmentShader = str);
}

gl_start(myCanvas, vertexShader, fragmentShader);

S.gl = { drawArrays : () => {} };
S.gl.init = false;

setTimeout(function() {
   S.gl = myCanvas.gl;
   S.gl.init = true;
   vertexShader   = defaultVS;
   fragmentShader = defaultFS;
}, 60);

}

