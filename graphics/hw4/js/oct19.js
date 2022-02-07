
rooms.oct19 = function() {

description = `<b>Notes for Tuesday Oct 19</b>
               <p>
	       Creating and transforming triangle meshes`;

code = {

'triangle':`
S.html(\`
<b>Triangle meshes</b>
<blockquote>
We are now going to switch from ray
tracing to a very different way of creating
and rendering 3D computer graphic shapes:
Approximating a shape by
a mesh that consists of triangles.
<p>
For any given scene, this is generally much faster
than ray tracing, because the GPU in your computer
is a special purpose processor that has
dedicated hardware for the purpose
of rendering triangles.
<p>
Unlike ray tracing,
rendering any shape
that is represented by a triangle mesh
consists of rendering the triangles
that make up that mesh.
Whatever triangle is seen at a pixel
is the one that is rendered,
as shown on the left side of the figure.
<p>
If two triangle meshes are in the scene
and some of their triangles happen to fall
on the same pixel of the image,
the GPU will render the triangle at that pixel
which is nearest to the viewer,
and therefore the mesh which is
nearest to the viewer,
as shown in the right side of the fiture.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/oct21_1.jpg width=560>');
`,

'parametric':`
S.html(\`
<b>Parametric surfaces</b>
<blockquote>
Mathematically speaking,
we can define many interesting shapes
as <i>parametric surfaces</i>.
These are surfaces that
can be described mathematically by
stretching and curving a square shaped rubber sheet.
<p>
Formally we say that each point [x,y,z] on the
mesh surface is a function of the two parameters (u,v),
where u varies from 0.0 to 1.0 from the left edge to the
right edge of the rubber sheet,
and
v varies from 0.0 to 1.0 from the bottom edge to the
top edge of the rubber sheet.
<p>
We can use as an example the unit sphere
(the sphere centered at the origin, with radius 1.0).
First we map the u and v of our rubber sheet
to longitude and latitude angles:
<blockquote><pre>
&theta; = 2 &pi; u
&phi; = &pi; v - &pi; / 2
</pre></blockquote>
Then we use those angles to define
a point [x,y,z] on the surface of the sphere:
<blockquote><pre>
x = cos &theta;  cos &phi;
y = sin &theta;  cos &phi;
z = sin &phi;
</pre></blockquote>
The upper image shows the mapping of the rubber sheet to the sphere.
The lower image shows the difference between a coarse mesh
and a fine mesh.
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/uv_to_sphere.png width=420><p><img src=imgs/spheres.png width=420>');
`,

'mesh':`
S.html(\`
<b>Approximating a parametric surface via a triangle mesh</b>
<blockquote>
We can approximate a parametric surface
via a special kind of triangle mesh -- a triangle strip.
<p>
We already know that
triangle strips are a very efficient way of
describing a collection of triangles, and that
we can create a triangle strip
as a zigzag pattern of vertices:
<blockquote><pre>
1-3-5-7-
|&bsol;|&bsol;|&bsol;| ...
0-2-4-6-
</pre></blockquote>
<p>
The trick is to represent each row of
the parametric surface by a triangle strip,
and glue all those rows together to
create a single triangle strip
that represents
the entire parametric mesh surface:
<blockquote><pre>
row n-1: =====================
                 ...
row 2  : =====================
                  +
row 1  : =====================
                  +
row 0  : =====================
</pre></blockquote>
In the next section we describe how to
glue together two triangle strips.
Once we can do that, then we can repeatedly apply
the glueing operation to glue together all the rows
of a parametrically defined surface into a single
triangle strip.
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/glue_strips.jpg width=560>');
`,

'glue':`
S.html(\`
<b>Glueing together two meshes</b>
<blockquote>
The trick in glueing together two
triangle strips
<big><code>a</code></big>
and
<big><code>b</code></big>
is to duplicate the last vertex of
<big><code>a</code>,</big>
and the first vertex of
<big><code>b.</code></big>
<p>
This creates degenerate triangles
(triangles where at least two vertices are the same).
Degenerate triangles don't get displayed,
because they have zero area.
<p>
So given triangle strip <big><code>a</code> </big>with <big><code>m</code> </big>vertices:
<blockquote><pre>
a<sub>0</sub>  a<sub>1</sub>  ...  a<sub>m-1</sub>
</pre></blockquote>
and triangle strip <big><code>b</code> </big>with <big><code>n</code></big> vertices:
<blockquote><pre>
b<sub>0</sub>  b<sub>1</sub>  ...  b<sub>n-1</sub>
</pre></blockquote>
we can glue them into a single triangle strip as follows:
<blockquote><pre>
a<sub>0</sub>  a<sub>1</sub>  ...  a<sub>m-1</sub>  a<sub>m-1</sub>  b<sub>0</sub>  b<sub>0</sub>  b<sub>1</sub>  ...  b<sub>n-1</sub>
</pre></blockquote>
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/glue.png width=560>');
`,

'vertex':`
S.html(\`
<b>Adding surface normals to vertices</b>
<blockquote>
Instead of just an [x,y,z] position,
we want each vertex in a mesh to also
contain a surface normal and the parametric (u,v) value
of that vertex.
<p>
So instead of a vertex being represented as
three numbers [x,y,z],
it is represented by eight numbers
[x,y,z, n<sub>x</sub>,n<sub>y</sub>,n<sub>z</sub>, u,v].
<p>
For example, given that the surface normal at any point
[x,y,z] of a unit sphere is just [x,y,z],
we can describe each vertex of a parametric unit sphere as:
<blockquote><pre>
[ x, y, z,  x, y, z,  u, v ]
</pre></blockquote>
where:
<blockquote><pre>
x = cos &theta;  cos &phi;
y = sin &theta;  cos &phi;
z = sin &phi;
</pre></blockquote>
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/vertex.jpg width=560>');
`,

'tube+disk':`
S.html(\`
<b>Tubes and disks</b>
<blockquote>
We can define an open tube or a circular disk
by distorting a rubber sheet.
<p>
A unit tube (unit radius in x,y, going from -1.0 to +1.0 in z)
can be defined as:
<blockquote><pre>
x = cos &theta;
y = sin &theta;
z = 2 v - 1
</pre></blockquote>
and a unit disk (unit radius in x,y, z = 0.0)
can be defined as:
<blockquote><pre>
x = v cos &theta;
y = v sin &theta;
</pre></blockquote>
where:
<blockquote><pre>
&theta; = 2 &pi; u
</pre></blockquote>

We can glue together an open tube and two
disks to create a cylinder.
By varying the number of steps in u,
we can create meshes that approximate
a cylinder either coarsely
(computationally cheap but not as good)
or very well
(computationally more expensive but looks better).
<p>
To do this properly,
we need to know how to transform the
component meshes.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/cylinders.png width=560>');
`,

'torus':`
S.html(\`
<b>Torus</b>
<blockquote>
Before moving on, let's give one more
example of a parametric surface: a unit torus
(a torus centered at the orign with 1.0 as the radius of the annular ring).
Suppose r is the radius of the tube. Then:
<blockquote><pre>
x = cos &theta; (1 + r cos &phi;)
y = sin &theta; (1 + r cos &phi;)
z = r sin &phi;
</pre></blockquote>
where:
<blockquote><pre>
&theta; = 2 &pi; u
&phi; = 2 &pi; v
</pre></blockquote>
We can also define each surface normal as:
<blockquote><pre>
n<sub>x</sub> = cos &theta;  cos &phi;
n<sub>y</sub> = sin &theta;  cos &phi;
n<sub>z</sub> = sin &phi;
</pre></blockquote>
The full vertex description is then given by eight values:
<blockquote><pre>
[ x y z  n<sub>x</sub> n<sub>y</sub> n<sub>z</sub>  u v ]
</pre></blockquote>

The upper figure shows a parametrically defined torus.
The lower figure shows a variety of fully shaded shapes
that were created either as parametric surfaces,
or by glueing together parametric surfaces.
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/parametric_torus.png width=308><p><img src=imgs/four_shapes.png width=308>');
`,

'transform':`
S.html(\`
<b>Transforming meshes</b>
<blockquote>
We would like to be able to generate just
a few unit shapes, and then use matrices to
transform those unit shapes to get lots more shapes.
For example, we'd like to be able to start with a unit sphere,
and transform that to get all ellipsoids.
<p>
Similarly, we'd like to be able to create a unit cylinder,
and transform that to get long skinny tubes, pill boxes, etc.
<p>
When we transform a mesh by a matrix M,
we need to use the forward matrix M to transform
each of its vertices,
and the inverse transpose of M to transform its
surface normals:
<blockquote><pre>
P &larr; M &bull; P
N &larr; N &bull; M<sup>-1</sup>
</pre></blockquote>
Implementing this in code looks something like this:
<blockquote><pre>
P = matrixTransform(M,
      [P[0],P[1],P[2],1]).slice(0, 3);

N = matrixTransform(
      matrixTranspose(
         matrixInverse(M)),
            [N[0],N[1],N[2],0]).slice(0, 3);
</pre><blockquote>
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/transform.jpg width=560>');
`,

'cube':`
S.html(\`
<b>Cube</b>
<blockquote>
Once you can glue and transform meshes,
creating composite shapes becomes straightforward.
<p>
For example, to form a cube, we glue together six square meshes.
Each face of the cube can be described parametrically
by defining each vertex as:
<blockquote><pre>
   [ 2u-1 2v-1 0   0 0 1   u v ]
</pre></blockquote>
Then for each square face we can:
<ol>
<li> translate by [0,0,1]
<p>
<li> rotate into one of the
six face orientations of the cube
</ol>
Then we apply our glue operation to
turn those six triangle meshes into
a single triangle mesh.
</blockquote>
\`);
setDescription(description + '<p><img src=imgs/cube.png width=560>');
`,


'extrude':`
S.html(\`
<b>Extrusions and surfaces of revolution</b>
<blockquote>
We can define an extruded surface as a special
case of a parametric surface.
In this case, u travels along a closed path in the x,y plane that forms a profile,
and v travels along a path in space.
We form the surface by dragging the profile along the path.
The surface consists
all the points in space swept by this operation.
<p>
Similarly we can define a surface of revolution
as a special case of a parametric surface.
The u parameter rotates about the z axis.
Meanwhile, the v parameter travels along a profile
shape in the x,y plane.
We rotate the profile around the z axis.
The surface consists of all the points in space swept by this operation.
<p>
A surface of revolution can be thought of as
a shapes that can be formed in a machine shop by using a lathe.

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/extrusion.jpg width=560>');
`,

'normal':`
S.html(\`
<b>General way to compute triangle mesh surface normals:</b>
<blockquote>
We can compute an approximate surface normal for any vertex
of a mesh surface by the following two step algorithm:
<ol>
<li>
For each triangle: Compute a "face normal" for that triangle.
<p>
<li>
For each vertex:
Sum the face normals for all triangles adjoining that vertex. Then normalize.
</ol>
To compute the face normal of a triangle, consider the locations
A, B and C of its three vertices.
Then proceed as follows:

<ol>
<li>
Compute the three edge vectors of the triangle:
<blockquote><pre>
AB = B - A
BC = C - B
CA = A - C
</pre></blockquote>
<li>
Sum the cross products of each pair of edges:
<blockquote><pre>
facenormal  =  AB &#x2A2F; BC  +  BC &#x2A2F; CA  +  CA &#x2A2F; AB
</pre></blockquote>
where cross product of two vectors
[ a<sub>x</sub> a<sub>y</sub> a<sub>z</sub> ]
and
[ b<sub>x</sub> b<sub>y</sub> b<sub>z</sub> ]
is the vector:
<blockquote><pre>
[ a<sub>y</sub>b<sub>z</sub> - a<sub>z</sub>b<sub>y</sub> , a<sub>z</sub>b<sub>x</sub> - a<sub>x</sub>b<sub>z</sub> , a<sub>x</sub>b<sub>y</sub> - a<sub>y</sub>b<sub>x</sub> ]
</pre></blockquote>
</ol>

</blockquote>
\`);
setDescription(description + '<p><img src=imgs/computing_normals.jpg width=560>');
`,

};

}
