
S.Mtype = 0;
rooms.hw5 = function() {

description = `<b>Homework 5</b>
               <p>
               Splines and Interactive diagrams
               <p>
`
/*+addDiagram(560, 400)
+ `
<p>
<button type="button"
onclick="S.Mtype = (S.Mtype + 1) % 3">
Switch spline type
</button>
`*/
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
