
rooms.matrices1 = function() {

description = `<b>Notes for Tuesday September 28</b>
               <p>
	       Introduction to Matrices`;

code = {

'what is a matrix':`
S.html(\`
<b>What is a matrix:</b>

<blockquote>
A 4x4 matrix is a way to describe a linear transformation
in three dimensions:
<blockquote>
Given two points A and B, and a straight line between them,
transform A to A' and B to B'
such that 
the straight line between them transforms to a straight line.
</blockquote>

We define a matrix transformation like this:
<blockquote>

<table><tr>
<th><pre><big><big><big>
x'
y'
z'
w'
</pre>

<th width=50><pre><big><big><big>
&larr;
</pre>

<th><pre><big><big><big>
a e i m
b f j n
c g k o
d h l p
</pre>

<th width=50><pre><big><big><big>
*
</pre>

<th><pre><big><big><big>
x
y
z
w
</pre>

</tr></table>
</blockquote>
&nbsp;<p>

Note that the 16 values of the matrix are in column major order.
<p>
Effectively we are performing 4 dot products:
<blockquote>
<pre>
x' = <b>a</b>x + <b>e</b>y + <b>i</b>z + <b>m</b>w
y' = <b>b</b>x + <b>f</b>y + <b>j</b>z + <b>n</b>w
z' = <b>c</b>x + <b>g</b>y + <b>k</b>z + <b>o</b>w
w' = <b>d</b>x + <b>h</b>y + <b>l</b>z + <b>p</b>w
</pre>
</blockquote>

</blockquote>

<p>

\`);
setDescription(description);
`,

'infinity':`
S.html(\`
<b>Points at infinity:</b>
<blockquote>
Points at infinity (direction vectors) can be handled just fine.
<br>
Just change w from 1 to 0:
<p>

Instead of:
<blockquote>
<pre>
x
y
z
1
</pre>
</blockquote>

Use:
<blockquote>
<pre>
x
y
z
0
</pre>
</blockquote>

Things get easier if you allow points at infinity.
<br>
So we use four numbers per vector, not three.
<p>

In the second case, the rightmost
column of the matrix will be ignored
in the matrix/vector multiply:

<blockquote>
<pre>
a e i <font color=red>m</font>
b f j <font color=red>n</font>
c g k <font color=red>o</font>
d h l <font color=red>p</font>
</pre>
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

'planes':`
S.html(\`
<b>Points versus planes:</b>
<blockquote>

We represent a point P as a column vector:
<blockquote>
<pre>
x
y
z
w
</pre>
</blockquote>

We represent a plane A as a row vector:
<blockquote>
<pre>
a b c d
</pre>
</blockquote>

Point P is on plane A if the dot product A&bull;P is zero:
<blockquote>
<pre>
ax + by + cz + dw = 0
</pre>
</blockquote>

Point P is inside halfspace A if the dot product A&bull;P is not positive:
<blockquote>
<pre>
ax + by + cz + dw &le; 0
</pre>
</blockquote>

Point P is outside halfspace A if the dot product A&bull;P is positive:
<blockquote>
<pre>
ax + by + cz + dw &gt; 0
</pre>
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

'plane normal':`
S.html(\`
<b>The normal direction of a plane:</b>
<blockquote>
Consider plane A = [a,b,c,d].
<p>
The vector [a,b,c] is the normal direction
of plane A = [a,b,c,d].
<p>
That's the direction perpendicular to the plane.
<p>
We can think of an infinite number of parallel planes.
<p>
These planes vary only by the value of d.
<br>
We can think of an infinite number of parallel planes.
<p>
Each one defines a different inside/outside
halfspace.
</blockquote>
\`);
setDescription(description);
`,

'homogeneous':`
S.html(\`
<b>Homogeneous equations:</b>
<blockquote>
Homogeneous equations have zero on the right side.
<p>
They are convenient to work with.
<p>
That's what we used for unit spheres:

<blockquote>
x<sup>2</sup> +
y<sup>2</sup> +
z<sup>2</sup> -
r<sup>2</sup> &le; 0
</blockquote>

Similarly, we use a homogeneous equation for halfspaces:

<blockquote>
ax + by + cz + dw &le; 0
</blockquote>

This lets us scale the left hand side
up or down however we like.
It doesn't change the inequality.

<p>

Special case: a plane through the origin (d==0):

<blockquote>
ax + by + cz &le; 0
</blockquote>

This is useful for describing surface normals.

</blockquote>
\`);
setDescription(description);
`,

'cube':`
S.html(\`
<b>Defining a unit cube:</b>
<blockquote>
A unit cube can be defined by the following 6 constraints:
<blockquote>
<pre>
x &ge; -1      x &le; 1
y &ge; -1      y &le; 1
z &ge; -1      z &le; 1
</pre>
</blockquote>

Rewrite each of these in homogeneous form:

<blockquote>
<pre>
-x - 1 &le; 0      x - 1 &le; 0
-y - 1 &le; 0      y - 1 &le; 0
-z - 1 &le; 0      z - 1 &le; 0
</pre>
</blockquote>

This gives us 6 halfspace descriptions:

<blockquote>
<pre>
-1  0  0 -1        <font color=gray>( -x - 1 &le; 0 )</font>
 1  0  0 -1        <font color=gray>(  x - 1 &le; 0 )</font>
 0 -1  0 -1        <font color=gray>( -y - 1 &le; 0 )</font>
 0  1  0 -1        <font color=gray>(  y - 1 &le; 0 )</font>
 0  0 -1 -1        <font color=gray>( -z - 1 &le; 0 )</font>
 0  0  1 -1        <font color=gray>(  z - 1 &le; 0 )</font>
</pre>
</blockquote>

First three numbers give us the plane normals:

<blockquote>
<pre>
-1  0  0      // left
 1  0  0      // right
 0 -1  0      // bottom
 0  1  0      // top
 0  0 -1      // back
 0  0  1      // front
</pre>
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

'trace to halfspace':`
S.html(\`
<b>Ray tracing to a halfspace:</b>
<blockquote>
Consider all points <code>[x,y,z,1]</code>
<br>
and the halfspace bounded by plane <code>[a,b,c,d]</code>.
<p>
Given: a ray <code>V + tW</code>
<p>
&nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; and a plane <code>[a,b,c,d]</code> defining points: <code>ax+by+cz+d=0</code>
<p>
Solve for what point along the ray is on the plane.
<blockquote>
<code>V = [Vx,Vy,Vz]</code>
<br>
<code>W = [Wx,Wy,Wz]</code>
<br>
<code>[x,y,z] = [Vx+tWx,Vy+tWy,Vz+tWz]</code>
</blockquote>

So given halfspace [a,b,c,d]:
<blockquote>
  <code>a(Vx+tWx) + b(Vy+tWy) + c(Vz+tWz) + d(Vw+tWw) &le; 0</code>
</blockquote>

Solve for t:

<blockquote>
  <code>a Vx + b Vy + c Vz + d Vw + </code>
  <br>
  <code>a Wx + b Wy + c Wz + d Ww &le; 0</code>
  <p>
  <code>A&bull;V + t A&bull;W &le; 0</code>
  <p>
  <code>t A&bull;W &le; -A&bull;V</code>
  <p>
  <code>t &le; -A&bull;V / A&bull;W</code>
  <br>
</blockquote>


</blockquote>
\`);
setDescription(description);
`,

'cases':`
S.html(\`
<b>Different cases of a ray and a halfspace:</b>
<blockquote>
Given our solution for t:

<blockquote>
  <pre>
  t &gt; 0
  t &le; -A&bull;V / A&bull;W
  </pre>
</blockquote>

Depending on the values of <code>A&bull;V</code> and <code>A&bull;W</code>, there
are nine cases:
<blockquote>
<pre>
A&bull;V &lt; 0   A&bull;W &lt; 0   // further in (case 4)
A&bull;V = 0   A&bull;W &lt; 0   // from on plane, going in
A&bull;V &gt; 0   A&bull;W &lt; 0   // front facing (case 2)

A&bull;V &lt; 0   A&bull;W = 0   // parallel inside halfspace
A&bull;V = 0   A&bull;W = 0   // parallel on plane
A&bull;V &gt; 0   A&bull;W = 0   // parallel outside halfspace

A&bull;V &lt; 0   A&bull;W &gt; 0   // back facing (case 3)
A&bull;V = 0   A&bull;W &gt; 0   // from on plane, going out
A&bull;V &gt; 0   A&bull;W &gt; 0   // further out (case 1)
</pre>
</blockquote>

</blockquote>
\`);
setDescription(description + '<p><div>&nbsp; &nbsp;<img src=imgs/four_cases.png width=550></div>');
`,

'trace to cube':`
S.html(\`
<b>Ray tracing to a unit cube:</b>
<blockquote>
Trace to its six halfspaces.
<p>
In most cases, 3 faces will be front facing and 3 back facing.
<blockquote>
t<sub>enter</sub> = max of t of front facing intersections.
<p>
t<sub>exit</sub> = min of t of back facing intersections.
</blockquote>
<p>

There are two cases:

<blockquote>
If t<sub>enter</sub> &le; t<sub>exit</sub>: ray intersects the cube.
<p>
If t<sub>enter</sub> &gt; t<sub>exit</sub>: ray misses the cube.
</blockquote>

<p>

But what if we want a different cube?

<blockquote>

We need to use matrices to transform the cube.
<p>

We do that by transforming the cube's 6 planar faces.
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

'transform1':`
S.html(\`
<b>Matrices as transformations:</b>
<blockquote>
We can think of a matrix as a transformation of points.
<br>
Thought of this way, there are several matrix primitives:
<p>

Identity (transforms point to itself):
<code>&nbsp; &nbsp; x y z  &nbsp;&rarr;&nbsp;  x y z</code>

<blockquote>
<pre>
1  0  0  0
0  1  0  0
0  0  1  0
0  0  0  1
</pre>
</blockquote>

Translate:
<code>&nbsp; &nbsp; x y z &nbsp;&rarr;&nbsp; x+T<sub>x</sub> y+T<sub>y</sub> z+T<sub>z</sub></code>

<blockquote>
<pre>
1  0  0  T<sub>x</sub>
0  1  0  T<sub>y</sub>
0  0  1  T<sub>z</sub>
0  0  0  1
</pre>
</blockquote>

Scale:
<code>&nbsp; &nbsp; x y z &nbsp;&rarr;&nbsp; S<sub>x</sub>x S<sub>y</sub>y S<sub>z</sub>z</code>

<blockquote>
<pre>
S<sub>x</sub> 0  0  0
0  S<sub>y</sub> 0  0
0  0  S<sub>z</sub> 0
0  0  0  1
</pre>

</blockquote>
\`);
setDescription(description + \`
   <p>&nbsp; <img src=imgs/mtranslate.png width=500>
   <p>&nbsp; <img src=imgs/mscale.png width=500>
   \`);
`,

'transform2':`
S.html(\`
<b>Matrices as transformations (continued):</b>
<blockquote>

Consider rotation by &theta; about one of the major axes.
<p>
Let c = cos(&theta;),
s = sin(&theta;).

<p>

Rotate about x:
<code>&nbsp; &nbsp; x y z  &nbsp;&rarr;&nbsp;  x cy-sz sy+cz</code>

<blockquote>
<pre>
 1  0  0  0
 0  c -s  0
 0  s  c  0
 0  0  0  1
</pre>
</blockquote>

Rotate about y:
<code>&nbsp; &nbsp; x y z &nbsp;&rarr;&nbsp;  sz+cx y cz-sx</code>

<blockquote>
<pre>
 c  0  s  0
 0  1  0  0
-s  0  c  0
 0  0  0  1
</pre>
</blockquote>

Rotate about z:
<code>&nbsp; &nbsp; x y z &nbsp;&rarr;&nbsp;  x cy-sz sy+cz</code>

<blockquote>
<pre>
 c -s  0  0
 s  c  0  0
 0  0  1  0
 0  0  0  1
</pre>

</blockquote>
\`);
setDescription(description + \`
   <p>&nbsp; <img src=imgs/mrotatex.png width=338>
   <p>&nbsp; <img src=imgs/mrotatey.png width=338>
   <p>&nbsp; <img src=imgs/mrotatez.png width=338>
   \`);
`,

'associative':`
S.html(\`
<b>Matrix multiplication is associative, but not commutative:</b>
<blockquote>

Associative:
<blockquote>
(A * B) * C == A * (B * C)
</blockquote>

Not commutative:
<blockquote>
A * B &ne; B * A
</blockquote>

Associativity lets us combine many matrix operations into one:

<blockquote>
A &bull; B &bull; C &bull; D &bull; E &bull; F &bull; G &bull; point
</blockquote>

is the same as:

<blockquote>
M &bull; point
</blockquote>
where:

<blockquote>
M = A &bull; B &bull; C &bull; D &bull; E &bull; F &bull; G
</blockquote>

This is important for efficiency of animation.

</blockquote>
\`);
setDescription(description);
`,

'transform a plane':`
S.html(\`
<b>Transforming a plane:</b>
<blockquote>
In order to transform a cube,
we transform its six planes.
<p>

Note the definition of a point <code>P</code> being on a plane <code>A</code>:
<blockquote>
<pre>
A &bull; P = 0
</pre>
</blockquote>

If we transform the point to M&bull;P, we need to transform the plane by its inverse:

<blockquote>
<pre>
A &bull; M<sup>-1</sup> &bull; M &bull; P = 0
</pre>
</blockquote>

The two matrices multiply together and cancel out.

<blockquote>
<pre>
A &bull; M<sup>-1</sup> &bull; M &bull; P =

A &bull; (M<sup>-1</sup> &bull; M) &bull; P =

A &bull; P = 0
</pre>
</blockquote>

So we know the transformed plane contains the transformed point.

</blockquote>
\`);
setDescription(description);
`,

'transform a cube':`
S.html(\`
<b>Transforming a cube:</b>
<blockquote>
To transform a cube, we transform its six halfspaces.
<p>
Its eight vertices will be properly transformed.
<p>
Its twelve edges will be properly transformed.

<blockquote>
Given any one of the defining planes A = [a,b,c,d],
<p>
And given a transformation matrix M:

<blockquote>
A &nbsp;&rarr;&nbsp; A &bull; M<sup>-1</sup>
</blockquote>

</blockquote>

We do this for each of the cube's six faces.

<p>

This method lets us transform any convex polyhedron:
<blockquote>
eg: tetrahedron, octahedron, dodecahedron, icosahedron
</blockquote>

<p>

More advanced topic:

<blockquote>
Transforming curved surfaces, like
cylinders or cones.
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

};

}

