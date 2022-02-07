
rooms.raytrace4 = function() {

lib3D();

description = `<b>HW3 Artwork: <i> Abstract Geometric Orbits </i></b>
               <p>
               By positioning refracting beads of various materials <br>
               in orbit-like structures, we explore a soothing <br>
               periodicity. Observe the refraction in the orbit, <br>
               shadows on the cuboid below, and the abstract <br>
               revolving geometry above. 
               `;

code = {
'init':`

   // ADD INTERACTIVE WIDGETS TO THE HTML PAGE.

   setDescription(description + \`
      <p>
          <input type=range id=red   > red light
      <br><input type=range id=green > green light
      <br><input type=range id=blue  > blue light

      <br> <br> <b>Change the Refractive Index of the beads:</b>
      <br> <input type=range id=refr_index value = 20> Bead Refractive Index
  </p>
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

   S.material = [gold,blue_plastic,red_plastic,
                 lead,steel,copper,steel, lead];
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
   uniform float refr_index;
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
            vec3 Li_dirn = uLd[l];
            vec3 Li_col  = uLc[l];
            vec3 R_i = 2.*N*dot(N,Li_dirn) - Li_dirn;
            float p = 8.0;
            c += Li_col * Specular.xyz * pow(max(0., dot(R_i, -W)),p);
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

   // FOR HOMEWORK DUE OCT 19, IMPLEMENT THIS FUNCTION.
   // JUST FOLLOW THE ALGORITHM IN THE COURSE NOTES.

   vec3 quadricSurfaceNormal(mat4 Q, vec3 P) {
	// fx = (2a)x  + (b+e)y + (c+i)z + (d+m)
	// fy = (b+e)x + (2f)y  + (g+j)z + (h+n)
	// fz = (c+i)x + (g+j)y + (2k)z  + (l+o)

		vec4 fx_coeff = vec4( 2.*Q[0][0], 	Q[0][1]+Q[1][0],  Q[0][2]+Q[2][0], 	Q[0][3]+Q[3][0] );
		vec4 fy_coeff = vec4( Q[1][0]+Q[0][1], 2.*Q[1][1],    Q[1][2]+Q[2][1], 	Q[1][3]+Q[3][1] );
		vec4 fz_coeff = vec4( Q[2][0]+Q[0][2], Q[2][1]+Q[1][2], 2.*Q[2][2],	 	Q[2][3]+Q[3][2] );
		
		vec4 P_4 = vec4(P,1.);

		float fx_val = dot(P_4, fx_coeff);
		float fy_val = dot(P_4, fy_coeff);
		float fz_val = dot(P_4, fz_coeff);

		vec3 N = normalize(vec3(fx_val, fy_val, fz_val));

      	return N; // YOU'LL NEED TO REPLACE THIS.
   }

   float n1 = 1.0; // AIR INDEX OF REFRACTION
   float n2 = 1.0 + refr_index/100.00; // GLASS INDEX OF REFRACTION

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
*****************************************************/
			
			vec3 W1 = W;
			vec3 C1 = N * dot(W1, N);
			vec3 S1 = W1 - C1;
			float sin1 = sqrt(dot(S1,S1));
			float cos1 = sqrt(1. - sin1 * sin1);
			//here be Snell's Law:
			float sin2 = sin1 * (n1/n2);
			float cos2 = sqrt(1. - sin2 * sin2 );
			vec3 C2 = C1 * cos2 / cos1;
			vec3 S2 = S1 * sin2 / sin1;
			vec3 W2 = C2 + S2;

/*****************************************************

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
			float t2 = raySphereExit(P,W2,uS[n]);
			vec3 P2 = P + t2*W2;
			float sin3 = sin2 * (n2/n1);
			float cos3 = sqrt(1. - sin3 * sin3 );
			vec3 C3 = C2 * cos3 / cos2; 
			vec3 S3 = S2 * sin3 / sin2;
			vec3 W3 = C3 + S3;
		    float tMin_new = 10000.;
		    int sphereHit = -1; 
		    mat4 hitMat;
		    vec3 N_new;
      		for (int n_new = 0 ; n_new < nS ; n_new++) {
      			if (n_new == n) continue; //exclude current ball!
         		float t_new = raySphere(P2, W3, uS[n_new]);	
     			vec3 colorToAdd;

         		if (t_new > 0. && t_new < tMin_new) {
	         		vec3 P3 = P2 + tMin_new * W3; 
         			sphereHit = n_new;
         			tMin_new = t_new;
         			hitMat = uSm[n_new];
         			N_new = normalize(P3 - uS[n_new].xyz);
         			colorToAdd = shadeSurface(P3, W3, N_new, hitMat);
         		}
         		if (sphereHit > 0){
         			color += uSm[n][2].rgb * colorToAdd;
         		}
         	}
         }
      }

      // TO RENDER THE CUBE, WE USE THE
      // INVERSE MATRIX FROM THE CPU.

      vec4 Nt = rayCube(V, W, uCIM);
      if (Nt.w > 0. && Nt.w < tMin) {
         tMin = Nt.w;
         vec3 P = V + tMin * W;
         vec3 N = Nt.xyz;
         color = shadeSurface(P, W, N, uSm[2]);
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
*****************************************************/
//code here:

		mat4 Q = mat4(0.);
		vec2 TS = vec2(-1000.,1000.);
		vec2 TT; 
	    vec4 V1 = vec4(V, 1.);
	    vec4 W0 = vec4(W, 0.);

		for(int n = 0; n < 2; n++){
	        float a = dot(W0, uQ[n]*W0);
	        float b = dot(W0, uQ[n]*V1) + dot(V1, uQ[n]*W0);
	        float c = dot(V1, uQ[n]*V1);

	        TT = solveQuadratic(a,b,c);

	    	if(TT.x > TS.x) {
	    		Q = uQ[n];
	    	} //close if TT.x > TS.x

        	TS.x = max(TS.x, TT.x);     // THIS IMPLEMENTS
        	TS.y = min(TS.y, TT.y);     // INTERSECTION.

		} //close the for loop iterating through surfaces

	      // IF RAY HITS THE SHAPE AND IT IS ALSO NEAREST
	  
        if( ((TS.x < TS.y) && (TS.x < tMin)) ){
	         vec3 P = V + TS.x * W;
	         vec3 N = quadricSurfaceNormal(Q, P);
	         color = shadeSurface(P, W, N, uSm[1]);
		} //close the if .. && .. segment

/*****************************************************

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
   
   let roty = theta => {
      let c = Math.cos(theta);
      let s = Math.sin(theta);

      return [
         c, 0, s, 0,
         0, 1, 0, 0,
        -s, 0, c, 0,
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
   S.setUniform('1f','refr_index', refr_index.value);


   // ANIMATE SPHERE POSITIONS BEFORE RENDERING.

   let sData = [];
   let smData = [];

   let c = Math.cos(time),
       s = Math.sin(time);

function getXYZr (r, phi, z, rad) {
    x =  0 + (r*Math.cos(phi));
    y =  0 + (r*Math.sin(phi));
    return( [x,z,y,rad] )
  }

   // SPECIFY LOCATIONS OF SPHERES.

   S.sc = [
    	getXYZr(0,0,s*0.05,0.26), //1 center 

      	getXYZr(0.6,time,				0,0.1), //3 out of phase perfectly
      	getXYZr(0.6,time+Math.PI*2./3.,	0,0.1),
      	getXYZr(0.6,time+Math.PI*4./3.,	0,0.1),

      	getXYZr(0.3,-4*time+Math.PI,-.4,0.05), //2 up and 2 down spinning opposite      	
      	getXYZr(0.3,-4*time,-.4,0.05),

      	getXYZr(0.6,-2*time,.4,0.05),
      	getXYZr(0.6,-2*time+Math.PI,.4,0.05), 

   ];

   for (let n = 0 ; n < S.sc.length ; n++) {

      // SPHERE RADIUS IS VARIED VIA SLIDER.

      //S.sc[n][3] = .2 + .2 * radius.value / 100;

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

   cM = matrixMultiply(cM, translate([0.,-.5,0.]));

   cM = matrixMultiply(cM, roty(-0.333*time));

   cM = matrixMultiply(cM, scale([1.,.05,0.4]));

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
   qM = matrixMultiply(qM, translate([0.,.8,0]));
   
   qM = matrixMultiply(qM, roty(time/3));
   

   qM = matrixMultiply(qM, scale([.2,.2,1.]));
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
      ? [1,0,0,0, 
      	0,1,0,0, 
  		0,0,0,-1,
  		0,0,0,0]  // PARABOLOID
      : [0,0,0,0, 
      	0,0,0,0, 
      	0,0,1,0, 
      	0,0,0,-1]; // SLAB

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

