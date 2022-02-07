
rooms.walking2D = function() {

lib2D();

description = `
<b>Walking along a spline</b>
<p>
<b><i>Instructions:</i></b>
<ol>
<li>Click <small>INTERACT</small>.
<p>
<li>
&bull; Drag key points to modify spline.
<br>
&bull; Type ' &nbsp;' to toggle visible guides.
<br>
&bull; Type lowercase L to toggle looping.
<br>
&bull; Type lowercase A to start walking.
</ol>
      <p>
          <input type=range id=walk_speed> walk speed
          <br>
          <input type=range id=feet_apart> feet apart
          <br>
          <input type=range id=step_length> step length
          <br>
          <input type=range id=step_weight> step weight
          <br>
`
code = {

init: `
  S.saveWalking2DParams = S.walkSpeedValue;
  S.n = 3;
`,
assets: `
  // TAKE POINTS AS ARGUMENTS FOR DRAWING.

  S.beginPath = () => S.context.beginPath();
  S.moveTo    = p  => S.context.moveTo(p[0],p[1]);
  S.lineTo    = p  => S.context.lineTo(p[0],p[1]);
  S.stroke    = () => S.context.stroke();

  // SHAPE DRAWING FUNCTIONS.

  S.line = (a,b) => {
     S.beginPath();
     S.moveTo(a);
     S.lineTo(b);
     S.stroke();
  }

  S.bezierPoint = (a,b,c,d, t) =>
     mix( mix( mix(a,b,t),
               mix(b,c,t), t),
          mix( mix(b,c,t),
               mix(c,d,t), t), t);

  S.circle = (C,r,color) => {
     let P = theta => [
        C[0] + r * Math.cos(theta),
        C[1] + r * Math.sin(theta)
     ];
     if (color)
        S.context.strokeStyle = color;
     S.beginPath();
     S.moveTo(P(0));
     let n = 20;
     for (let i = 1 ; i <= n ; i++)
        S.lineTo(P(2 * Math.PI * i/n));
     S.stroke();
  }

  // VECTOR MATH FUNCTIONS.

  S.add = (a,b) => {
     let c = [];
     for (let i = 0 ; i < a.length ; i++)
        c.push(a[i] + b[i]);
     return c;
  }
  S.cross = (a,b) => {
     return [a[1]*b[2] - a[2]*b[1],
             a[2]*b[0] - a[0]*b[2],
             a[0]*b[1] - a[1]*b[0]];
  }
  S.distance = (a,b) => {
     let dd = 0;
     for (let i = 0 ; i < a.length ; i++)
        dd += (a[i] - b[i]) * (a[i] - b[i]);
     return Math.sqrt(dd);
  }
  S.norm = a => {
     let s = 0;
     for (let i = 0 ; i < a.length ; i++)
        s += a[i] * a[i];
     return Math.sqrt(s);
  }
  S.normalize = a => {
     return S.scale(a, 1 / S.norm(a));
  }
  S.scale = (a,s) => {
     let c = [];
     for (let i = 0 ; i < a.length ; i++)
        c.push(a[i] * s);
     return c;
  }
  S.subtract = (a,b) => {
     let c = [];
     for (let i = 0 ; i < a.length ; i++)
        c.push(a[i] - b[i]);
     return c;
  }
  S.copy = a => a.slice();

`,
render: `
  if (S.n != S.nPrev)
     delete S.K;

  if (S.K === undefined) {

     // GENERATE INITIAL KEY POINTS

     let n = S.n;
     S.nPrev = S.n;
     S.K = [];
     for (let k = 0 ; k <= 3*n ; k++)
        S.K.push([100 + 200 * k/n,
	          300 + 200 * Math.floor((k+1)/3 % 2), 0]);

     // INITIALIZE OTHER VARIABLES

     S.bodyLift = 0;
  }

  let K = S.K;

  S.context.strokeStyle = S.isLoop ? 'pink' : 'white';

  if (S.saveWalking2DParams) {
     walk_speed.value  = S.walkSpeedValue;
     step_length.value = S.stepLengthValue;
     feet_apart.value  = S.feetApartValue;
     step_weight.value = S.stepWeightValue;
     delete S.saveWalking2DParams;
  }

  // OPTIONALLY SHOW BEZIER GUIDE DATA.

  if (! S.hideGuide) {
     for (let k = 0 ; k < K.length ; k++) {
        S.context.lineWidth = k % 3 == 0 ? 3 : 1;
        S.circle(K[k], 20);
     }

     S.context.lineWidth = 1;
     for (let k = 0 ; k < K.length-1 ; k++)
        S.line(K[k], K[k+1]);
  }

  // DRAW THE SPLINE.

  S.context.lineWidth = 10;
  S.tWalk = 0;
  S.totalLength = 0;

  let sum = 0, C = [];
  C.push({t:0, p:K[0]});
  for (let k = 0 ; k < K.length - 3 ; k += 3) {
     let a=K[k],b=K[k+1],c=K[k+2],d=K[k+3],A=a.slice();
     for (let i = 1 ; i <= 100 ; i++) {
        let B = S.bezierPoint(a,b,c,d,i/100);
        sum += S.distance(A, B);
        C.push({t:sum, p: A = B});
     }
  }

  // FUNCTION TO SAMPLE A POINT ON A PARAMETRIC CURVE

  let sample = (C,t) => {
     for (let i = 0 ; i < C.length-1 ; i++)
        if (C[i].t <= t && C[i+1].t > t) {
	   let f = (t - C[i].t) / (C[i+1].t - C[i].t);
	   let a = C[i].p, b = C[i+1].p;
	   return mix(a, b, f);
       }
  }

  S.walkSpeedValue  = walk_speed.value;
  S.stepLengthValue = step_length.value;
  S.feetApartValue  = feet_apart.value;
  S.stepWeightValue = step_weight.value;

  S.walkSpeed  = S.walkSpeedValue / 100;
  S.stepLength = S.stepLengthValue / 100;
  S.feetApart  = S.feetApartValue / 100;
  S.stepWeight = S.stepWeightValue / 100;

  S.walkSpeed = mix(.5, 1.5, S.walkSpeed);
  S.stepLength = (.5 + S.stepLength) / S.walkSpeed;
  S.feetApart = .3 + .3 * S.feetApart;
  S.stepWeight = mix(.1, 1, S.stepWeight);

  let resample = C => {
     let R = [];
     let N = C.length;
     let T = C[N-1].t;
     for (let t = 0 ; t < T ; t += T/N)
        R.push({t: t/S.walkSpeed, p: sample(C, t)});
     return R;
  }

  C = resample(C);

  S.C = C;

  S.beginPath();
  S.moveTo(C[0].p);
  for (let i = 1 ; i < C.length ; i++)
     S.lineTo(C[i].p);
  S.stroke();

  if (S.isWalk) {
     let t = 100 * (time - S.startTime);
     let N = Math.floor(100 * S.stepLength);
     t = Math.min(t, C[C.length-1].t);

     let iBody = 0;
     for (let i = 1 ; i < C.length ; i++) {
        if (C[i-1].t < t && C[i].t >= t) {
           S.circle(C[i].p, 10, 'red');
	   iBody = i;
	}
     }

     S.feet3D.push([]);

     let iFootStep = [0,0];

     for (let i = 1 ; i < C.length ; i++) {

	let foot = (f,color) => {
	   let s = 2 * f - 1, D;

	   let footPosition = i => {
              D = S.scale(S.normalize(S.subtract(C[i].p, C[i-1].p)),
	                  20*S.stepLength*S.walkSpeed);
              let p = S.normalize(S.cross(D, [0,0,1]));
              return S.add(C[i].p, S.scale(p, s * S.feetApart * 100));
	   }

           let p = footPosition(i);
           S.context.strokeStyle = color;
           S.context.lineWidth = 20 * S.stepWeight;
           S.line(S.subtract(p,D), S.add(p,D));
           S.context.lineWidth = 10;

           if (S.isFeet) {
	      let i = S.iFoot[f];
	      let t = C[i].t / N + f/2;
	      let z = Math.abs(Math.sin(Math.PI * t));
	      if (i > C.length - 4)
	         z = 0;
	      let fp = footPosition(i);
	      S.circle(fp, 5 + 20 * z, 'white');
	      S.feet3D[S.feet3D.length-1].push([fp[0], fp[1], z]);
	   }
	}
	for (let f = 0 ; f < 2 ; f++) {
	   let s0 = Math.floor(C[i-1].t / N + f/2);
	   let s1 = Math.floor(C[i  ].t / N + f/2);
	   if (s0 < s1 || i == C.length-1) {
	      let color = f == 0 ? 'blue' : 'green';
	      if (i > iBody && iFootStep[f] < iBody) {
	         iFootStep[f] = i;
		 color = 'red';
              }
	      if (S.isSteps)
	         foot(f, color);
           }
        }
     }

     let iFeet = S.iFoot[0] + S.iFoot[1] >> 1;
     S.body = mix(S.body, C[iFeet].p, .125 / S.stepLength);
     S.circle(S.body, 50, 'white');

     S.taperTime = 400 * 0.5;
     S.nearEnd = t => Math.max(0, Math.min(1, ((t - (S.C[S.C.length-1].t-S.taperTime)) / S.taperTime)))
                    + Math.max(0, Math.min(1, ((S.taperTime - t) / S.taperTime)));

     if (S.isFeet) {
        let n = S.feet3D.length-1;
        let z0 = S.feet3D[n][0][2];
        let z1 = S.feet3D[n][1][2];
        S.bodyLift = mix(S.bodyLift, (z0 + z1) / 3 + .2 * S.nearEnd(t), .5);
        S.body3D.push([S.body[0], S.body[1], S.bodyLift]);
     }

     let ds = (2 + S.stepWeight) * S.walkSpeed;
     let dsi = Math.floor(ds), dsf = ds - dsi;
     for (let f = 0 ; f < 2 ; f++)
        if (S.iFoot[f] < iFootStep[f] - ds)
	   S.iFoot[f] += Math.floor(dsi + 2 * Math.random() * dsf);
  }

`,
events: `
  let K = S.K;

  // ON PRESS, FIND WHAT KEY POINT IS AT MOUSE, IF ANY.

  onPress = (x,y,z) => {
     let p = [x,y,z === undefined ? 0 : z];
     S.k = -1;
     for (let k = 0 ; k < K.length ; k++)
        if (S.distance(K[k], p) < 20) {
           S.k = k;
           return;
        }
  }

  // PLACE K[i] ALONG THE LINE FROM K[k] TO K[j].

  let align = (i,j,k) => {
     let a = K[i], b = K[j], c = K[k];
     let ab = S.distance(a, b);
     let bc = S.distance(b, c);
     K[i] = S.add(b, S.scale(S.subtract(b,c), ab/bc));
  }

  // ADJUST SPLINE TO FORM A CONTINUOUS LOOP.

  let makeLoop = (a,b,c,d) => {
     if (a < 0) a += K.length;
     if (b < 0) b += K.length;
     if (c < 0) c += K.length;
     if (d < 0) d += K.length;
     K[a] = S.add(K[a],S.subtract(K[c],K[b]));
     K[b] = S.copy(K[c]);
     align(a,c,d);
  }
  onDrag = (x,y,z) => {
     let p = [x,y,z === undefined ? 0 : z];
     let k = S.k;
     if (k >= 0) {
        let d = S.subtract(p, K[k]);
        K[k] = S.copy(p);

        // WHAT KIND OF KEYPOINT IS THIS?

        switch (k % 3) {
        case 0:             // A MAJOR KEY POINT
           if (k >= 1)
              K[k-1] = S.add(K[k-1], d);
           if (k < K.length - 1)
              K[k+1] = S.add(K[k+1], d);
           break;
        case 1:             // AFTER A MAJOR KEY POINT
           if (k >= 2)
              align(k-2, k-1, k);
           break;
        case 2:             // BEFORE A MAJOR KEY POINT
           if (k < K.length - 2)
              align(k+2, k+1, k);
           break;
        }
        if (S.isLoop) // IF LOOPING, ADJUST END POINTS.
           if (k <= 1)
              makeLoop(-2,-1,0,1);
           else
              makeLoop(1,0,-1,-2);
     }
  }
  onKeyRelease = key => {
     switch (key) {

     case 32:                       // SPACE:
        S.hideGuide = ! S.hideGuide;// TOGGLE GUIDE
        break;

     case 65:                       // LOWER CASE A:
        if (! S.isWalk)
           S.startTime = time;
        S.isWalk = ! S.isWalk;      // TOGGLE WALK MODE
	S.body = K[0].slice();
        S.iFoot = [1,1];
        S.isSteps = ! S.isSteps;
        S.isFeet = ! S.isFeet;
        S.isLift = ! S.isLift;
	S.feet3D = [];
	S.body3D = [];
        break;

     case 76:                       // LOWER CASE L:
        S.isLoop = ! S.isLoop;      // TOGGLE LOOPING
        if (S.isLoop)
           makeLoop(-2,-1,0,1);
        break;
     }
  }
`
};

}

