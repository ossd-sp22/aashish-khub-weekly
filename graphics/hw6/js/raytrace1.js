
rooms.raytrace1 = function() {

lib3D();

description = `Raytracing to spheres<br>in a fragment shader`;

code = {
'init':`

   // ADD INTERACTIVE WIDGETS TO THE HTML PAGE.

   setDescription(description + \`
      <p>
          <input type=range id=red   > red
      <br><input type=range id=green > green
      <br><input type=range id=blue  > blue
      <p>
          <input type=range id=radius> radius
   \`);

   // INITIALIZE THE SPHERE DATA.

   S.nS = 300;
   S.sc = [];
   let rnd = () => Math.random() - .5;
   for (let n = 0 ; n < S.nS ; n++)
      S.sc.push([rnd(), rnd(), rnd(), .05, 0,0,0]);
`,
fragment: `
S.setFragmentShader(\`

   // MODIFY STRING TO ADD NUMBER OF SPHERES.

   const int nS = \` + S.nS + \`;
   const int nL = 2;

   // LIGHTS AND SPHERES DATA COMES FROM CPU.

   uniform vec3 uLd[nL];
   uniform vec3 uLc[nL];

   uniform vec4 uS[nS];

   uniform float uTime;
   varying vec3 vPos;

   // YOU CAN CHANGE CAMERA FOCAL LENGTH.
   // MAYBE YOU CAN TRY MAKING THIS A SLIDER.

   float fl = 3.0;

   vec3 bgColor = vec3(.1,.2,.5);

   // WE ARE NOT YET USING SPECULAR.

   vec3 Ambient = bgColor;
   vec3 Diffuse = vec3(.9);
   vec4 Specular = vec4(1.,1.,1., 10.);

   // INTERSECT A RAY WITH A SPHERE.
   // IF NO INTERSECTION, RETURN NEGATIVE VALUE.

   float raySphere(vec3 V, vec3 W, vec4 S) {
      V -= S.xyz;
      float b = dot(V, W);
      float d = b * b - dot(V, V) + S.w * S.w;
      return d < 0. ? -1. : -b - sqrt(d);
   }

   // GOURAUD SHADING WITH CAST SHADOWS.

   vec3 shadeSphere(vec3 P, vec4 S) {
      vec3 N = normalize(P - S.xyz);

      vec3 c = Ambient * (.5 + noise(20. * P));
      for (int l = 0 ; l < nL ; l++) {

         // ARE WE SHADOWED BY ANY OTHER SPHERE?

         float t = -1.;
         for (int n = 0 ; n < nS ; n++)
	    t = max(t, raySphere(P, uLd[l], uS[n]));

         // IF NOT, ADD LIGHTING FROM THIS LIGHT

         if (t < 0.)

            c += Diffuse *
	         max(0., dot(N, uLd[l])) * uLc[l];
      }

      return c;
   }

   void main() {

      // START WITH SKY COLOR.

      vec3 color = bgColor;

      // FORM THE RAY FOR THIS PIXEL.

      vec3 V = vec3(0.,0.,fl);
      vec3 W = normalize(vec3(vPos.xy, -fl));

      // THEN SEE WHAT IT HITS FIRST.

      float tMin = 10000.;
      for (int n = 0 ; n < nS ; n++) {
         float t = raySphere(V, W, uS[n]);
         if (t > 0. && t < tMin) {
            color = shadeSphere(V + t * W, uS[n]);
	    tMin = t;
         }
      }

      gl_FragColor = vec4(sqrt(color), 1.);
   }
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
render: `
   S.setUniform('1f', 'uTime', time);

   // SPECIFY COLORED KEY LIGHT + FILL LIGHT.

   S.setUniform('3fv', 'uLd', [
      .57, .57, .57,
     -.57,-.57,-.57,
   ]);

   // USE SLIDERS TO SET COLOR OF KEY LIGHT.

   let r = red.value   / 100;
   let g = green.value / 100;
   let b = blue.value  / 100;
   S.setUniform('3fv', 'uLc', [
       r,g,b,
       .5,.3,.1
   ]);

   // ANIMATE SPHERE POSITIONS BEFORE RENDERING.

   let sData = [];
   for (let n = 0 ; n < S.nS ; n++) {

      // RADIUS IS CONTROLLED BY USER VIA SLIDER.

      S.sc[n][3] = .01 + .09 * radius.value / 100;

      // SPHERES MOVE AROUND IN RANDOM TRAJECTORIES.

      for (let i = 0 ; i < 3 ; i++) {
         S.sc[n][i+4] += .01 * (Math.random() - .5);
         S.sc[n][i] = (S.sc[n][i] + S.sc[n][i+4]) * .6;
      }

      // THE GPU NEEDS THE DATA AS A FLAT ARRAY.

      for (let i = 0 ; i < 4 ; i++)
         sData.push((i<3?3:1) * S.sc[n][i]);
   }
   S.setUniform('4fv', 'uS', sData);

   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
events: `
   ;
`
};

}

