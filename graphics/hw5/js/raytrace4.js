
rooms.raytrace4 = function() {

lib3D();

description = `<b>Homework for Oct 19</b>
               <p>
               Adding refraction and
               <br>
               quadric surfaces into
               <br>
               a fragment shader`;

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

   let copper =
       [.15,.05,.025,0,.3,.1,.05,0,.6,.2,.1,3,0,0,0,0];
   let gold =
       [.25,.15,.025,0,.5,.3,.05,0,1,.6,.1,6,0,0,0,0];
   let lead =
       [.05,.05,.05,0,.1,.1,.1,0, 1,1,1,5, 0,0,0,0];
   let red_plastic =
       [.025,.0,.0,0,.5,.0,.0,0, 2,2,2,20, 0,0,0,0];
   let steel =
       [.25,.25,.25,0,.5,.5,.5,0,1,1,1,6,0,0,0,0];
   let blue_plastic =
       [0,.05,.1,0, 0,.5,1,0, 2,2,2,20, 0,0,0,0];

   S.material = [copper,gold,red_plastic,
                 lead,steel,blue_plastic];
`,
fragment: `
S.setFragmentShader(\`

   // MODIFY STRING TO ADD NUMBER OF SPHERES.

   const int nS = \` + S.sc.length + \`;
   const int nSm = \` + S.material.length + \`;
   const int nL = 2;

   // LIGHTS/SHAPES/MATERIALS/TIME DATA COME FROM CPU.

   uniform vec3 uLd[nL];
   uniform vec3 uLc[nL];

   uniform vec4 uS[nS];
   uniform mat4 uSm[nSm];

   uniform mat4 uCIM;
   uniform vec4 uCube[6];

   uniform mat4 uQ[2];

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

      // ALGORITHM TO INTERSECT A RAY WITH 
      // AN INTERSECTION OF HALFSPACES

      vec3 N = vec3(0.);
      for (int i = 0 ; i < 6 ; i++) {

         // TRANSFORM FACE TO GET HALFSPACE.

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
         else
            tOut = min(tOut, t);
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

   float raySphereExit(vec3 V, vec3 W, vec4 S) {
      V = V - S.xyz + .001 * W;
      float b = dot(V, W);
      float d = b * b - dot(V, V) + S.w * S.w;
      return d < 0. ? -1. : -b + sqrt(d);
   }

   // GOURAUD SHADING WITH CAST SHADOWS.

   vec3 shadeSurface(vec3 P, vec3 W, vec3 N, mat4 m) {
      vec3 Ambient  = m[0].rgb;
      vec3 Diffuse  = m[1].rgb;
      vec4 Specular = m[2];

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

/*----------------------------------------------------

            FOR HOMEWORK DUE OCT 1:

            YOU ADDED SPECULAR COMPONENT TO c HERE.

----------------------------------------------------*/

         }
      }

      return c;
   }

   // RETURN BOTH ROOTS OF A QUADRATIC EQUATION.

   vec2 solveQuadratic(float a, float b, float c) {
      float d = b*b - 4.*a*c;
      if (d < 0.)
         return vec2(1000.,-1000.);
      float t0 = (-b - sqrt(d)) / (2.*a);
      float t1 = (-b + sqrt(d)) / (2.*a);
      return vec2(min(t0,t1), max(t0,t1));
   }


/*****************************************************

   // FOR HOMEWORK DUE OCT 19, IMPLEMENT THIS FUNCTION.
   // JUST FOLLOW THE ALGORITHM IN THE COURSE NOTES.

   vec3 quadricSurfaceNormal(mat4 Q, vec3 P) {

      return vec3(0.); // YOU'LL NEED TO REPLACE THIS.
   }

*****************************************************/


   float n1 = 1.0; // AIR INDEX OF REFRACTION
   float n2 = 1.5; // GLASS INDEX OF REFRACTION

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
            vec3 N = normalize(P - uS[n].xyz);
            color = shadeSurface(P, W, N, uSm[n]);
            tMin = t;

/*****************************************************

            FOR HOMEWORK DUE OCT 19 BEFORE CLASS:

            IMPLEMENT REFRACTION, AS FOLLOWS:

            FIND RAY DIRECTION W2 INTO THE SPHERE:

            C1 = N * dot(W1, N)
            S1 = W1 - C1
            sin1 = length(S1)
            n1 * sin1 = n2 * sin2
            sin2 = sin1 * n1 / n2
            cos2 = sqrt(1 - sin2 * sin2)
            C2 = C1 * cos2 / cos1
            S2 = S1 * sin2 / sin1
            W2 = C2 + S2

            THEN, FIND THE INTERSECTION OF THAT RAY P2
	    WITH THE REAR SURFACE OF THE SPHERE. I
	    RECOMMEND THAT YOU WRITE A NEW FUNCTION
	    raySphereExit() WHICH RETURNS THE SECOND
	    ROOT OF THE QUADRATIC EQUATION, RATHER
	    THAN THE FIRST ROOT.

            t2 = raySphereExit(P, W2, uS[n])
            P2 = P + t2 * W2

            THEN, COMPUTE DIRECTION OF THE REFRACTED
            RAY W3 WHICH EMERGES OUT OF THE SPHERE.

            sin3 = sin2 * n2 / n1
            cos3 = sqrt(1 - sin3 * sin3)
            C3 = C2 * cos3 / cos2
            S3 = S2 * sin3 / sin2
            W3 = C3 + S3

            THEN LOOP THROUGH ALL SPHERES, TO FIND
            THE SPHERE (IF ANY) WHICH IS THE FIRST
            SPHERE HIT BY RAY: P2 -> W3

            IF A SPHERE WAS HIT, SHADE THAT SPHERE,
            AND ADD THAT SHADE TO color. YOU CAN
            TINT THE REFLECTION BY MULTIPLYING BY
            THE SPECULAR PHONG COLOR: uSm[n][2].rgb

*****************************************************/

         }
      }

      // TO RENDER THE CUBE, WE USE THE
      // INVERSE MATRIX FROM THE CPU.

      vec4 Nt = rayCube(V, W, uCIM);
      if (Nt.w > 0. && Nt.w < tMin) {
         tMin = Nt.w;
         vec3 P = V + tMin * W;
         vec3 N = Nt.xyz;
         color = shadeSurface(P, W, N, uSm[4]);
      }

      // TO RENDER THE QUADRIC SURFACE, WE
      // GET THE COEFFICIENTS FROM THE CPU.


/*****************************************************

      FOR HOMEWORK DUE OCT 19, RAY TRACE TO A CYLINDER.

      HERE IS THE ALGORITHM:

      // MAINTAIN A WORKING COEFFICIENTS MATRIX:

         mat4 Q

      // YOU WILL NEED IT TO COMPUTE THE NORMAL.

      // ALSO MAINTAIN A WORKING RANGE OF t IN A vec2:

         TS.x = -1000
	 TS.y =  1000

      // LOOP THROUGH ALL QUADRIC SURFACES IN SHAPE:

         // SOLVE QUADRATIC EQUATION ALONG RAY.
	 // YOU WANT TO SOLVE FOR:

	    a t^2 + b t + c = 0

	 // WHERE:

	    V1 = vec4(V, 1.)
	    W0 = vec4(W, 0.)

	 // AND, AS IN THE COURSE NOTES:

            a = dot(W0, uQ[n]*W0)
            b = dot(W0, uQ[n]*V1) + dot(V1, uQ[n]*W0)
            c = dot(V1, uQ[n]*V1)

         TT = THE TWO ROOTS OF THIS QUADRATIC EQUATION.

	 IF TT.x > TS.x
	    Q = uQ[n]   // USE THIS SURFACE FOR NORMAL.

         TS.x = MAX(TS.x, TT.x)     // THIS IMPLEMENTS
         TS.y = MIN(TS.y, TT.y)     // INTERSECTION.

      // IF RAY HITS THE SHAPE AND IT IS ALSO NEAREST

      IF TS.x < TS.y AND TS.x < tMIN:

         P = V + TS.x * W
         N = quadricSurfaceNormal(Q, PP)
         color = shadeSurface(P, W, N, uSm[4])

*****************************************************/


      // UNCOMMENT OUT NEXT LINE TO IMPLEMENT MIST.

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

   let translate = t => [1,0,0,0,
                         0,1,0,0,
                         0,0,1,0,
                         t[0],t[1],t[2],1];

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


   // SPECIFY LOCATIONS OF SPHERES.

   S.sc = [
      [ -.35 + .1*c,-.05       ,-.2   , .3],
      [  .25       , .25 + .1*s, .2   , .3],
      [      - .7*s,     - .2*c,-5+4*c, .3],
      [  .35 - .2*s,-.05 + .2*c,-.5   , .3],
   ];

   for (let n = 0 ; n < S.sc.length ; n++) {

      // SPHERE RADIUS IS VARIED VIA SLIDER.

      S.sc[n][3] = .2 + .2 * radius.value / 100;

      // SEND SPHERE DATA TO GPU AS A FLAT ARRAY.

      for (let i = 0 ; i < 4 ; i++)
         sData.push(S.sc[n][i]);
   }

   S.setUniform('4fv', 'uS', sData);


   // SEND MATERIALS DATA TO GPU AS A FLAT ARRAY.

   for (let n = 0 ; n < S.material.length ; n++)
      smData = smData.concat(S.material[n]);

   S.setUniform('Matrix4fv', 'uSm', false, smData);


// CREATE A CUBE

   // PASS IN THE 6 HALFSPACES FOR A UNIT CUBE.

   S.setUniform('4fv', 'uCube', [-1,0,0,-1,
                                  1,0,0,-1,
                                 0,-1,0,-1,
                                 0, 1,0,-1,
                                 0,0,-1,-1,
                                 0,0, 1,-1]);

   // COMBINE PRIMITIVE MATRIX OPERATIONS
   // TO TRANSFORM THE CUBE.

   let cM = identity();
   cM = matrixMultiply(cM, rotx(time));
   cM = matrixMultiply(cM, rotz(time));
   cM = matrixMultiply(cM, scale([.4,.05,.03]));

   S.setUniform('Matrix4fv', 'uCIM', false,
                matrixInverse(cM));


// CREATE A CYLINDER

/*
   HERE WE TRANSFORM QUADRIC SURFACE COEFFICIENTS
   TO RENDER A SHAPE BOUND BY A QUADRIC SURFACE.

   I HAVE DEFINED A PARTICULAR ANIMATION AND THE
   DATA FOR A CYLINDER, AS THE INTERSECTION OF A
   TUBE AND A SLAB.

   YOU SHOULD FEEL FREE TO CREATE A DIFFERENT
   ANIMATION AND A DIFFERENT SHAPE.
*/

   let qM = identity();
   qM = matrixMultiply(qM, translate([.5,0,0]));
   qM = matrixMultiply(qM, rotx(time));
   qM = matrixMultiply(qM, rotz(time));
   qM = matrixMultiply(qM, rotx(2*time));
   qM = matrixMultiply(qM, scale([.2,.2,.4]));
   let qIM = matrixInverse(qM);

/*
   I HAVE IMPLEMENTED THE JAVASCRIPT SIDE OF THIS
   FOR YOU. TO COMPLETE THIS, YOU NEED TO IMPLEMENT
   THE ALGORITHM TO RAY TRACE TO QUADRIC SHAPES IN
   YOUR FRAGMENT SHADER.
*/

   let qData = [];
   for (let n = 0 ; n < 2 ; n++) {

      let Q = n==0
      ? [1,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,-1]  // TUBE
      : [0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,-1]; // SLAB

      // TRANSFORM COEFFICIENTS BY ANIMATION MATRIX.

      qData = qData.concat(
         matrixMultiply(matrixTranspose(qIM),
                        matrixMultiply(Q, qIM)));
   }
   S.setUniform('Matrix4fv', 'uQ', false, qData);


// RENDER THE SCENE.

   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
events: `
   ;
`
};

}

