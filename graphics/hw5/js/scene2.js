
window.splineDiagram = () => {


   S.CatromM = [ -1/2,  1 ,-1/2, 0,
                  3/2,-5/2,  0 , 1,
            -3/2,  2 , 1/2, 0,
             1/2,-1/2,  0 , 0 ];

   // DEFINE USEFUL FUNCTIONS

   let mix = (a,b,t) => [ a[0] * (1-t) + b[0] * t,
                          a[1] * (1-t) + b[1] * t ];

   let spline = (K,t) => {
      let p = [];
      let A = K[0], B = K[1], C = K[2], D = K[3];
      let M = S.CatromM ;
      for (let i = 0 ; i < A.length ; i++) {
         let F = matrixMultiply(M, [ A[i],B[i],C[i],D[i] ]);
         p.push(t*t*t*F[0] + t*t*F[1] + t*F[2] + F[3]);
      }
      return p;
   }

   let isNear = p => diagram.distance(p,[x,y]) < 20;

   // INITIALIZE

   if (!S.K_3d) {
      S.K_3d = [[200,100],[150,200],[300,300],[220,450]]; //initialize points! y(2nd) values should monoton. increase!

      S.t = .5;
   }

   // SET USEFUL LOCAL VARIABLES

   let xyz=diagram.getCursor(),x=xyz[0],y=xyz[1],z=xyz[2];
   let K=S.K_3d,A=K[0],B=K[1],C=K[2],D=K[3],t=S.t;

   // INTERACT WITH SPLINE KEY POINTS

   if (! z)
      S.k = -1;
   if (diagram.isPress())
      for (let k = 0 ; k < K.length ; k++)
         if (isNear(K[k]))
            S.k = k;
   if (S.k >= 0)
      K[S.k] = [x,y];


   // DRAW THE DIAGRAM TITLE

   diagram.setTextHeight(25);
   diagram.drawText('Design your pot here:', [20,20],'black','left');
   diagram.drawText('Rotation Axis',[30,520]);

   // DRAW THE SPLINE

   let J =  //since we are doing only catmull-rom!
   [
        [A, A, B, C],
        [A, B, C, D],
        [B, C, D, D],
   ];
let AXISXVAL = 100;
let COLLECTFREQUENCY = 10; //100 divided by number of desired outcomes
   diagram.drawLine([AXISXVAL,100],[AXISXVAL,500],'blue');
   let RetVals = [];
   diagram.setLineWidth(5);
   for (let j = 0 ; j < J.length ; j++){
      let counter = 0;
      for (let t = 0 ; t < 1 ; t += 1/100){
         diagram.drawLine(spline(J[j],t),
                          spline(J[j],t+1/100),'black');
         counter++;
         if (counter%COLLECTFREQUENCY == 0){
            let ptVals = spline(J[j],t);
            ptVals = [ptVals[0]-AXISXVAL, ptVals[1]]
            RetVals.push(ptVals[0]); //push radial value of each stop!
         }
      }
   }
   for (let k = 0 ; k < K.length ; k++)
      diagram.fillCircle(K[k],10, 'red');
//   console.log(RetVals);
   return(RetVals); //HAS (100/COLLECTFREQUENCY)* 3  pairs (ie that*2 vals)
}

rooms.scene2 = function() {

lib3D2();

description = `<b><i>HW5 Part 2: An Interactive Potter's Wheel</i></b>
               <p>
               Use the Interactive diagram below to change the shape of your pot, 
               and watch as the shape on the wheel changes as well! Catmull-Rom Splines are used. 
               <br>`
               + addDiagram(500,600)
               + `
<p>
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

   let uvMesh_customParam = (param,f,nu,nv) => {
      let mesh = [];
      for (let iv = 0 ; iv < nv ; iv++) {
         let v = iv / nv;
    let strip = [];
         for (let iu = 0 ; iu <= nu ; iu++) {
       let u = iu / nu;
       strip = strip.concat(f(param,u,v));
       strip = strip.concat(f(param,u,v+1/nv));
    }
    mesh = glueMeshes(mesh, strip);
      }
      return mesh;
   }

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

   S.volMesh = (recParam) => {return(uvMesh_customParam(recParam,
   (param,u,v) => { //MAKES A FRUSTUM
      let theta = 2 * Math.PI * u;
      let r0 = param[0];
      let r1 = param[1];
      let cu = Math.cos(theta)*(r0 + v*(r1-r0));
      let su = Math.sin(theta)*(r0 + v*(r1-r0));
      let z = v;
      return [cu, su, z, cu, su, z, u, v];
      }, 
   20, 10
   ))};


   S.torusMesh = (recParam) => {return(uvMesh_customParam(recParam,
   (param,u,v) => {
      let theta = 2 * Math.PI * u;
      let phi = 2 * Math.PI*v;
      let cu = Math.cos(theta);
      let su = Math.sin(theta);
      let cv = Math.cos(phi);
      let sv = Math.sin(phi);
      let r = param;
      let x = cu * ( 1 + r*cv);
      let y = su * ( 1 + r*cv);
      let z = r*sv;
   return [x,y,z,x,y,z,
         u, v];
   }, 
   20, 10))}; //wow it worked!!!





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
let viewAngle = 0.4;
let cc = Math.cos(viewAngle);
let ss = Math.sin(viewAngle);

   S.setUniform('Matrix4fv', 'uPerspective', false,
      [1,0,0,0,
       0,cc,ss,0, 
       0,-ss,cc,-.1, 
       0,0,0,1]
   );


   data = splineDiagram();
let NumRings = 30;

   let m = new Matrix();

   let draw = (mesh, color) => {
      S.setUniform('3fv', 'uColor', color);
      S.drawMesh(mesh, m.get());
   }

   // ANIMATED POSITION
let potteryColor = [216/256,175/256,160/256];

   m.identity();
   m.translate([0,0.25,0]);
   m.rotx(Math.PI/2);
   m.rotz(5*time);
   m.save();
      m.scale([0.001,0.001,0.03]);
      let r0 = Math.abs(data[0]);
      let r1 = Math.abs(data[1]);
      draw(S.volMesh([r0,r1]), potteryColor);
   for (let ring = 1; ring < NumRings; ring++){
      r0 = Math.abs(data[ring]);
      r1 = Math.abs(data[ring+1]);
      m.translate([0,0,1]); //just one down is perfect!
      draw(S.volMesh([r0,r1]), potteryColor);
   }
   m.translate([0,0,1]); //just one down is perfect!
m.scale([700,700,1]);
draw(S.cylinderMesh,[100/256,120/256,120/256]);
   m.restore();

   // TORSO

`,
events: `
   ;
`
};

}

