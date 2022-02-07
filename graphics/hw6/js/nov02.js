
let bezierDiagram = () => {

   // DEFINE USEFUL FUNCTIONS

   let mix = (a,b,t) => [ a[0] * (1-t) + b[0] * t,
                          a[1] * (1-t) + b[1] * t ];
   let bezier = (a,b,c,d,t) => mix(mix(mix(a,b,t),
                                       mix(b,c,t),t),
                                   mix(mix(b,c,t),
				       mix(c,d,t),t),t);
   let isNear = p => diagram.distance(p,[x,y]) < 20;

   // INIT

   if (! diagram.K) {
      diagram.K = [[100,250],[200,50],[360,50],[460,250]];
      diagram.t = .5;
   }

   // SET USEFUL LOCAL VARIABLES

   let xyz=diagram.getCursor(),x=xyz[0],y=xyz[1],z=xyz[2];
   let K=diagram.K,A=K[0],B=K[1],C=K[2],D=K[3],t=diagram.t;

   // INTERACT WITH SPLINE KEY POINTS

   if (! z)
      diagram.k = -1;
   else if (! diagram.zPrev)
      for (let k = 0 ; k < K.length ; k++)
         if (isNear(K[k]))
	    diagram.k = k;
   if (diagram.k >= 0)
      K[diagram.k] = [x,y];

   // INTERACT WITH THE SLIDER

   let d = mix([100,350],[460,350],t);
   if (! z)
      diagram.tSlide = false;
   else if (! diagram.zPrev)
      diagram.tSlide = y >= d[1]-10 && y < d[1]+10;
   if (diagram.tSlide)
      diagram.t=t=Math.max(0,Math.min(1,(x-100)/360));

   diagram.zPrev = z;

   // DRAW THE DIAGRAM TITLE

   diagram.setTextHeight(25);
   diagram.drawText('Bezier', [20, 20], 'black', 'left');
   diagram.drawText('interpolation',[20,50]);

   // DRAW THE SPLINE SCAFFOLDING

   let a = mix(A,B,t), b = mix(B,C,t), c = mix(C,D,t);
   diagram.setLineWidth(1);
   for (let k = 0 ; k < K.length - 1 ; k++)
      diagram.drawLine(K[k], K[k+1], 'blue');
   diagram.drawLine(a,b);
   diagram.drawLine(b,c);
   diagram.drawLine(mix(a,b,t),mix(b,c,t));

   // DRAW THE SPLINE

   diagram.setLineWidth(5);
   for (let t = 0 ; t < 1 ; t += 1/100)
      diagram.drawLine(bezier(A,B,C,D,t),
                       bezier(A,B,C,D,t+1/100), 'black');
   diagram.fillCircle(bezier(A,B,C,D,t),10,'black');

   // DRAW THE SLIDER AND SPLINE KEY POINTS

   diagram.setLineWidth(7);
   diagram.drawLine([100,350],[460,350],'gray');
   diagram.fillRect([d[0]-10,d[1]-10],[20,20],'red');
   for (let k = 0 ; k < K.length ; k++)
      diagram.fillCircle(K[k],10);
   diagram.setTextHeight(20);
   let label = 't = ' + Math.floor(100*t)/100;
   diagram.drawText(label,[d[0],d[1]+20],'black','center');
}

