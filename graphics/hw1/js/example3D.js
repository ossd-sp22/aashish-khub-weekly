
rooms.example3D = function() {

lib3D();

description = 
`<b> Assignment 1 Artwork: <i> On the Transference of Dreams</i> </b> 
<br> <br> <p> Surreal, swirly patterns, with a soothing underlying oscillation. 
Cool colors dominate the scene at first--but hold down the space bar, and 
watch as it warms with the threatening urgency of a good dream quickly 
descending into a nightmare. </p> `;

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
uniform float uTime, uSpace, uX, uY;
   varying vec3 vPos;
   float turbulence(vec3 p) {
      float t = 0., f = 1.;
      for (int i = 0 ; i < 3 ; i++) {
         t += abs(noise(f * p)) / f;
         f *= 3.;
      }
      return t;
   }
   vec3 stripes(float x, float y) {
      float speed = uSpace == 0. ? 1. : 100.;
      float t = pow(0.8*sin(1.1*x*y+(speed*uTime)) + .2, .8);
      return vec3(t, t*t, t*t*t);
   }

   void main() {
      vec3 p = 4.2*vPos;
      vec3 color = stripes(p.x + 5.*turbulence(p/1.8), p.y+5.*turbulence(p/1.2));
      gl_FragColor = uSpace == 1. ? vec4(color, 1.) : vec4(color.zyx, 1.);
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

