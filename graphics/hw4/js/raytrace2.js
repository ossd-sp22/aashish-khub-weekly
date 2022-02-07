
rooms.raytrace2 = function() {

lib3D();

description = `Raytracing to spheres<br>in a fragment shader`;

code = {
'init':`

   // ADD INTERACTIVE WIDGETS TO THE HTML PAGE.

   setDescription(description + \`
      <p>
          <input type=range id=red   > red light
      <br><input type=range id=green > green light
      <br><input type=range id=blue  > blue light
      <p>
          <input type=range id=radius> radius
   \`);

   // INITIALIZE THE SPHERE DATA.

   S.sc = [];

   let copper  =
       [.15,.05,.025,0,.3,.1,.05,0,.6,.2,.1,3,0,0,0,0];
   let gold    =
       [.25,.15,.025,0,.5,.3,.05,0,1,.6,.1,6,0,0,0,0];
   let lead    =
       [.05,.05,.05,0,.1,.1,.1,0, 1,1,1,5, 0,0,0,0];
   let plastic =
       [.025,.0,.0,0,.5,.0,.0,0, 2,2,2,20, 0,0,0,0];

   S.material = [copper, gold, plastic, lead];
`,
fragment: `
S.setFragmentShader(\`

   // MODIFY STRING TO ADD NUMBER OF SPHERES.

   const int nS = \` + S.sc.length + \`;
   const int nL = 2;

   // LIGHTS AND SPHERES DATA COMES FROM CPU.

   uniform vec3 uLd[nL];
   uniform vec3 uLc[nL];

   uniform vec4 uS[nS];
   uniform mat4 uSm[nS];

   uniform float uTime;
   varying vec3 vPos;

   // YOU CAN CHANGE CAMERA FOCAL LENGTH.
   // MAYBE YOU CAN TRY MAKING THIS A SLIDER.

   float fl = 3.0;

   vec3 bgColor = vec3(.3,.4,.5);

   // INTERSECT A RAY WITH A SPHERE.
   // IF NO INTERSECTION, RETURN NEGATIVE VALUE.

   float raySphere(vec3 V, vec3 W, vec4 S) {
      V = V - S.xyz + .001 * W;
      float b = dot(V, W);
      float d = b * b - dot(V, V) + S.w * S.w;
      return d < 0. ? -1. : -b - sqrt(d);
   }

   // GOURAUD SHADING WITH CAST SHADOWS.

   vec3 shadeSphere(vec3 P, vec3 W, vec4 S, mat4 m) {
      vec3 Ambient  = m[0].rgb;
      vec3 Diffuse  = m[1].rgb;
      vec4 Specular = m[2];

      vec3 N = normalize(P - S.xyz);

      vec3 c = Ambient;
      for (int l = 0 ; l < nL ; l++) {

         // ARE WE SHADOWED BY ANY OTHER SPHERE?

         float t = -1.;
         for (int n = 0 ; n < nS ; n++)
	    t = max(t, raySphere(P, uLd[l], uS[n]));

         // IF NOT, ADD LIGHTING FROM THIS LIGHT

         if (t < 0.) {
            vec3 R = 2. * dot(N, uLd[l]) * N - uLd[l];
            c += uLc[l] *
	         Diffuse * max(0., dot(N, uLd[l]));

/*****************************************************

	    FOR HOMEWORK:

	    HERE YOU CAN ADD SPECULAR COMPONENT TO c.

*****************************************************/

         }
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
	    vec3 P = V + t * W;
            color = shadeSphere(P, W, uS[n], uSm[n]);
	    tMin = t;

/*****************************************************

            FOR HOMEWORK:

	    HERE YOU CAN ADD MIRROR REFLECTIONS.

	    THE KEY IS TO SHOOT A RAY FROM SURFACE
	    POINT P IN REFLECTION DIRECTION R, WHERE:

               R = 2 * dot(N, -W) * N + W

	    THEN LOOP THROUGH ALL SPHERES, TO FIND
	    THE SPHERE (IF ANY) WHICH IS THE FIRST
	    SPHERE HIT BY RAY: P -> W

	    IF A SPHERE WAS HIT, SHADE THAT SPHERE,
	    AND ADD THAT SHADE TO color. YOU CAN
	    TINT THE REFLECTION BY MULTIPLYING BY
	    THE SPECULAR PHONG COLOR: uSm[n][2].rgb

*****************************************************/

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
       .3,.2,.1
   ]);

   // ANIMATE SPHERE POSITIONS BEFORE RENDERING.

   let sData = [];
   let smData = [];

   let c = Math.cos(time),
       s = Math.sin(time);

   S.sc[0] = [ -.35 + .1*c, .35       ,-.2, .3, 0,0,0];
   S.sc[1] = [  .25       , .25 + .1*s, .2, .3, 0,0,0];
   S.sc[2] = [ -.35 - .2*s, .05 - .2*c,-.5, .3, 0,0,0];
   S.sc[3] = [  .35 - .2*s, .05 + .2*c,-.5, .3, 0,0,0];

   for (let n = 0 ; n < S.sc.length ; n++) {

      // SPHERE RADIUS IS VARIED VIA SLIDER.

      S.sc[n][3] = .2 + .2 * radius.value / 100;

      // SEND SPHERE DATA TO GPU AS A FLAT ARRAY.

      for (let i = 0 ; i < 4 ; i++)
         sData.push(S.sc[n][i]);

      smData = smData.concat(S.material[n]);
   }
   S.setUniform('4fv', 'uS', sData);
   S.setUniform('Matrix4fv', 'uSm', false, smData);

   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
events: `
   ;
`
};

}