rooms.nov02 = function() {

description = `<b>Notes for Tuesday Nov 2</b>
               <p>
	       Interactive diagrams
	       <p>
`
+ addDiagram(560, 400);

code = {

'diagrams':`
S.html(\`
<b>Interactive diagrams</b>
<blockquote>
It can be useful to build interactive diagrams.
In the diagram to the right,
the red dot can be dragged around.
It's done with a <code>diagram</code>
object, which has these methods
(<font color=gray>gray</font> args are optional):
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
   setColor(color)
   setLineWidth(value)
   setTextHeight(value)
</pre>
<p>
The code looks like this:
<blockquote><pre>
if (showDiagram()) {
   if (! S.P)
      S.P = [100,100];
   let C = diagram.getCursor();
   if (C[2])
      S.P = [C[0],C[1]];
   diagram.drawRect(
      S.P,[460-S.P[0],300-S.P[1]],'gray');
   diagram.fillCircle(S.P,C[2]?20:10,'red');
}
</pre></blockquote>
</blockquote>
\`);
if (showDiagram()) {
   if (! S.P)
      S.P = [100,100];
   let C = diagram.getCursor();
   if (C[2])
      S.P = [C[0],C[1]];
   diagram.drawRect(S.P,[460-S.P[0],300-S.P[1]],'gray');
   diagram.fillCircle(S.P,C[2]?20:10,'red');
}
`,

'bezier':`
S.html(\`
<b>Bezier example</b>
<blockquote>
You can make multipage interactive documents,
with each page having a different interactive diagram.
Here, for example, is a diagram illustrating
Bezier spline interpolation.
<p>
The different parts of the code for this do different things.
We can go through the code to learn what each part does.
<p>
Note that I have established a convention here
that red things are interactive handles.
Nothing in the underlying system says that
says this must be so.
It is simply a visual design choice that I have made.
<pre>
</pre>

</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,

'bezier 1':`
S.html(\`
<b>Bezier example</b>
<blockquote>

<pre>
   // DEFINE USEFUL FUNCTIONS

   let mix = (a,b,t) => [ a[0] * (1-t) + b[0] * t,
                          a[1] * (1-t) + b[1] * t ];
   let bezier = (a,b,c,d,t) => mix(mix(mix(a,b,t),
                                       mix(b,c,t),t),
                                   mix(mix(b,c,t),
				       mix(c,d,t),t),t);
   let isNear = p => diagram.distance(p,[x,y]) < 20;
</pre>

</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,


'bezier 2':`
S.html(\`
<b>Bezier example</b>
<blockquote>
<pre>
   // INIT

   if (! diagram.K) {
      diagram.K = [[100,250],[200,50],[360,50],[460,250]];
      diagram.t = .5;
   }

   // SET USEFUL LOCAL VARIABLES

   let xyz=diagram.getCursor(),x=xyz[0],y=xyz[1],z=xyz[2];
   let K=diagram.K,A=K[0],B=K[1],C=K[2],D=K[3],t=diagram.t;

</pre>
</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,


'bezier 3':`
S.html(\`
<b>Bezier example</b>
<blockquote>
<pre>
   // INTERACT WITH SPLINE KEY POINTS

   if (! z)
      diagram.k = -1;
   else if (! diagram.zPrev)
      for (let k = 0 ; k < K.length ; k++)
         if (isNear(K[k]))
	    diagram.k = k;
   if (diagram.k >= 0)
      K[diagram.k] = [x,y];

   // INTERACT WITH THE SLIDER

   let d = mix([100,350],[460,350],t);
   if (! z)
      diagram.tSlide = false;
   else if (! diagram.zPrev)
      diagram.tSlide = y >= d[1]-10 && y < d[1]+10;
   if (diagram.tSlide)
      diagram.t=t=Math.max(0,Math.min(1,(x-100)/360));

   diagram.zPrev = z;
<pre>
</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,


'bezier 4':`
S.html(\`
<b>Bezier example</b>
<blockquote>
<pre>
   // DRAW THE DIAGRAM TITLE

   diagram.setTextHeight(25);
   diagram.drawText('Bezier', [20, 20], 'black', 'left');
   diagram.drawText('interpolation',[20,50]);

   // DRAW THE SPLINE SCAFFOLDING

   let a = mix(A,B,t), b = mix(B,C,t), c = mix(C,D,t);
   diagram.setLineWidth(1);
   for (let k = 0 ; k < K.length - 1 ; k++)
      diagram.drawLine(K[k], K[k+1], 'blue');
   diagram.drawLine(a,b);
   diagram.drawLine(b,c);
   diagram.drawLine(mix(a,b,t),mix(b,c,t));

</pre>
</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,


'bezier 5':`
S.html(\`
<b>Bezier example</b>
<blockquote>
<pre>
   // DRAW THE SPLINE

   diagram.setLineWidth(5);
   for (let t = 0 ; t < 1 ; t += 1/100)
      diagram.drawLine(bezier(A,B,C,D,t),
                       bezier(A,B,C,D,t+1/100), 'black');
   diagram.fillCircle(bezier(A,B,C,D,t),10,'black');

   // DRAW THE SLIDER AND SPLINE KEY POINTS

   diagram.setLineWidth(7);
   diagram.drawLine([100,350],[460,350],'gray');
   diagram.fillRect([d[0]-10,d[1]-10],[20,20],'red');
   for (let k = 0 ; k < K.length ; k++)
      diagram.fillCircle(K[k],10);
   diagram.setTextHeight(20);
   let label = 't = ' + Math.floor(100*t)/100;
   diagram.drawText(label,[d[0],d[1]+20],'black','center');
</pre>
</blockquote>
\`);
if (showDiagram())
   bezierDiagram();
`,


}; // end code

} // end room

