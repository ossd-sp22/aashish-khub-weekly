
S.Mtype = 0;

window.splineDiagram = () => {

   S.BezierM = [-1, 3,-3, 1,
                 3,-6, 3, 0,
                -3, 3, 0, 0,
                 1, 0, 0, 0 ];

   S.CatromM = [ -1/2,  1 ,-1/2, 0,
                  3/2,-5/2,  0 , 1,
	         -3/2,  2 , 1/2, 0,
	          1/2,-1/2,  0 , 0 ];

   S.BsplinM = [ -1/6,  3/6, -3/6,  1/6,
                  3/6, -6/6,  0/6,  4/6,
	         -3/6,  3/6 , 3/6,  1/6,
	          1/6,  0/6,  0/6,  0/6 ];

   // DEFINE USEFUL FUNCTIONS

   let mix = (a,b,t) => [ a[0] * (1-t) + b[0] * t,
                          a[1] * (1-t) + b[1] * t ];

   let spline = (K,t) => {
      let p = [];
      let A = K[0], B = K[1], C = K[2], D = K[3];
      let M = S.Mtype==2 ? S.BsplinM :
              S.Mtype==1 ? S.CatromM :
	                   S.BezierM ;
      for (let i = 0 ; i < A.length ; i++) {
         let F = matrixMultiply(M, [ A[i],B[i],C[i],D[i] ]);
         p.push(t*t*t*F[0] + t*t*F[1] + t*F[2] + F[3]);
      }
      return p;
   }

   let isNear = p => diagram.distance(p,[x,y]) < 20;

   // INITIALIZE

   if (! S.K) {
      S.K = [[100,250],[200,50],[360,50],[460,250]];
      S.t = .5;
   }

   // SET USEFUL LOCAL VARIABLES

   let xyz=diagram.getCursor(),x=xyz[0],y=xyz[1],z=xyz[2];
   let K=S.K,A=K[0],B=K[1],C=K[2],D=K[3],t=S.t;

   // INTERACT WITH SPLINE KEY POINTS

   if (! z)
      S.k = -1;
   if (diagram.isPress())
      for (let k = 0 ; k < K.length ; k++)
         if (isNear(K[k]))
            S.k = k;
   if (S.k >= 0)
      K[S.k] = [x,y];

   // INTERACT WITH THE SLIDER

   let d = mix([100,350],[460,350],t);
   if (! z)
      S.tSlide = false;
   if (diagram.isPress())
      S.tSlide = y >= d[1]-10 && y < d[1]+10;
   if (S.tSlide)
      S.t=t=Math.max(0,Math.min(1,(x-100)/360));

   // DRAW THE DIAGRAM TITLE

   diagram.setTextHeight(25);
   diagram.drawText(S.Mtype==2 ? 'B-spline' :
                    S.Mtype==1 ? 'Catmull-Rom' :
		                 'Bezier', [20,20],'black','left');
   diagram.drawText('interpolation',[20,50]);

   // DRAW THE SPLINE SCAFFOLDING

   if (S.Mtype == 0) {
      let a = mix(A,B,t), b = mix(B,C,t), c = mix(C,D,t);
      diagram.setLineWidth(1);
      for (let k = 0 ; k < K.length - 1 ; k++)
         diagram.drawLine(K[k], K[k+1], 'blue');
      diagram.drawLine(a,b);
      diagram.drawLine(b,c);
      diagram.drawLine(mix(a,b,t),mix(b,c,t));
   }

   // DRAW THE SPLINE

   let J = S.Mtype == 0
   ? [
        [A, B, C, D]
     ]
   : [
        [A, A, B, C],
        [A, B, C, D],
        [B, C, D, D],
   ];

   diagram.setLineWidth(5);
   for (let j = 0 ; j < J.length ; j++)
      for (let t = 0 ; t < 1 ; t += 1/100)
         diagram.drawLine(spline(J[j],t),
                          spline(J[j],t+1/100),'black');
   for (let k = 0 ; k < K.length ; k++)
      diagram.fillCircle(K[k],10, 'red');

   switch (S.Mtype) {
   case 0:
      diagram.fillCircle(spline(J[0],t),10,'black');
      break;
   default:
      let j = Math.min(J.length-1, Math.floor(3 * t));
      let f = 3 * t - j;
      diagram.fillCircle(spline(J[j],f),10,'black');
      break;
   }

   // DRAW THE SLIDER 

   diagram.setLineWidth(7);
   diagram.drawLine([100,350],[460,350],'gray');
   diagram.fillRect([d[0]-10,d[1]-10],[20,20],'red');

   diagram.setTextHeight(20);
   let label = 't = ' + Math.floor(100*t)/100;
   diagram.drawText(label,[d[0],d[1]+20],'black','center');
}

