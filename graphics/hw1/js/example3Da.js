
rooms.example3Da = function() {

lib3D();

description = 'Interactive WebGL<br>on a single square.';

code = {
'explanation': `
   S.html(\`
      Most of the work happens in a fragment shader.
      <p>
      Input to the fragment shader is x,y and time: <code>uPos, uTime</code>
      <p>
      We can also interact by adding information about the cursor: <code>uX,uY</code>
      <p>
      Output at each fragment is: red,green,blue,alpha
   \`);
`,
vertex: `
S.setVertexShader(\`

   attribute vec3 aPos;
   varying   vec3 vPos;

   void main() {
      vPos = aPos;
      gl_Position = vec4(aPos, 1.);
   }

\`)
`,
fragment: `
S.setFragmentShader(\`

   uniform float uTime;
   uniform float uSpace;
   uniform float uX;
   uniform float uY;
   varying vec3 vPos;

   void main() {
      vec3 p = vPos - vec3(uX, uY, 0.);
      p = uSpace > 0. ? p.yxz : p;
      vec3 color = sin(20.*p);
      gl_FragColor = vec4(sqrt(color), 1.);
   }

\`)
`,
render: `
   S.setUniform('1f', 'uTime', time);
   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
events: `
   onDrag = (x,y) => {
      S.setUniform('1f', 'uX', x);
      S.setUniform('1f', 'uY', y);
   }
   onKeyPress  =k=>S.setUniform('1f','uSpace',k==32);
   onKeyRelease=k=>S.setUniform('1f','uSpace',false);
`
}

}

