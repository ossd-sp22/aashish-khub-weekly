
rooms.oct5 = function() {

description = `<b>Notes for Tuesday-Thursday Oct 5-7</b>
               <p>
	       Refraction in more detail, and
	       <br>
	       ray tracing to quadric surfaces`;

code = {

'refraction':`
S.html(\`
<b>Refraction in more detail:</b>
<blockquote>

Given an incoming ray in direction W<sub>1</sub>, a surface normal N,
incoming index of refraction <i>n</sub>1</sub></i> and
outgoing index of refraction <i>n</sub>2</sub></i>,
we can compute the direction of the outgoing ray
W<sub>2</sub> in seven steps, as shown in the diagram:

<ol>
<li>
We note that the component of incoming ray W<sub>1</sub>
that is parallel to normal N is given by:
<font color=blue>
C<sub>1</sub> = N (W<sub>1</sub> &bull; N)
</font>
<p>

<li>
We can get the component of W<sub>1</sub>
perpendicular to normal N just by subtracting C<sub>1</sub>
from incoming ray W<sub>1</sub></sub>:
<font color=blue>
S<sub>1</sub> = W<sub>1</sub> - C<sub>1</sub>
</font>
<p>

<li>
The length of S<sub>1</sub> is the sine of incoming
angle &theta;<sub>1</sub>:
<font color=blue>
sin &theta;<sub>1</sub>
=
<big>|</big>S<sub>1</sub><big>|</big>
</font>
<p>

<li>
Snell's law tells us that:
<font color=blue>
<i>n<sub>1</sub></i> sin &theta;<sub>1</sub> =
<i>n<sub>2</sub></i> sin &theta;<sub>2</sub>
</font color=blue>
<p>

<li>
giving the sine of the outgoing angle:
<font color=blue>
sin &theta;<sub>2</sub> = sin &theta;<sub>1</sub> *
<i>n<sub>1</sub></i> /
<i>n<sub>2</sub></i>
</font>
<p>

<li>
We can now construct the components of the outgoing ray:
<p>
<font color=blue>
C<sub>2</sub> = C<sub>1</sub> * cos &theta;<sub>2</sub> / cos &theta;<sub>1</sub>
 &nbsp; &nbsp; </font>where:<font color=blue>
cos &theta;<sub>2</sub> = sqrt(1 - sin<sup>2</sup>&theta;<sub>2</sub>)
<br>
S<sub>2</sub> = S<sub>1</sub> * sin &theta;<sub>2</sub> / sin &theta;<sub>1</sub>
</font>
<p>

<li>
W<sub>2</sub> is just the sum of those two components:
<font color=blue>
W<sub>2</sub> = C<sub>2</sub> + S<sub>2</sub>
</font>

</ol>

</blockquote>

\`);
setDescription(description + '<p><img src=imgs/refraction_steps.jpg width=560>');
`,

'quadric':`
S.html(\`
<b>Quadric surfaces:</b>
<blockquote>

We already know how to ray trace to spheres.
But we would like to ray trace to general second order (quadric) surfaces.
To do this, we need to generalize from unit shapes
to more general shapes.
<p>
We have generalized from a unit sphere:
<blockquote>
x<sup>2</sup> +
y<sup>2</sup> +
z<sup>2</sup>
- 1 &le; 0
</blockquote>
to a general sphere:
<blockquote>
(x-C<sub>x</sub>)<sup>2</sup> +
(y-C<sub>y</sub>)<sup>2</sup> +
(z-C<sub>z</sub>)<sup>2</sup>
- r<sup>2</sup> &le; 0
</blockquote>
<p>
But we haven't generalize to all ellipsoids.
<p>
Similarly, we might figure out how to ray trace to a unit cylinder:
<blockquote>
x<sup>2</sup> +
y<sup>2</sup>
- 1 &le; 0
&nbsp; <big><big>&cap;</big></big> &nbsp;
x &ge; -1
&nbsp; <big><big>&cap;</big></big> &nbsp;
x &le; 1
</blockquote>
But we would also like to ray trace to general cylinders,
including flat pill boxes and long skinny tubes,
in arbitrary locations and directions.
<p>
To ray trace to all
general shapes bound by quadric surfaces,
including cones,
paraboloids and hyperboloids,
can employ matrices,
using a technique that was
first developed by Jim Blinn.

</blockquote>
\`);
setDescription(description);
`,

'matrices':`
S.html(\`
<b>Using matrices to describe quadric surfaces:</b>
<blockquote>

We can describe any second order surface as:
&nbsp;
<font color=blue>P<sup>T</sup></font> &bull; <font color=red>Q</font> &bull; <font color=blue>P</font> &le; 0
<p>

where: <font color=blue>P</font> is a point in space and
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <font color=red>Q</font> is a 4x4 matrix describing quadric coefficients.
<p>

For example, the volume inside a unit sphere is described by:

<blockquote><table><tr>
<td><big><big><pre>
<font color=blue>x y z 1</font>
<td width=10>
<td><big><big><big>&bull;
<td width=10>
<th><big><big><pre>
<font color=red>1  0  0  0
0  1  0  0
0  0  1  0
0  0  0 -1</font>
<td width=10>
<td><big><big><big>&bull;
<td width=10>
<td><big><big><pre>
<font color=blue>x
y
z
1</font>
<td width=15>
<td><big><big><pre>&le;  0
<td width=15>
</tr></table></blockquote>

which multiplies out to:
&nbsp;
x<sup>2</sup> +
y<sup>2</sup> +
z<sup>2</sup> - 1 &le; 0
<p>

Suppose we have transformed <font color=blue>P</font> by matrix M, so: &nbsp;
<font color=blue>P</font>
&rarr;
<font color=blue>
M &bull; P</font>
<p>
<b>Problem:</b> Find a coefficients matrix that preserves the inequality.
<p>
<b>Hint:</b> Rewrite the transformed transpose <font color=blue>(M &bull; P)<sup>T</sup></font> as: &nbsp;
<font color=blue>P<sup>T</sup> &bull; M<sup>T</sup></font>
<p>
<b>Solution:</b> replace <font color=red>Q</font> by: &nbsp;
<font color=red>M<sup>-1<sup><big>T</big></sup></sup> &bull; Q &bull; M<sup>-1</sup></font>

<blockquote>
<font color=blue>P<sup>T</sup> &bull; M<sup>T</sup></font>
&bull;
<font color=red>M<sup>-1<sup><big>T</big></sup></sup> &bull; Q &bull; M<sup>-1</sup></font>
&bull;
<font color=blue>M &bull; P</font>
&le; 0
&nbsp;
</blockquote>

<b>Proof:</b> The above inequality simplifies to:
&nbsp; <font color=blue>P<sup>T</sup></font> &bull; <font color=red>Q</font> &bull; <font color=blue>P</font> &le; 0

</blockquote>
\`);
setDescription(description);
`,

'ray':`
S.html(\`
<b>Ray tracing to a general second order surface:</b>
<blockquote>

Let's say that matrix Q contains coefficients of a shape bounded by a quadric surface
described by:

<blockquote>
P<sup>T</sup>
&bull;
Q
&bull;
P
= 0
&nbsp; &nbsp; &nbsp; where P is a point in space.
</blockquote>
If we want to shoot a ray to the surface of this shape,
we need to evaluate this equation for points P = V+tW along the ray:

<blockquote>
(V+tW)<sup>T</sup>
&bull;
Q
&bull;
(V+tW)
= 0
</blockquote>

Because the left and right term each have two parts, there are four terms all together when we multiply this out:
<blockquote>
V<sup>T</sup>&bull;Q&bull;V
&nbsp; + &nbsp;
V<sup>T</sup>&bull;Q&bull;tW
&nbsp; + &nbsp;
tW<sup>T</sup>&bull;Q&bull;V
&nbsp; + &nbsp;
tW<sup>T</sup>&bull;Q&bull;tW
&nbsp; = &nbsp; 0
</blockquote>

We rearrange terms to express this as a quadratic equation in t.
Each of the terms shown in color evaluates to a single number:

<blockquote>
<font color=red>
(W<sup>T</sup>&bull;Q&bull;W)
</font>
t<sup>2</sup>

&nbsp; + &nbsp;

<font color=green>
(V<sup>T</sup>&bull;Q&bull;W + W<sup>T</sup>&bull;Q&bull;V)
</font>
t

&nbsp; + &nbsp;

<font color=blue>
(V<sup>T</sup>&bull;Q&bull;V)
</font>

&nbsp; = &nbsp;

0
</blockquote>

We solve this quadratic equation. Either we get two real roots, from which we can get both an entering and exiting point
for where the ray intersects the quadric surface, or we get zero real roots, which indicates
that the ray has missed the surface.


</blockquote>
\`);
setDescription(description);
`,

'shapes':`
S.html(\`
<b>Varieties of unit quadric shapes:</b>
<blockquote>

We have described the coefficients of a unit sphere via a 4x4 matrix.
We can also use a 4x4 matrix to describe the coefficients of other primitive shapes,
such as a unit cylindrical tube, cone, slab, paraboloid or hyperboloid.
Then we can use 4x4 matrix transformations to translate, rotate or
scale those shapes.
<p>
We can also intersect shapes to create
other shapes. For example, to get a cylinder, we transform a cylindrical tube
together with two end halfspaces to serve as end caps.
Here are the defining coefficient matrices of some useful unit quadric shapes:

<table>

<tr>
<td width=200><center><big><br><b>Slab</b><p>z<sup>2</sup> &le; 1<br>&nbsp;
<td width=40>
<td width=200><center><big><br><b>Tube</b><p>x<sup>2</sup>+y<sup>2</sup> &le; 1<br>&nbsp;
<td width=40>
<td width=200><center><big><br><b>Paraboloid</b><p>x<sup>2</sup>+y<sup>2</sup> &le; z<br>&nbsp;

<tr>

<th><big><pre>
 0  0  0  0
 0  0  0  0
 0  0  1  0
 0  0  0 -1
</pre>
<td>
<th><big><pre>
 1  0  0  0
 0  1  0  0
 0  0  0  0
 0  0  0 -1
</pre>
<td>
<th><big><pre>
 1  0  0  0
 0  1  0  0
 0  0  0 -1
 0  0  0  0
</pre>

<tr>
<td>
<small><small><small><p>&nbsp;<p>&nbsp;</small></small></small>

<tr>
<td width=200><center><big><b>Hyperboloid<br>of one sheet</b><p>x<sup>2</sup>+y<sup>2</sup>-z<sup>2</sup> &le; 1<br>&nbsp;
<td width=40>
<td width=200><center><big><br><b>Cone</b><p>x<sup>2</sup>+y<sup>2</sup>-z<sup>2</sup> &le; 0<br>&nbsp;
<td width=40>
<td width=200><center><big><b>Hyperboloid<br>of two sheets</b><p>x<sup>2</sup>+y<sup>2</sup>-z<sup>2</sup> &le; -1<br>&nbsp;

<tr>

<th><big><pre>
1  0  0  0
0  1  0  0
0  0 -1  0
0  0  0 -1
</pre>
<td>
<th><big><pre>
1  0  0  0
0  1  0  0
0  0 -1  0
0  0  0  0
</pre>
<td>
<th><big><pre>
1  0  0  0
0  1  0  0
0  0 -1  0
0  0  0  1
</pre>

</table>


</blockquote>
\`);
setDescription(description + \`
<p>&nbsp;<p>&nbsp;<p>&nbsp;<p>
<p>&nbsp;<p>&nbsp;<p><big>&nbsp;</big><br>
<img src=imgs/hyperboloid.png width=560>\`
);
`,


'normal':`
S.html(\`
<b>Computing the surface normal:</b>

<blockquote>
To compute the surface normal for a quadric surface,
we are going to focus on the second method I discussed
in class, since that will be easier to implement.
We compute the x,y,z partial derivatives
at surface point P = [x,y,z], and then normalize the result, as follows:
<p>
When we multiply out the expression P<sup>T</sup> &bull; Q &bull; P:
<blockquote><table><tr>
<td><big><big><pre>x y z 1
<td width=10>
<td><big><big><big>&bull;
<td width=10>
<td><big><big><pre>
a  b  c  d
e  f  g  h
i  j  k  l
m  n  o  p
</pre>
<td width=10>
<td><big><big><big>&bull;
<td width=10>
<td><big><big><pre>
x
y
z
1
</tr></table></blockquote>
we get:
<blockquote>
<pre>
a x<sup>2</sup> + (b+e) xy + (c+i) xz + (d+m) x +
f y<sup>2</sup> + (g+j) yz + (h+n) y +
k z<sup>2</sup> + (l+o) z +
p
</pre>
</blockquote>
If we take the partial derivatives with respect to x,y,z:
<blockquote>
<pre>
f<sub>x</sub> = 2ax + (b+e)y + (c+i)z + (d+m)
f<sub>y</sub> = (b+e)x + 2fy + (g+j)z + (h+n)
f<sub>z</sub> = (c+i)x + (g+j)y + 2kz + (l+o)
</pre>
</blockquote>
the surface normal is given as N = normalize([
f<sub>x</sub>
f<sub>y</sub>
f<sub>z</sub>
])


<blockquote>
</blockquote>

</blockquote>
\`);
setDescription(description);
`,

};

}

