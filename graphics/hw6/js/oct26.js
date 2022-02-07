
rooms.oct26 = function() {

description = `<b>Notes for Tuesday Oct 26</b>
               <p>
	       Splines`;

code = {

'intro':`
S.html(\`
<b>Introduction to splines</b>
<blockquote>
All of the shapes we have dealt with so far
have a certain geometric precision to them.
We can create tubes, ellipsoids, boxes,
and other regular shapes, but so far
we cannot create free-form
organic looking shapes.
<p>
The world is filled with organic shapes.
Trees, hands, faces, bodies, automobiles,
and many other shapes,
even some toasters,
have an organic
quality to them.
<p>
Generally speaking, the first
step in creating organic looking
shapes is to be able to create
free-form smooth curves.
Free-form curves that you can
tweak and shape and customize
are called "splines".
<p>
Spline curves can be two dimensional or
three dimensional.
We will see that once you can define
2D spline curves,
it is very easy to generalize to 3D.
<p>
Splines are incredibly useful.
There are all sorts of applications for
spline curves, from designing text fonts
to modeling interesting shapes to
creating natural looking
motion paths for animation.
<p>
In this section we will learn
about the properties and mathematics of splines,
as well as
how to create them and how to use them.

</blockquote>
\`);
setDescription(description);
`,


///////////////////////////////////////////////////////////////////


'cubic':`
S.html(\`
<b>Cubic splines</b>
<blockquote>
We want spline curves to be flexible,
but also efficiently computable.
The trick is to find a good primitive
basis for a piece of spline curve,
and then to string together
those primitive curves end-to-end
in order to make more complex curves.
<p>
We want our primitive to at least be
able to have an
inflection point, so that it can take on
an "S"-like shape.
The simplest way to do this is to
use cubic polynomial curves.
<p>
In particular, we are going to use
parametric cubic curves as our primitive.
To make a two dimensional curve, the
general form is:
<blockquote><code>
x = a<sub>x</sub> t<sup>3</sup> +
    b<sub>x</sub> t<sup>2</sup> +
    c<sub>x</sub> t +
    d<sub>x</sub>
<p>
y = a<sub>y</sub> t<sup>3</sup> +
    b<sub>y</sub> t<sup>2</sup> +
    c<sub>y</sub> t +
    d<sub>y</sub>
</code></blockquote>

As parameter t varies between 0.0 and 1.0,
the curve traces out a smooth path from a beginning point to an ending point.
Note that eight numerical constants are required to define this curve:
<blockquote><code>
    a<sub>x</sub>,
    b<sub>x</sub>,
    c<sub>x</sub>,
    d<sub>x</sub>,
    a<sub>y</sub>,
    b<sub>y</sub>,
    c<sub>y</sub>,
    d<sub>y</sub>
</code></blockquote>

</blockquote>
<p>


</blockquote>
\`);
setDescription(description);
`,


///////////////////////////////////////////////////////////////////


'multiple':`
S.html(\`
<b>Making a complex smooth curve from multiple cubic curves</b>
<blockquote>
We want to
form a complex smooth curve by
laying end-to-end a sequence of parametric cubic curves
<code>C<sub>0</sub>,C<sub>1</sub>...C<sub>n-1</sub></code>.
The trick is to match the position and oriention
at <code>t==1</code>
of any curve
<code>C<sub>i</sub></code>
with the position and orientation
at <code>t==0</code>
of the curve which follows it
<code>C<sub>i+1</sub></code>.
<p>
Each curve
will have position and direction vectors, respectively:

<blockquote><code>
</code>position:<code>&nbsp; [   a<sub>x</sub>t<sup>3</sup>+b<sub>x</sub>t<sup>2</sup>+c<sub>x</sub>t+d<sub>x</sub> , a<sub>y</sub>t<sup>3</sup>+b<sub>y</sub>t<sup>2</sup>+c<sub>y</sub>t+d<sub>y</sub> ]

<br>
</code>direction:<code> [   &nbsp; 3a<sub>x</sub>t<sup>2</sup>+2b<sub>x</sub>t+c<sub>x</sub> <small>&nbsp;</small>, &nbsp; 3a<sub>y</sub>t<sup>2</sup>+2b<sub>y</sub>t+c<sub>y</sub> <small>&nbsp;</small>]

</code></blockquote>

At <code>t==0</code> this will be:
<code></code>position:<code><small>&nbsp;</small> [ d<sub>x</sub> , d<sub>y</sub> ]</code>
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
<code></code>direction:<code> [ c<sub>x</sub> , c<sub>y</sub> ]</code>
<p>

At <code>t==1</code> this will be:
<code></code>position:<code><small>&nbsp;</small> [ a<sub>x</sub>+b<sub>x</sub>+c<sub>x</sub>+d<sub>x</sub> ,
        a<sub>y</sub>+b<sub>y</sub>+c<sub>y</sub>+d<sub>y</sub> ]</code>
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
<code></code>direction:<code> [ 3a<sub>x</sub>+2b<sub>x</sub>+c<sub>x</sub> &nbsp;,
        3a<sub>y</sub>+2b<sub>y</sub>+c<sub>y</sub> <small>&nbsp;</small>]</code>

<p>

So for any two successive curves
<code>C<sub>i</sub></code>
and
<code>C<sub>i+1</sub></code> in the sequence,
we need to satisfy the following
four constraints:

<blockquote><code>
a<sub>x<sub>i</sub></sub>+b<sub>x<sub>i</sub></sub>+c<sub>x<sub>i</sub></sub>+d<sub>x<sub>i</sub></sub>
== d<sub>x<sub>i+1</sub></sub>
&nbsp; &nbsp;
3a<sub>x<sub>i</sub></sub>+2b<sub>x<sub>i</sub></sub>+c<sub>x<sub>i</sub></sub>
== c<sub>x<sub>i+1</sub></sub>
<p>
a<sub>y<sub>i</sub></sub>+b<sub>y<sub>i</sub></sub>+c<sub>y<sub>i</sub></sub>+d<sub>y<sub>i</sub></sub>
== d<sub>y<sub>i+1</sub></sub>
&nbsp; &nbsp;
3a<sub>y<sub>i</sub></sub>+2b<sub>y<sub>i</sub></sub>+c<sub>y<sub>i</sub></sub>
== c<sub>y<sub>i+1</sub></sub>
</code></blockquote>


</blockquote>
\`);
setDescription(description);
`,


///////////////////////////////////////////////////////////////////


'friendly':`
S.html(\`
<b>Making parametric cubic curves friendly for humans</b>
<blockquote>
It is very difficult for most human beings to
think in terms of cubic coefficients.
For this reason, various clever people
have come up with easier ways to specify
parametric cubic curves,
that mostly rely on
conveniently defined <i>key points</i>.
<p>
Suppose, for example, you are a rocket scientist.
You might want to specify the measured position and
direction at the beginning and end
of each component cubic segment
of your rocket ship's trajectory,
and let the computer figure out the rest.
<p>
Or perhaps you are a graphic designer.
You might want to
use a visual interface to
design the letters of a font,
specifying beginning and end points
for each cubic segment,
while dragging around
some extra points
to adjust the slope where
segments meet.
<p>
Or maybe you just
want to specify a sequence of key points
that your spline should go through,
and let the computer figure out the
directions of the component cubic curve segments
in the places where any two segments meet.
<p>
None of these ways of specifying your curve
is better than the others -- they are all useful
for different purposes.
What we want is a way to use any
one of these input methods,
and end up with the eight cubic coefficients:
<code>a<sub>x</sub>,b<sub>x</sub>,c<sub>x</sub>,d<sub>x</sub>,a<sub>y</sub>,b<sub>y</sub>,c<sub>y</sub>,d<sub>y</sub></code>
<p>
In the following sections,
we are going to show how to do this.


</blockquote>
\`);
setDescription(description);
`,


///////////////////////////////////////////////////////////////////


'hermite':`
S.html(\`
<b>Cubic Hermite splines</b>
<blockquote>
Say I am describing the path of a rocketship. I want
to describe each cubic parametric curve segment by
its position
<code>P<sub>0</sub></code> and <code>P<sub>1</sub></code>
at <code>t==0</code>
and
at <code>t==1</code>,
and its direction
<code>R<sub>0</sub></code> and <code>R<sub>1</sub></code>
at <code>t==0</code>
and
<code>t==1</code>.
<p>

We can express this as a weighted sum of
four cubic polynomials
(see the curves corresponding to these polynomials to the right):
<p>
<center><code>
(2t<sup>3</sup>-3t<sup>2</sup>+1)*P<sub>0</sub> +
(-2t<sup>3</sup>+3t<sup>2</sup>)*P<sub>1</sub> +
(t<sup>3</sup>-2t<sup>2</sup>+t)*R<sub>0</sub> +
(t<sup>3</sup>-t<sup>2</sup>)*R<sub>1</sub>
</code></center>
</p>

We can rearrange terms to express this as a matrix operation:

<p>
<center>
<table><tr>
<td><code><big><big>t<sup>3</sup> t<sup>2</sup> t 1
<th width=50><big><big><big>&bull;
<td><big><big><pre>
 2 -2  1  1
-3  3 -2 -1
 0  0  1  0
 1  0  0  0
<th width=50><big><big><big>&bull;
<td><code><big><big>
P<sub>0</sub> <br>
P<sub>1</sub> <br>
R<sub>0</sub> <br>
R<sub>1</sub>
<th width=100> &nbsp;
</tr></table>
</center>

<p>

This is called <i>cubic Hermite spline interpolation</i>,
named in honor of the great french
mathematician
<a href=https://en.wikipedia.org/wiki/Charles_Hermite>Charles Hermite</a>.

<p>

For each different way that we would like to define
a cubic parametric curve, there is a
corresponding matrix transformation.
<p>
Suppose, for example,
that instead of specifying directions at
<code>t==0</code>
and
<code>t==1</code>,
we want to provide convenient adjustable guide points to a visual designer.
This approach was
developed by
<a href=https://en.wikipedia.org/wiki/Pierre_B%C3%A9zier>Pierre B&eacute;zier</a>.
We will look at it next.





</blockquote>
\`);
setDescription(description + '<p><img src=imgs/hermite_basis_functions.png width=560>');
`,



///////////////////////////////////////////////////////////////////


'bezier':`
S.html(\`
<b>Cubic B&eacute;zier splines</b>
<blockquote>
A very popular way to specify cubic parametric splines
was developed by Pierre B&eacute;zier.
In this approach,
a visual designer
specifies the start and end points of the
spline curve, as
well as two other guide points
the designer can drag around to control
direction and curvature at the
start and end of the curve.
<p>
Mathematically, a B&eacute;zier spline can be thought of
as a set of successive interpolations.
Let <code>mix(a,b,t) = a*(1-t)+b*t</code>.
Then given end points
<code>A</code>
and
<code>D</code>
and intermediate guide points
<code>B</code>
and
<code>C</code>,
as shown in the figure to the right:

<p>
<pre>
   <font color=red>P = mix(<font color=magenta>mix(<font color=blue>mix(<font color=black>A,B</font>,t)</font>,
               <font color=blue>mix(<font color=black>B,C</font>,t)</font>,t)</font>,
           <font color=magenta>mix(<font color=blue>mix(<font color=black>B,C</font>,t)</font>,
               <font color=blue>mix(<font color=black>C,D</font>,t)</font>,t)</font>,t)</font>
</pre>

This multiplies out to:
<p>
<blockquote><code>
P = A(1-t)<sup>3</sup> +
    3B(1-t)<sup>2</sup>t +
    3C(1-t)t<sup>2</sup> +
    Dt<sup>3</sup>
</code></blockquote>

We can express this as a matrix operation:

<p>
<center>
<table><tr>
<td><code><big><big>t<sup>3</sup> t<sup>2</sup> t 1
<th width=50><big><big><big>&bull;
<td><big><big><pre>
-1  3 -3  1
 3 -6  3  0
-3  3  0  0
 1  0  0  0
<th width=50><big><big><big>&bull;
<td><code><big><big>
A <br>
B <br>
C <br>
D
<th width=100> &nbsp;
</tr></table>
</center>

<p>

This is called <i>cubic B&eacute;zier spline interpolation</i>.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/bezier3.png width=560>');
`,


///////////////////////////////////////////////////////////////////


'transitions':`
S.html(\`
<b>Smooth transitions between B&eacute;zier curves</b>
<blockquote>
B&eacute;zier splines are very popular partly because
they are easy and intuitive for visual designers to use.
One thing that designers like about B&eacute;zier curves is
that they provide a way to ensure
that adjoining curve segments will blend
smoothly together, with the curve direction at <code>t==1</code>
of one segment
guaranteed to match
the curve direction at <code>t==0</code>
of the next segment.
<p>
This guarantee of smoothness is implemented as follows:
Suppose we have two adjoining curves
that share a common point
<code>D<sub>1</sub></code>.
The first curve is defined by
key points
<code>A<sub>1</sub>,B<sub>1</sub>,C<sub>1</sub>,D<sub>1</sub></code>
and the second curve by
key points
<code>D<sub>1</sub>,B<sub>2</sub>,C<sub>2</sub>,D<sub>2</sub></code>.
<p>
We need only ensure that line segment
<code>C<sub>1</sub>&rarr;D<sub>1</code>
is parallel to line segment
<code>D<sub>1</sub>&rarr;B<sub>2</code>,
as shown in the figure.
If this is true, then
the two adjacent curves will have the same direction
where they join.
In a GUI this is implemented as follows:
<ul>
<li>When the user drags around
<code>C<sub>1</sub></code>,
the program modifies
<code>B<sub>2</sub></code>
so that 
<code>B<sub>2</sub></code>
remains on the line
<code>C<sub>1</sub>&rarr;D<sub>1</sub></code>.
<p>
<li>Similarly, when the user drags around
<code>B<sub>2</sub></code>,
the program modifies
<code>C<sub>1</sub></code>
so that 
<code>C<sub>1</sub></code>
remains on the line
<code>D<sub>1</sub>&rarr;B<sub>2</sub></code>.
<p>
<li>When the user drags around
<code>D<sub>1</sub></code>,
the program modifies
both
<code>C<sub>1</sub></code>
and
<code>B<sub>2</sub></code>
so that they move together with
<code>D<sub>1</sub></code>.
</ul>

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/two_beziers.png width=560>');
`,

///////////////////////////////////////////////////////////////////


'catmull-rom':`
S.html(\`
<b>Catmull-Rom splines</b>
<blockquote>
The Catmull-Rom spline is similar in spirit to
the Hermite and B&eacute;zier splines,
but doesn't require the user to explicitly
define a direction at each key point.
Instead, it uses positions of other neighboring
key points to influence the curve direction
(but not the curve position)
at each key point.

<p>

To determine the cubic curve
between two successive key points
<code><font color=blue>P<sub>i</sub></font></code>
and
<code><font color=blue><font color=#00a000>P<sub>i+1</sub></font></font></code>,
we use the locations of the four successive key points
<code><font color=red>P<sub>i-1</sub></font></code>,
<code><font color=blue>P<sub>i</sub></font></code>,
<code><font color=#00a000>P<sub>i+1</sub></font></code>,
<code><font color=gray>P<sub>i+2</sub></font></code>.

<p>

In particular, we do a weighted
sum of four cubic equations:

<p>
<center>
<pre>(<font color=red>(-t<sup>3</sup>+2t<sup>2</sup>-t)P<sub>i-1</sub></font>+\
<font color=blue>(3t<sup>3</sup>-5t<sup>2</sup>+2)P<sub>i</sub></font>+\
<font color=#00a000>(-3t<sup>3</sup>+4t<sup>2</sup>+t)P<sub>i+1</sub></font>+\
<font color=gray>2</sub>(t<sup>3</sup>-t<sup>2</sup>)P<sub>i+2</sub></font>)/2</pre>
</center>


<p>
We can express this as a matrix operation:

<p>
<center>
<table><tr>
<td><code><big><big>t<sup>3</sup> t<sup>2</sup> t 1
<th width=50><big><big><big>&bull;
<td><big><big><pre>
<font color=red>-1/2</font> <font color=blue> 3/2</font> <font color=#00a000>-3/2</font> <font color=gray> 1/2</font>
<font color=red>  1 </font> <font color=blue>-5/2</font> <font color=#00a000>  2 </font> <font color=gray>-1/2</font>
<font color=red>-1/2</font> <font color=blue>  0 </font> <font color=#00a000> 1/2</font> <font color=gray>  0 </font>
<font color=red>  0 </font> <font color=blue>  1 </font> <font color=#00a000>  0 </font> <font color=gray>  0 </font>
<th width=50><big><big><big>&bull;
<td><code><big><big>
<font color=red>P<sub>i-1</sub></font> <br>
<font color=blue>P<sub>i</sub></font> <br>
<font color=#00a000>P<sub>i+1</sub></font> <br>
<font color=gray>P<sub>i+2</sub></font>
<th width=100> &nbsp;
</tr></table>
</center>

<p>

This is called <i>cubic Catmull-Rom spline interpolation</i>.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/catmull_rom.jpg width=560>');
`,


///////////////////////////////////////////////////////////////////


'applications':`
S.html(\`
<b>Applications of splines</b>
<blockquote>
Splines have many different uses, and
the same spline curve can be used for multiple purposes.
For example, 
in the figure to the right,
the same spline curve is being
used to animate the fish,
and also as a
profile for the
surface of revolution.
In this case the spline
forms a closed loop, so that
the end of the spline seamlessly
joins with its beginning.
<p>

For the fish animation,
the spline's direction is
used to orient the fish as
it swims along the path.
At each animation frame
the orientation of the fish
at the previous animation frame
is used to construct a new orientation
matrix.
<p>
If the position of
the fish at the previous frame was
<code>P<sub>i-1</sub></code>, its new position
is <code>P<sub>i</sub></code>,
and the previous orientation
vectors were
<code>X<sub>i-1</sub></code>,
<code>Y<sub>i-1</sub></code>,
<code>Z<sub>i-1</sub></code>,
then the new orientation is constructed as:
<pre>
    Z<sub>i</sub> = normalize(P<sub>i</sub> - P<sub>i-1</sub>)
    X<sub>i</sub> = normalize(Y<sub>i-1</sub> &#10005; Z<sub>i</sub>)
    Y<sub>i</sub> = normalize(Z<sub>i</sub> &#10005; X<sub>i</sub>)
</pre>
<p>

In the case of the surface of
revolution, a circular profile
is swept along the spline path to form
a parametric surface triangle mesh.
Surface normals are then
calculated for each vertex,
and the resulting object
is rendered using Phong shading.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/flask_and_fish.png width=560>');
`,

}; // end code

} // end room

