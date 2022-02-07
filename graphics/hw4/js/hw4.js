
rooms.hw4 = function() {

description = `<b>Homework due Tuesday Nov 2</b>
               <blockquote>
	       <p>
	       Look at these drop-down choices:
	       <p>
	       <small>
	       <blockquote>
	       <b>3D Scene, version 2</b>
	       <br> &nbsp; &nbsp; &nbsp; contains some starter code.
	       <p>
	       <b>Notes for Oct 19</b>
	       <br> &nbsp; &nbsp; &nbsp; contains the course notes.
               </blockquote>
	       </small>
               </blockquote>
	       `;

code = {

'homework 4':`
S.html(\`
<b>Homework 4, due before class November 2:</b>
<blockquote>

You can start from the code in tab <b>3D Scene, version 2</b>
(in file <code>js/scene2.js</code>).
For your convenience,
I have implemented a <code>draw()</code> function,
which takes two arguments: a shape and a color.
What is left for you to do is:

<ol>

<li>
Create an interesting hierarchical scene
that makes good use of
<code>m.save()</code> and <code>m.restore()</code>.

<p>

<li>
In the <code>description</code> section of
<code>js/scene2.js</code>,
describe in words what you are
going for in what you are creating.
Is it a story, a character, a work of art?
What was your inspiration?

<p>

<li>
Extra credit: Here are some ideas (but please be creative):
<p>
<ul>
<li> Create your own kind of meshes
(for example, see if you can figure out how to implement
a surface of revolution).
<p>
<li>Implement the general method for computing normals.
<p>
<li> Add Phong shading
with multiple light sources and specular highlights
into your fragment shader.
</ul>

</ol>

The goal for this assignment is for you to
build your own original scene.
Try to make an interesting hierarchy of objects,
an animated mechanism of some sort.
See if you can create something like a creature, or a machine,
something that comes to life.
As usual, you will get signifant extra credit for
going above and beyond.

</blockquote>
\`);
setDescription(description);
`,

};

}

