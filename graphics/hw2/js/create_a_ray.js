
rooms.create_a_ray = function() {

description = `<b>Notes for Tuesday September 14</b>
               <p>
	       Creating a ray`;

code = {

'intro':`
S.html(\`
To make things easier to follow:
<blockquote>

        &bull; We will use capital letters for vector variables.
        <br>
        &bull; We will use lowercase for variables that are just one number.
	<p>
	For example:
	&nbsp; V is a 3D vector variable
	<br>
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
	&nbsp; &nbsp; &nbsp;
	x is a number variable
</blockquote>

The basic idea of ray tracing:

<blockquote>
        &bull; 3D coordinate system: [x,y,z] with right hand rule
        <br>
        &bull; Imagine the canvas image floating in 3D space
        <br>
        &bull; Choose a point where rays converge, like in a pinhole camera
        <br>
        &bull; Trace light rays backwards from pinhole &rarr; canvas &rarr; world
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/forming_a_ray_1.jpg width=550>');
`,

'create ray':`
S.html(\`
<b>Creating a ray:</b>

<blockquote>
        V = [v<sub>x</sub>, v<sub>y</sub>, v<sub>z</sub>, 1]   &nbsp;&nbsp; &nbsp; // ray origin point
        <br>
        W = [w<sub>x</sub>, w<sub>y</sub>, w<sub>z</sub>, 0]   &nbsp; // ray direction -- always unit length

        <p>
        Assume the canvas image goes from -1 to +1 in both x and y
        <br>
        Place the canvas at the origin, aligned with the x,y plane
        <br>
        Place the camera pinhole at [0,0,fl]
        <p>

        Points on the ray through pixel x,y are all points of the form:

        <blockquote>
                V + t * W
        </blockquote>

        where:

        <blockquote>
                V = [0,0,fl,1]
                <br>
                W = normalize([x,y,-fl,0])
                <br>
                t > 0
        </blockquote>

	The field of view depends on the value of focal length fl:

        <blockquote>
	&bull; A larger focal length fl gives a more telephoto view.
	<br>
	&bull; A smaller focal length fl gives a more wide angle view.
        </blockquote>
	
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/forming_a_ray.png width=550>');
`,

'normalize':`
S.html(\`
<b>To normalize a vector (scale it to unit length):</b>

<blockquote>
        The dot product A&bull;B between two vectors A and B is:

<blockquote>
                |A| * |B| * cos(angle between A and B)
<p>
                <i><b>Note:</b></i> The notation |V| indicates the length of vector V.
</blockquote>

        The dot product can be computed as:

<blockquote>
                A<sub>x</sub> * B<sub>x</sub> + A<sub>y</sub> * B<sub>y</sub> + A<sub>z</sub> * B<sub>z</sub>
</blockquote>

        This provides a way to compute the length of a vector, since:

<blockquote>
                the dot product of a vector with itself gives length squared.
</blockquote>

        So to normalize a vector V, divide by &radic;<span style="text-decoration:overline">V&bull;V</span>

<blockquote>
                normalize(V) = [x,y,z] / &radic;<span style="text-decoration:overline">x*x + y*y + z*z</span>
</blockquote>
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/normalize.jpg width=550>');
`,

};

}

