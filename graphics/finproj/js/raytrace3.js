
rooms.raytrace3 = function() {

lib3D();

description = `<b>Notes for Thursday September 30</b>
               <p>
               Adding matrices and cubes
	       <br>
	       to our spheres raytracer
	       <br>
	       in a fragment shader`;

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

   S.sc = [0];

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

   uniform mat4 uCIM;
   uniform vec4 uCube[6];

   uniform float uTime;
   varying vec3 vPos;

   // YOU CAN CHANGE CAMERA FOCAL LENGTH.
   // MAYBE YOU CAN TRY MAKING THIS A SLIDER.

   float fl = 3.0;

   vec3 bgColor = vec3(.3,.4,.5);
   //vec3 bgColor = vec3(.5,.5,.5);

   // INTERSECT A RAY WITH A HALFSPACE.

   float rayHalfspace(vec3 V, vec3 W, vec4 H) {
      vec4 V1 = vec4(V, 1.);
      vec4 W0 = vec4(W, 0.);
      return -dot(V1, H) / dot(W0, H);
   }

   // INTERSECT A RAY WITH A CUBE.

   vec4 rayCube(vec3 V, vec3 W, mat4 IM) {

      float tIn = -1000., tOut = 1000.;

      // WE DID IT THIS WAY FIRST (AWKWARD).
/*
      vec4 H0 = vec4(-1.,0.,0.,-1.) * IM;
      vec4 H1 = vec4( 1.,0.,0.,-1.) * IM;
      vec4 H2 = vec4(0.,-1.,0.,-1.) * IM;
      vec4 H3 = vec4(0., 1.,0.,-1.) * IM;
      vec4 H4 = vec4(0.,0.,-1.,-1.) * IM;
      vec4 H5 = vec4(0.,0., 1.,-1.) * IM;

      float t0 = rayHalfspace(V, W, H0);
      float t1 = rayHalfspace(V, W, H1);
      float t2 = rayHalfspace(V, W, H2);
      float t3 = rayHalfspace(V, W, H3);
      float t4 = rayHalfspace(V, W, H4);
      float t5 = rayHalfspace(V, W, H5);

      if (dot(H0.xyz, W) < 0.) tIn = max(tIn, t0); else tOut = min(tOut, t0);
      if (dot(H1.xyz, W) < 0.) tIn = max(tIn, t1); else tOut = min(tOut, t1);
      if (dot(H2.xyz, W) < 0.) tIn = max(tIn, t2); else tOut = min(tOut, t2);
      if (dot(H3.xyz, W) < 0.) tIn = max(tIn, t3); else tOut = min(tOut, t3);
      if (dot(H4.xyz, W) < 0.) tIn = max(tIn, t4); else tOut = min(tOut, t4);
      if (dot(H5.xyz, W) < 0.) tIn = max(tIn, t5); else tOut = min(tOut, t5);

      if (tIn > tOut)
         return vec4(0.,0.,0.,-1.);

      if (tIn==t0) return vec4(normalize(H0.xyz), t0);
      if (tIn==t1) return vec4(normalize(H1.xyz), t1);
      if (tIn==t2) return vec4(normalize(H2.xyz), t2);
      if (tIn==t3) return vec4(normalize(H3.xyz), t3);
      if (tIn==t4) return vec4(normalize(H4.xyz), t4);
                   return vec4(normalize(H5.xyz), t5);
*/
      // THEN WE IMPROVED IT TO THIS MORE GENERAL WAY.

      vec3 N = vec3(0.);
      for (int i = 0 ; i < 6 ; i++) {
         vec4 H = uCube[i] * IM;

	 // SCALE SO THAT H.xyz IS UNIT LENGTH.

	 H /= sqrt(dot(H.xyz, H.xyz));

	 // ARE WE ENTERING OR LEAVING THE CUBE?

	 float t = rayHalfspace(V, W, H);
	 if (dot(W, H.xyz) < 0.) {

	    // IF THIS IS ENTRY WITH GREATEST t
	    // THEN SET THE SURFACE NORMAL.

	    if (t > tIn)
	       N = H.xyz;
            tIn = max(tIn, t);
	 }
	 else {
            tOut = min(tOut, t);
	 }
      }

      // PACK SURFACE NORMAL AND t INTO A vec4.

      return vec4(N, tIn > tOut ? -1. : tIn);
   }

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

            FOR HOMEWORK DUE OCT 1:

            ADD SPECULAR COMPONENT TO c HERE.

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

            FOR HOMEWORK DUE OCT 1:

            ADD MIRROR REFLECTIONS HERE.

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

      // WE FIRST CREATED AN INVERSE MATRIX EACH PIXEL.

/*
      float c = cos(uTime),
            s = sin(uTime);
      mat4 M = mat4(.2  ,  0.  ,  0.  ,  0.,
                    0.  ,  .2*c,  .2*s,  0.,
                    0.  , -.2*s,  .2*c,  0.,
                    0.  ,  0.  ,  0.  ,  1.);
*/
      // BUT THEN WE DID IT A BETTER WAY,
      // PASSING IN THE INVERSE MATRIX FROM THE CPU.

      vec4 Nt = rayCube(V, W, uCIM);
      if (Nt.w > 0. && Nt.w < tMin) {
         tMin = Nt.w;

         // FOR NOW WE ARE JUST DOING FAKE SHADING
	 // ON THE CUBE. WE NEED TO CHANGE THIS.

         color = vec3(.1+max(0.,dot(Nt.xyz,vec3(.5))));
      }

      //color = mix(bgColor, color, pow(.8, tMin));

      gl_FragColor = vec4(sqrt(color), 1.);
   }
