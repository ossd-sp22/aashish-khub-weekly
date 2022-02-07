
rooms.scene3 = function() {

lib3D2();

description = `<b>Scene 3</b>
               <p>
               Human figure created
               <br>
               with triangle meshes.`
   + `
      <p>
          <input type=range id=body_length> body length
	  <br>
          <input type=range id=arm_length> arm length
	  <br>
          <input type=range id=leg_length> leg length
	  <br>
          <input type=range id=limb_swing> limb swing
	  <br>
          <input type=range id=thrust_body> thrust body
	  <br>
          <input type=range id=sway_body> sway body
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
   let face2 = transformMesh(face0,        matrixRotx( Math.PI  ));
   let face3 = transformMesh(face0,        matrixRotx(-Math.PI/2));
   let face4 = transformMesh(face0,        matrixRoty(-Math.PI/2));
   let face5 = transformMesh(face0,        matrixRoty( Math.PI/2));
   S.cubeMesh = glueMeshes(face0,
                glueMeshes(face1,
                glueMeshes(face2,
                glueMeshes(face3,
                glueMeshes(face4,
		           face5)))));

   S.drawMesh = (mesh, matrix) => {
      let gl = S.gl;
      S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
      S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
      S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, mesh.length / S.VERTEX_SIZE);
   }

   S.turn = 0;
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
render: `
   S.setUniform('Matrix4fv', 'uPerspective', false,
      [1,0,0,0, 0,1,0,0, 0,0,1,-.1, 0,0,0,1]);

   let m = new Matrix();

   let draw = (mesh, color) => {
      S.setUniform('3fv', 'uColor', color);
      S.drawMesh(mesh, m.get());
   }

   let skinColor = [1,.7,.6];
   let eyeColor = [0,0,0];
   let noseColor = [1,.2,.2];
   let shirtColor = [.5,.8,1];
   let pantsColor = [.6,.2,.1];
   let shoeColor = [0,0,0];

   let bodyLength = mix(.4, .6, body_length.value / 100);
   let armLength = mix(.2, .8, arm_length.value / 100);
   let legLength = mix(.3, 1, leg_length.value / 100);
   let limbSwing = mix(0, 1.3, limb_swing.value / 100);
   let thrustBody = mix(0, .15, thrust_body.value / 100);
   let swayBody = mix(0, .15, sway_body.value / 100);

   let cos = Math.cos(3*time);
   let sin = Math.sin(3*time);
   let cos2 = Math.cos(6*time);
   let sin2 = Math.sin(6*time);


   // ANIMATED POSITION

   m.identity();
   m.roty(2 * S.turn);

   m.translate([-1.1*swayBody*cos*bodyLength,
                  .6,
	        -1.2*thrustBody*cos2*bodyLength]);

   // HEAD

   m.save();
      m.rotx(thrustBody*cos2);
      m.rotz(-swayBody/2*cos);
      m.translate([0,.2,0]);   // NECK

      m.scale([.2,.2,.2]);
      draw(S.sphereMesh, skinColor);

      // CREATE EYES

      if (! S.blinkTime || S.blinkTime < time)
         S.blinkTime = time + 3 * Math.random();

      if (time < S.blinkTime - .1)
         for (let i = 0 ; i < 2 ; i++) {
            let s = 2 * i - 1;
            m.save();
               m.translate([s*.5,.5,.5]);
               m.scale([.25,.25,.25]);
               draw(S.sphereMesh, eyeColor);
            m.restore();
         }

      // CREATE NOSE

      m.save();
         m.translate([0,0,1]);
         m.scale([.4,.4,.4]);
         draw(S.sphereMesh, noseColor);
      m.restore();

   m.restore();

   // TORSO

   m.save();

      m.rotx(-thrustBody*cos2);
      m.rotz(swayBody*cos);

      m.save();
         m.translate([0,-bodyLength*.35,0]);  // UPPER TRUNK
         m.scale([.12,bodyLength*.35,.1]);
         draw(S.sphereMesh, shirtColor);
      m.restore();

      // ARMS

      for (let i = 0 ; i < 2 ; i++) {
	 m.save();
            let s = 2 * i - 1;

            m.translate([s*.15,-.05,0]); // SHOULDER
	    m.rotz(.3*s);
	    m.rotx(s*cos*limbSwing);

	    m.save();
	       m.translate([0,-armLength/4,0]);
	       m.scale([.04,armLength/4,.04]);
               draw(S.sphereMesh, shirtColor);
	    m.restore();

            m.translate([0,-armLength/2,0]); // ELBOW
	    m.rotx((-.5 + .5 * s*sin)*limbSwing);

	    m.save();
	       m.translate([0,-armLength/4,0]);
	       m.scale([.035,armLength/4,.035]);
               draw(S.sphereMesh, shirtColor);
	    m.restore();

            m.translate([0,-armLength/2,0]); // WRIST

	    m.save();
	       m.translate([0,-.1,0]);
	       m.scale([.03,.1,.05]);
               draw(S.sphereMesh, skinColor);
	    m.restore();

	 m.restore();
      }

      m.translate([0,-bodyLength*.6,0]);  // WAIST
      m.rotx(-2*thrustBody*cos2);
      m.rotz(swayBody*cos);

      m.save();
         m.translate([0,-bodyLength*.1,0]);  // LOWER TRUNK
         m.scale([.1,bodyLength*.25,.09]);
         draw(S.sphereMesh, pantsColor);
      m.restore();

      m.translate([0,-bodyLength*.2,0]); // PELVIS
      m.rotx(3*thrustBody*cos2);
      m.rotz(-2*swayBody*cos);

      // LEGS

      for (let i = 0 ; i < 2 ; i++) {
	 m.save();
            let s = 2 * i - 1;

            m.translate([s*.08,0,0]); // HIP
	    m.rotx(-s*cos*limbSwing);

	    m.save();
	       m.translate([0,-legLength/4,0]);
	       m.scale([.05,legLength/4,.05]);
               draw(S.sphereMesh, pantsColor);
	    m.restore();

            m.translate([0,-legLength/2,0]); // KNEE
	    m.rotx((1 - s*sin)*limbSwing);

	    m.save();
	       m.translate([0,-legLength/4,0]);
	       m.scale([.04,legLength/4,.04]);
               draw(S.sphereMesh, pantsColor);
	    m.restore();

            m.translate([0,-legLength/2,0]); // ANKLE
	    m.rotx(-.5*s*cos*limbSwing);

	    m.save();
	       m.translate([0,-.02,.12]);
	       m.scale([.05,.03,.12]);
               draw(S.sphereMesh, shoeColor);
	    m.restore();
	 m.restore();
      }

   m.restore();
`,
events: `
   onPress = (x,y) => S.x = x;
   onDrag = (x,y) => { S.turn += x - S.x; S.x = x; }
`
};

}