rooms.hw5 = function() {

description = `<b>Homework 5</b>
               <p>
               Splines and Interactive diagrams
               <p>
`
+ addDiagram(560, 400)
+ `
<p>
<button type="button"
onclick="S.Mtype = (S.Mtype + 1) % 3">
Switch spline type
</button>
`
;

code = {

'intro':`
S.html(\`
<b>Introduction to homework 5</b>
<blockquote>
Your homework assignment for this week
is in the tab <code>hw5</code>.
<p>
If you look at the definition of
<code>window.splineDiagram</code>
in file
<code>js/hw5.js</code>
in this folder,
you will see an implementation of
an interactive diagram that explains
spline interpolation.
<p>
There is also a button below
the diagram
which allows you to
switch between
a B&eacute;zier spline, a Catmull-Rom spline
and a B-spline.
<p>
As we discussed in class,
below are all of the methods of the <code>diagram</code> object:
<pre>
   distance(a,b)
   drawCircle(center,radius<font color=gray>,color</font>)
   drawLine(a,b<font color=gray>,color</font>)
   drawRect(position,size<font color=gray>,color</font>)
   drawText(message,position<font color=gray>,color,align,baseline</font>)
   getCursor()
   getHeight()
   getWidth()
   fillCircle(center,radius<font color=gray>,color</font>)
   fillRect(position,size<font color=gray>,color</font>)
   isPress()
   isRelease()
   setColor(color)
   setLineWidth(value)
   setTextHeight(value)
</pre>
</blockquote>
\`);
if (showDiagram())
   splineDiagram();
`,

'hw5':`
S.html(\`
<b>Homework 5</b>
<blockquote>
Your homework assignment for this week,
which is due before the start of class
on Tuesday November 16,
has two parts:
<ol>
<li>
Last week you created an interesting character
or scene, which contained some kind of animation.
Starting with that character or scene,
or else creating something new and different
if you would like,
Animate your character or scene
using splines.
<p>
Use time as the parameter,
and use your splines
to vary the arguments
to your matrix translations or rotations.
<p>
You can use Hermite, Bezier, Catmull-Rom
or B-splines.
(which are described in the tab
<code>B-splines</code>).
<p>
<li>
Use splines to create some interesting
free-form geometric shapes,
such as surfaces of revolution or extrusions.
Use your imagination for this.
<b><i>Hint:</i></b>
To compute normals,
copy the [x,y,z] vertex values of your parametric
surface into a rectangular array
(indexed by <code>nu</code> and <code>nv</code>).
Use those values to compute the surface normals using
the algorithm in the
Oct 19 notes.
<p>
</ol>
Extra credit:
Make an explanatory interactive diagram,
in the spirit of the diagram
to the right.
<p>
As usual, be creative,
do something fun and interesting,
and ideally interactive.
Surprise me!
</blockquote>
\`);
if (showDiagram())
   splineDiagram();
`,

'bsplines':`
S.html(\`
<b>B-splines</b>
<blockquote>

As we discussed in class,
B-splines are non-interpolating
splines that have C<sup>2</sup>
continuity, which
makes them smoother than other
cubic splines.
<p>
The characteristic matrix for B-splines
converts from the four nearest
key points to the four cubic
coefficients:

<center>
<table><tr>
<td><code><big><big>t<sup>3</sup> t<sup>2</sup> t 1
<th width=50><big><big><big>&bull;
<td><big><big><pre>
-1  3 -3  1
 3 -6  3  0
-3  0  3  0
 1  4  1  0
<th width=50><big><big><big>&bull;
<td><code><big><big>
P<sub>0</sub> <br>
P<sub>1</sub> <br>
P<sub>2</sub> <br>
P<sub>3</sub>
<th width=100> &nbsp;
</tr></table>
</center>

<p>
</blockquote>
\`);
if (showDiagram())
   splineDiagram();
`,

}; // end code

} // end room