\`);
`,
vertex: `
S.setVertexShader(\`

   attribute vec3 aPos;
   varying   vec3 vPos;
   uniform   mat4 uCIM;

   void main() {
      vec4 pos = vec4(aPos, 1.);
      //pos = uCIM * pos;
      vPos = pos.xyz;
      gl_Position = vec4(aPos, 1.);
   }

\`)
`,
render: `

   // DEFINE SOME USEFUL MATRIX PRIMITIVES.

   let identity = () => [1,0,0,0,
                         0,1,0,0,
                         0,0,1,0,
                         0,0,0,1];

   let scale = s => [s[0],0,0,0,
                     0,s[1],0,0,
                     0,0,s[2],0,
                     0,0,0,1];

   let rotx = theta => {
      let c = Math.cos(theta);
      let s = Math.sin(theta);

      return [
         1, 0, 0, 0,
         0, c, s, 0,
         0,-s, c, 0,
         0, 0, 0, 1 ];
   }

   let rotz = theta => {
      let c = Math.cos(theta);
      let s = Math.sin(theta);

      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1 ];
   }

   // SET TIME IN GPU FOR THIS ANIMATION FRAME.

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
   S.sc[2] = [ -.75 - .7*s,-.75 - .2*c,-5+4*c, .3, 0,0,0];
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

   // PASS IN THE 6 HALFSPACES FOR A UNIT CUBE.

   S.setUniform('4fv', 'uCube', [-1,0,0,-1,
                                  1,0,0,-1,
                                 0,-1,0,-1,
                                 0, 1,0,-1,
                                 0,0,-1,-1,
                                 0,0, 1,-1]);

   // FIRST WE MANUALLY CONSTRUCTED THE INVERSE MATRIX.

/*   
   let cM = [.2*c, .2*s, 0, 0,
            -.2*s, .2*c, 0, 0,
              0, 0,.2, 0,
              0, 0,.2, 1];
*/

   // THEN WE CHANGED TO A MORE GENERAL AND POWERFUL
   // APPROACH: COMBINING PRIMITIVE MATRIX OPERATIONS.

   let cM = identity();

   cM = matrixMultiply(cM, rotx(time));
   cM = matrixMultiply(cM, rotz(time));
   cM = matrixMultiply(cM, scale([.1,.2,.3]));

   S.setUniform('Matrix4fv', 'uCIM', false,
                matrixInverse(cM));

   let vertexBuffer = [
       .5*c,.5,0, .5,.5,0,
       -.5+.1*s,-.2,0, .5,-.2,0,
       -.3-.1*c,-.5,0, .3,-.5,0,
   ];
   S.gl.bufferData(S.gl.ARRAY_BUFFER, new Float32Array(vertexBuffer), S.gl.STATIC_DRAW);

   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, vertexBuffer.length / 3);
`,
events: `
   ;
`
};

}

