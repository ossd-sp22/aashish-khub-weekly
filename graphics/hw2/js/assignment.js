
rooms.assignment = function() {

description = `<b>Assignment 2, due
               <br>
               Tuesday October 5</b>
               <p>
	       Ray tracing with Phong shading and reflection.`;

code = {

'assignment':`
S.html(\`
<p>&nbsp;
<b>Homework for Tuesday October 5:</b>
<blockquote>
I am not yet going to ask you to implement the
material that I covered on Thursday Sep 23.
You will be covering those topics in a later assignment.
<p>

For now, you will be ray tracing just to spheres.
I have modified the ray tracer to make this assignment
easier for you.
To see the new version, look at pull-down choice: <small>Ray tracer, version 2</small>
<p>

To get you started with matrices, I use 4x4 matrices
(<b>mat4</b> in the shader language)
to store Phong material properties
(Ambient, Diffuse, Specular).
For now I am really just using the matrix 
to store values.
But soon we will be using it to transform objects.

<p>

I have made a simple scene for you that contains
four spheres.
For Tuesday, October 5, your assignment has
several parts:
<ul>
<li>Part 1:
Add the specular component of Phong shading.
I have already gotten things started for you.
You just have to add the actual math into the code.
<p>

<li>Part 2:
Implement reflection, using the algorithm described in the <small>reflection</small> tab
of pull-down choice: <small>secondary rays</small>
<p>

<li>Extra credit: See if you can make a more
interesting scene. Create a cool animation.
Arrange and/or move spheres in a way that
is fun or artistic or scientific or
otherwise meaningful.

</ul>

<p>

I suggest that you modify
file <code>js/raytrace2.js</code>,
and post your work to:
<code>&lt;YOUR_HOME_DIRECTORY&gt;/graphics/hw2</code>

</blockquote>
\`);
`

}

}


