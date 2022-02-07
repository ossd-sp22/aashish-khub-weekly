/*
   lib3D.js -> lib3D2.js
   vertex -> 8 numbers
   	const VERTEX_MESH = 8;
	...
	S.VERTEX_MESH = VERTEX_MESH;
   square mesh
   glueMeshes function
   uvMesh function
   sphereMesh
   pass in uMatrix and uInvMatrix to vertexShader
   	apply to aPos -> pos -> vPos
	         aNor -> nor -> vNor
                 gl_Position = pos;
   S.drawMesh(mesh, matrix)
   create Matrix class
   two spheres
   modify z in vertexShader
                 gl_Position = pos * vec4(1.,1.,-.01,1.);
   create perspectiveMatrix
   pass in uPerspective to vertexShader
   transformMesh
   cubeMesh
   add save / restore to Matrix class
*/

rooms.scene2 = function() {

lib3D2();

description = `<b><i>Hally wishes you a Happy Halloween!</i></b>
               <p>
               Since this assignment came just in time for Halloween, I decided to make a happy little skeleton, doing his very own dance against a twilight setting!
               <br><br>
               Pay attention to the legs--specifically the knee and how it has been made to follow humanoid
               walking patterns (i.e. the shin only bends away from the thigh when the leg is ahead.)

               `;


code = {
'init':`
   S.squareMesh = [ -1, 1, 0,  0,0,1,  0,1,
                     1, 1, 0,  0,0,1,  1,1,
		    -1,-1, 0,  0,0,1,  0,0,
		     1,-1, 0,  0,0,1,  1,0 ];

   let glueMeshes = (a,b) => {
       let mesh = a.slice();
       mesh = mesh.concat(a.slice(a.length - S.VERTEX_SIZE, a.length));
       mesh = mesh.concat(b.slice(0, S.VERTEX_SIZE));
       mesh = mesh.concat(b);
       return mesh;
   }

/*
   let uvMesh = (f,nu,nv) => {
      let addVertex = V => {
         mesh = mesh.concat(V);
      }
      let mesh = [];
      for (let iv = 0 ; iv < nv ; iv++) {
         let v = iv / nv;
         if (iv > 0)
	    addVertex(f(0,v));
         for (let iu = 0 ; iu <= nu ; iu++) {
	    let u = iu / nu;
	    addVertex(f(u,v));
	    addVertex(f(u,v+1/nv));
	 }
	 addVertex(f(1,v+1/nv));
      }
      return mesh;
   }
*/

   let uvMesh = (f,nu,nv) => {
      let mesh = [];
      for (let iv = 0 ; iv < nv ; iv++) {
         let v = iv / nv;
	 let strip = [];
         for (let iu = 0 ; iu <= nu ; iu++) {
	    let u = iu / nu;
	    strip = strip.concat(f(u,v));
	    strip = strip.concat(f(u,v+1/nv));
	 }
	 mesh = glueMeshes(mesh, strip);
      }
      return mesh;
   }
` 
+ 
/*

   ___    _  _     ___      ___    ___            __  __    ___     ___    _  _     ___     ___   
  / __|  | || |   /   \    | _ \  | __|     o O O|  \/  |  | __|   / __|  | || |   | __|   / __|  
  \__ \  | __ |   | - |    |  _/  | _|     o     | |\/| |  | _|    \__ \  | __ |   | _|    \__ \  
  |___/  |_||_|   |_|_|   _|_|_   |___|   TS__[O]|_|__|_|  |___|   |___/  |_||_|   |___|   |___/  
_|"""""|_|"""""|_|"""""|_| """ |_|"""""| {======|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| 
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 

*/

`
   S.sphereMesh = uvMesh((u,v) => {
      let theta = 2 * Math.PI * u;
      let phi = Math.PI * v - Math.PI/2;
      let cu = Math.cos(theta);
      let su = Math.sin(theta);
      let cv = Math.cos(phi);
      let sv = Math.sin(phi);
   return [cu * cv, su * cv, sv,
              cu * cv, su * cv, sv,
	      u, v];
   }, 20, 10);

   S.tubeMesh = uvMesh((u,v) => { //MAKES A TUBE
      let theta = 2 * Math.PI * u;
      let cu = Math.cos(theta);
      let su = Math.sin(theta);
      let z = 2*v-1;
      return [cu, su, z, cu, su, z, u, v]
   }, 20, 10);


   S.torusMesh = uvMesh((u,v) => {
      let theta = 2 * Math.PI * u;
      let phi = 2 * Math.PI*v;
      let cu = Math.cos(theta);
      let su = Math.sin(theta);
      let cv = Math.cos(phi);
      let sv = Math.sin(phi);
      let r = 0.2;
      let x = cu * ( 1 + r*cv);
      let y = su * ( 1 + r*cv);
      let z = r*sv;
   return [x,y,z,x,y,z,
         u, v];
   }, 20, 10);

   S.diskMesh = uvMesh((u,v) => { //MAKES A DISK
      let theta = 2 * Math.PI * u;
      let cu = Math.cos(theta);
      let su = Math.sin(theta);
      let z = 0.;
      return [v*cu, v*su, z, v*cu, v*su, z, u, v]
   }, 20, 10);

   let transformMesh = (mesh, matrix) => {
      let result = [];
      let IMT = matrixTranspose(matrixInverse(matrix));
      for (let n = 0 ; n < mesh.length ; n += S.VERTEX_SIZE) {
         let V = mesh.slice(n, n + S.VERTEX_SIZE);
	 let P  = V.slice(0, 3);
	 let N  = V.slice(3, 6);
	 let UV = V.slice(6, 8);
	 P = matrixTransform(matrix, [P[0], P[1], P[2], 1]);
	 N = matrixTransform(IMT,    [N[0], N[1], N[2], 0]);
         result = result.concat([P[0],P[1],P[2],
	                         N[0],N[1],N[2],
				 UV[0],UV[1]]);
      }
      return result;
   }

   let face0 = transformMesh(S.squareMesh, matrixTranslate([0,0,1]));
   let face1 = transformMesh(face0,        matrixRotx( Math.PI/2));
   let face2 = transformMesh(face0,        matrixRotx( Math.PI ));
   let face3 = transformMesh(face0,        matrixRotx(-Math.PI/2));
   let face4 = transformMesh(face0,        matrixRoty(-Math.PI/2));
   let face5 = transformMesh(face0,        matrixRoty( Math.PI/2));
   S.cubeMesh = glueMeshes(face0,
                glueMeshes(face1,
                glueMeshes(face2,
                glueMeshes(face3,
                glueMeshes(face4,
		           face5)))));

   let cylTube = S.tubeMesh;
   let cylUpFace = transformMesh(S.diskMesh, matrixTranslate([0,0,1]));
   let cylDnFace = transformMesh(S.diskMesh, matrixTranslate([0,0,-1]));
   S.cylinderMesh = glueMeshes(cylUpFace,
               glueMeshes(cylTube, cylDnFace)); //SIC FACTUM CYLINDER MESH 

   S.drawMesh = (mesh, matrix) => {
      let gl = S.gl;
      S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
      S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
      S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, mesh.length / S.VERTEX_SIZE);
   }
`,
fragment: `
S.setFragmentShader(\`
   uniform vec3 uColor;
   varying vec3 vPos, vNor;
   void main() {
      float c = .2 + .8 * max(0.,dot(vNor,vec3(.57)));
      gl_FragColor = vec4(c,c,c,1.) * vec4(uColor,1.);

   }
\`);
`,
vertex: `
S.setVertexShader(\`

   attribute vec3 aPos, aNor;
   varying   vec3 vPos, vNor;
   uniform   mat4 uMatrix, uInvMatrix, uPerspective;

   void main() {
      vec4 pos = uPerspective * uMatrix * vec4(aPos, 1.);
      vec4 nor = vec4(aNor, 0.) * uInvMatrix;
      vPos = pos.xyz;
      vNor = normalize(nor.xyz);
      gl_Position = pos * vec4(1.,1.,-.01,1.);

   }

\`)
`,
/*
   ___     ___    _  _     ___     ___     ___   
  | _ \   | __|  | \| |   |   \   | __|   | _ \  
  |   /   | _|   | .` |   | |) |  | _|    |   /  
  |_|_\   |___|  |_|\_|   |___/   |___|   |_|_\  
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| 
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
*/
render: `
   S.setUniform('Matrix4fv', 'uPerspective', false,
      [1,0,0,0, 0,1,0,0, 0,0,1,-.1, 0,0,0,1]);

   let m = new Matrix();

   let draw = (mesh, color) => {
      S.setUniform('3fv', 'uColor', color);
      S.drawMesh(mesh, m.get());
   }
   
   let skelcol = [.9412,.9176,.8392];
skelcol = [.92, .82, .63]
   let swingSpeed = 2.0;
   let armSwingMag = 1.2;

   let KneeSwingSpeed = swingSpeed;
   let ThighSwingMag = 0.6;
   let KneeSwingMag = ThighSwingMag*.8;


   // ANIMATED POSITION
   m.identity();
   m.translate([0.,0.5,0.]);

//CUTE DEMO:
m.roty(time); 
m.rotx(.2);

   m.save(); //OPEN HEAD
      m.scale([.1,.1,.1]);
      draw(S.sphereMesh, skelcol);
	m.save();
		m.translate([0.,.9,0.]);
		m.save();
			m.scale([1.3,0.2,1.3]); //hat brim
			m.rotx(Math.PI/2);
			draw(S.cylinderMesh,[0.,0,0]);
		m.restore();
		m.translate([0.,.24,0.]);
		m.scale([0.7,1.5,.7]); //hat top
		m.rotx(Math.PI/2);
		draw(S.cylinderMesh,[0.,0.,0.]);
	m.restore();
      m.save(); //HEAD -> LOWER JAW
         m.translate([0,-0.8,0]);
         m.scale([.45,.6,.6]);
         m.rotx(Math.PI/2);
         draw(S.cubeMesh, skelcol);
         m.translate([0,0.1,0.5]);
         m.scale([0.5,1,0.15]);
         draw(S.cubeMesh,[0.,0.,0.]);
      m.restore();
      m.save(); //HEAD -> LEFT EYE
         m.translate([0.2,.23,0.8]);
         //m.matrixRotx(0.);
         m.scale([.25,.25,.25]);
         draw(S.sphereMesh,[0,0,0]);
      m.restore()
      m.save();//HEAD -> RIGHT EYE 
         m.translate([-0.25,.23,0.8]);
         m.scale([.25,.25,.25]);
         draw(S.sphereMesh,[0,0,0]);
      m.restore();
   m.restore();
   m.save(); //OPEN NECK
      m.translate([0,-.2,0]); // XLATE HEAD -> NECK
      //m.rotz(Math.cos(time)); // ROTATE ABOUT THE NECK
      m.save();   //FROM NECK OPEN SPINE
         m.translate([0,-0.25,0]);  // RENDER THE SPINE

         m.save(); //SPINE -> RIBCAGE
            m.rotx(Math.PI/2);
            m.scale([.1,.1,.1]); 
            m.translate([0,0,-2.5]);
            draw(S.torusMesh, skelcol);
            m.translate([0,0,.6]);
            draw(S.torusMesh, skelcol);
            m.translate([0,0,.6]);
            draw(S.torusMesh, skelcol);
            m.translate([0,0,.6]);
            draw(S.torusMesh, skelcol);
         m.restore();

         m.save(); //SPINE -> LEFT SHOULDER
            m.translate([.125,.30,0]);
            m.roty(Math.PI);
            m.rotx(armSwingMag*Math.sin(swingSpeed*time));

            m.save(); //LEFT SHOULDER -> LEFT ARM
            m.rotz(-Math.PI/4);
               m.translate([0,-0.13,0.]);

               m.save(); //upper arm to elbow
                  m.translate([0,-0.13,0.]);
                  m.rotz(Math.PI/4);
                  m.save(); //elbow to forearm
                     m.rotz(Math.PI/10);
                     m.translate([0,-0.13,0.]);
                     m.save(); //forarm to wrist
                        m.translate([0,-0.13,0.]);
                        
                        //wrist to hand?

                        m.scale([.02,.02,.02]); //wrist
                        draw(S.sphereMesh,skelcol);
                     m.restore();
                     m.scale([.01,.1,.01]);
                     m.rotx(Math.PI/2);
                     draw(S.cylinderMesh,skelcol);
                  m.restore();
                  
                  m.scale([.02,.02,.02]); //elbow
                  draw(S.sphereMesh,skelcol);
               m.restore();

               m.scale([.01,.1,.01]);
               m.rotx(Math.PI/2);
               draw(S.cylinderMesh,skelcol);
            

            m.restore();
            m.scale([.02,.02,.02]);
            draw(S.sphereMesh, skelcol);
         m.restore();
         m.save(); //SPINE -> RIGHT SHOULDER
            m.translate([-.125,.30,0]);
            m.rotx(armSwingMag*Math.sin(swingSpeed*time));
            m.save(); //RIGHT SHOULDER -> RIGHT ARM
               m.rotz(-Math.PI/4);
               m.translate([0,-0.13,0.]);

               m.save(); //upper arm to elbow
                  m.translate([0,-0.13,0.]);
                  m.rotz(Math.PI/4);
                  m.save(); //elbow to forearm
                     m.rotz(Math.PI/10);
                     m.translate([0,-0.13,0.]);
                     m.save(); //forarm to wrist
                        m.translate([0,-0.13,0.]);
                        
                        //wrist to hand?

                        m.scale([.02,.02,.02]); //wrist
                        draw(S.sphereMesh,skelcol);
                     m.restore();
                     m.scale([.01,.1,.01]);
                     m.rotx(Math.PI/2);
                     draw(S.cylinderMesh,skelcol);
                  m.restore();
                  
                  m.scale([.02,.02,.02]); //elbow
                  draw(S.sphereMesh,skelcol);
               m.restore();

               m.scale([.01,.1,.01]);
               m.rotx(Math.PI/2);
               draw(S.cylinderMesh,skelcol);
            m.restore();
            m.scale([.02,.02,.02]);
            draw(S.sphereMesh, skelcol);
         m.restore();

// LOWER BODY

//TODO: PELVIS
         m.save();
            m.translate([0,-.18,0]);
            m.scale([.1,.1,0.1]);
            m.rotx(Math.PI/2);
            draw(S.torusMesh,skelcol);
         m.restore();
         m.save();
            m.translate([0,-.25,0]);
            m.scale([.06,0.1,.07]);
            m.rotx(Math.PI/2);
            draw(S.torusMesh,skelcol);
         m.restore();
`

/*
   _       ___  __      __ ___     ___              ___     ___     ___   __   __ 
  | |     / _ \ \ \    / /| __|   | _ \     o O O  | _ )   / _ \   |   \  \ \ / / 
  | |__  | (_) | \ \/\/ / | _|    |   /    o       | _ \  | (_) |  | |) |  \ V /  
  |____|  \___/   \_/\_/  |___|   |_|_\   TS__[O]  |___/   \___/   |___/   _|_|_  
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| {======|_|"""""|_|"""""|_|"""""|_| """ | 
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
*/

+
`
let hipPosition = -0.25;

         m.save(); //nav to LEFT side hip 
            m.translate([.1,hipPosition,0]);
            m.roty(Math.PI/2);
            m.rotz(Math.PI/4);
            //how much is the thigh rotated?
            let thighAngle = ThighSwingMag*Math.sin(swingSpeed*time);
            m.rotz(thighAngle);

            m.save(); //LEFT HIP -> LEFT FEMUR
               m.rotz(-Math.PI/4);
               m.translate([0,-0.13,0.]);
               m.save(); //FEMUR TO KNEE
                  m.translate([0,-0.13,0.]);
                  //m.rotz(Math.PI/4);
                  m.save(); //KNEE TO TIBIA
                       if(thighAngle < 0) {
                        m.rotz(-KneeSwingMag*Math.sin(KneeSwingSpeed*time));
};
                     m.translate([0,-0.13,0.]);
                     m.save(); //TIBIA TO HEEL
                        m.translate([0,-0.13,0.]);
                        
                        //HEEL TO FOOT?

                        m.scale([.02,.02,.02]); //HEEL
                        draw(S.sphereMesh,skelcol);
                     m.restore();
                     m.scale([.02,.1,.02]);
                     m.rotx(Math.PI/2);
                     draw(S.cylinderMesh,skelcol); //TIBIA
                  m.restore();
                  
                  m.scale([.02,.02,.02]); //KNEE
                  draw(S.sphereMesh,skelcol);
               m.restore();
               m.scale([.03,.1,.03]);
               m.rotx(Math.PI/2);
               draw(S.cylinderMesh,skelcol); //FEMUR
            m.restore();
            m.scale([.02,.02,.02]);
            draw(S.sphereMesh, skelcol); //HIP
         m.restore();

m.save(); //nav to RIGHT side hip 
            m.translate([-.1,hipPosition,0]);
            m.roty(Math.PI/2);
            m.rotz(Math.PI/4);
            //how much is the thigh rotated?
            let thighAngle2 = ThighSwingMag*Math.sin(swingSpeed*time+Math.PI);
            m.rotz(thighAngle2);

            m.save(); //RIGHT HIP -> RIGHT FEMUR
               m.rotz(-Math.PI/4);
               m.translate([0,-0.13,0.]);
               m.save(); //FEMUR TO KNEE
                  m.translate([0,-0.13,0.]);
                  //m.rotz(Math.PI/4);
                  m.save(); //KNEE TO TIBIA
                       if(thighAngle2 < 0) {
                        m.rotz(-KneeSwingMag*Math.sin(KneeSwingSpeed*time+Math.PI));
};
                     m.translate([0,-0.13,0.]);
                     m.save(); //TIBIA TO HEEL
                        m.translate([0,-0.13,0.]);
                        
                        //HEEL TO FOOT?

                        m.scale([.02,.02,.02]); //HEEL
                        draw(S.sphereMesh,skelcol);
                     m.restore();
                     m.scale([.02,.1,.02]);
                     m.rotx(Math.PI/2);
                     draw(S.cylinderMesh,skelcol); //TIBIA
                  m.restore();
                  
                  m.scale([.02,.02,.02]); //KNEE
                  draw(S.sphereMesh,skelcol);
               m.restore();
               m.scale([.03,.1,.03]);
               m.rotx(Math.PI/2);
               draw(S.cylinderMesh,skelcol); //FEMUR
            m.restore();
            m.scale([.02,.02,.02]);
            draw(S.sphereMesh, skelcol); //HIP
         m.restore();
         


         m.rotx(Math.PI/2);
         m.scale([.01,.01,.29]);
         draw(S.cylinderMesh, skelcol); //render spine
         

      m.restore();
   m.restore();


//INDEPENDENT: THE GROUND
   let drawWithMatGiven = (mesh, color,matr) => {
      S.setUniform('3fv', 'uColor', color);
      S.drawMesh(mesh, matr.get());
   }


let gnd = new Matrix();
gnd.save();
   gnd.translate([0.,-1,0.]);
   gnd.scale([10,0.1,10]);
   //drawWithMatGiven(S.cubeMesh,[1,0,0],gnd);
gnd.restore();
   gnd.translate([0.,0.,-100.]);
   gnd.scale([100,100,0.1]);
   drawWithMatGiven(S.cubeMesh,[1.0,.5,.0],gnd);

`,
events: `
;
`
};

}

