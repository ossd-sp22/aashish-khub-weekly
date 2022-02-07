
rooms.spline1 = function() {

lib2D();

description = `
<b>Simple interactive B&eacute;zier spline</b>
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
</ol>
`
code = {

init: `
  let n = 3; // GENERATE INITIAL KEY POINTS
  S.K = [];
  for (let k = 0 ; k <= 3*n ; k++)
     S.K.push([100 + 200 * k/n, 400, 0]);
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

  let mix = (a,b,t) => {
     let c = [];
     for (let i = 0 ; i < a.length ; i++)
        c.push(a[i] * (1-t) + b[i] * t);
     return c;
  }

  let bezierPoint = (a,b,c,d, t) =>
     mix( mix( mix(a,b,t),
               mix(b,c,t), t),
          mix( mix(b,c,t),
	       mix(c,d,t), t), t);

  S.bezier = (a,b,c,d, n) => {
     S.beginPath();
     S.moveTo(a);
     for (let i = 1 ; i <= n ; i++)
        S.lineTo(bezierPoint(a,b,c,d, i/n));
     S.stroke();
  }

  S.circle = (C,r) => {
     let P = theta => [
        C[0] + r * Math.cos(theta),
        C[1] + r * Math.sin(theta)
     ];
     S.beginPath();
     S.moveTo(P(0));
     let n = 20;
     for (let i = 1 ; i <= n ; i++)
        S.lineTo(P(2 * Math.PI * i/n));
     S.stroke();
  }

  // VECTOR MATH FUNCTIONS.

  S.distance = (a,b) => {
     let dd = 0;
     for (let i = 0 ; i < a.length ; i++)
        dd += (a[i] - b[i]) * (a[i] - b[i]);
     return Math.sqrt(dd);
  }
  S.add = (a,b) => {
     let c = [];
     for (let i = 0 ; i < a.length ; i++)
        c.push(a[i] + b[i]);
     return c;
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
  let K = S.K;

  S.context.strokeStyle = S.isLoop ? 'pink' : 'white';

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
  for (let k = 0 ; k < K.length - 3 ; k += 3)
     S.bezier(K[k],K[k+1],K[k+2],K[k+3], 100);
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
     console.log(key);
     switch (key) {
     case 32:                        // SPACE:
        S.hideGuide = ! S.hideGuide; // TOGGLE GUIDE
	break;
     case 76:                        // LOWER CASE L:
        S.isLoop = ! S.isLoop;       // TOGGLE LOOPING
	if (S.isLoop)
	   makeLoop(-2,-1,0,1);
	break;
     }
  }
`
};

}

