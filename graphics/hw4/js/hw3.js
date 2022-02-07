
rooms.hw3 = function() {

description = `<b>Homework due Tuesday Oct 19</b>
               <blockquote>
	       <b>Notes for Oct 5-7</b>
	       <br> &nbsp; &nbsp; &nbsp; contains the course notes.
	       <p>
	       <b>Raytracer, version 4</b>
	       <br> &nbsp; &nbsp; &nbsp; contains the starter code.
               </blockquote>`;

code = {

'homework 3':`
S.html(\`
<b>Homework 3, due before class October 19:</b>
<blockquote>

Your homework for Tuesday, October 19, due before the start of class,
is to implement (1) refraction and (2) ray tracing to quadric surfaces,
using matrices to transform and animate those surfaces.
<p>

As you will see in tab <b>Raytracer, version 4</b>
(which is in file <code>js/raytrace4.js</code>),
I have already done lots of the work for you.
What is left for you to do is:

<ol>

<li>
Implement the core
algorithm for refraction, following the steps
I have given you in the code
and in the course notes.

<p>

<li>
Implement the core algorithm for a ray
intersecting two quadric surfaces,
finding and shading the shape where those
surfaces intersect.
I already did much of the work for you.
I have pre-defined an animating cylinder in the
Javascript code (which you can see in the
"render" tab of the ray tracer).

</ol>

In each case, you just need to implement the core algorithm
in the fragment shader, following the
steps I have given you in the code
and in the course notes.
<p>

I strongly encourage you to be bold and creative,
to build your own original scene.
Try to make different sorts of quadric shapes,
and interesting animations.
See if you can create fantastical creatures or other
cool things.
Surprise and delight me.
You will get signifant extra credit for
going above and beyond.

</blockquote>
\`);
setDescription(description);
`,

};

}

