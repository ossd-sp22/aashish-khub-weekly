
rooms.spline1 = function() {

lib2D();

description = `
<b><i>HW5 Part 1: The B&eacute;zier Flower</i></b>
<p>
In this section I revisit my Homework 1 Submission 
by making the same swirling moveable flower, but
this time using B&eacute;zier curves! 
<br><br>
Even the color scheme (and the way it changes with time)
is identical to what was used in HW1. 
<br> <br>
You can drag it around, hold 'p' to increase the number of
petals, or hit ' &nbsp;' to toggle visible guides.
`
code = {

init: `
    S.K = [];
    S.flowerCenter = [400,400,0];
    S.hideGuide = 1;
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

  S.grad = S.context.createRadialGradient(S.flowerCenter[0],S.flowerCenter[1],10,
  S.flowerCenter[0],S.flowerCenter[1],200);
  S.grad.addColorStop(0.5*Math.sin(time)+.5,"yellow");
  S.grad.addColorStop(0.5,"turquoise");
  S.grad.addColorStop(0.5*Math.cos(time)+.5,"blue");

`,
render: `
  let K = S.K;

  getXY = (r, theta) => {
        return([r*Math.cos(theta),r*Math.sin(theta)])
    }

  S.NewPositions = [];

  let numPts = S.MoarPetals ? 29.0 : 9.0;
let phaseshift = Math.cos(time + Math.PI/numPts);
  numPts = numPts + 1/3;
    for (let kk = 0 ; kk < 3*(numPts) ; kk++){
      let type = kk%3;
      let rad = [200, 400*Math.cos(2*time), 200+Math.sin(time/3)][type];
let posnum = kk;
if (kk == numPts*3 - 1 ) { posnum = 0 }
        pos = getXY(rad,2*Math.PI*posnum/(3*(numPts))+phaseshift);

        S.NewPositions.push([S.flowerCenter[0]+pos[0],
                             S.flowerCenter[1]+pos[1], 
                             0]);
    }
  S.K = S.NewPositions;

  S.context.strokeStyle = S.grad;

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

  S.context.lineWidth = 6;
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
     S.flowerCenter = p;
  }
  onKeyPress   = key => S.MoarPetals = key == 80;

  onKeyRelease = key => {
    console.log(key);
    switch (key) {
    case 32:                        // SPACE:
        S.hideGuide = ! S.hideGuide; // TOGGLE GUIDE
        break;
    case 80:
      S.MoarPetals = ! S.MoarPetals;
      break;
     }
  }
`
};

}

