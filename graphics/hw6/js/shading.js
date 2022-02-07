
rooms.shading = function() {

description = `<b>Notes for Tuesday September 14</b>
               <p>
	       Shading for ray tracing`;

code = {

'normals':`
S.html(\`
<b>Shading and lighting:</b>

<blockquote>
	Given the surface point, we can do shading and lighting.
<blockquote>
        	&bull; We need to know what direction the surface faces.
        	<br>
        	&bull; That direction vector is called the "surface normal".
        	<br>
        	&bull; In math, the "normal" vector is perpendicular to a surface.
</blockquote>

Fortunately, it is easy to find the surface normal for a point S on a sphere that is centered a point C.

</blockquote>

<p>

The surface normal is just:

<blockquote>

        N = normalize(S - C)
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/normal.jpg width=550>');
`,

'gouraud':`
S.html(\`

<b>Gouraud shading:</b>

<blockquote>
	A simple version of shading for a perfectly diffuse surface.
	<br>
	It was first introduced by Henri Gouraud in 1971.
	<p>
	Gouraud shading has two components:
	<blockquote>

        	&bull; Base ambient color: responds to light from all directions
        	<br>
        	&bull; Diffuse color: responds to light from a particular direction
	</blockquote>

	Assume:
	<blockquote>
        	The ambient color is A,
        	<br>
        	The diffuse color is D,
        	<br>
        	For each light L<sub>i</sub>: Direction vector is: L<sub>i</sub>dir
		&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
		&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
		&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
		&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
           	Color     vector is: L<sub>i</sub>col
       	</blockquote>

	Light only illuminates a surface up to a 90 degree angle.
	<br>
	We need the max(0, ...) function to cut off at 90 degrees.
	<p>

	For each light L<sub>i</sub>

	<blockquote>
        	A + <big>&Sigma;</big> L<sub>i</sub>col * D * max(0, N &bull; L<sub>i</sub>dir)
	</blockquote>

</blockquote>

\`);
setDescription(description + '<p><img src=imgs/gouraud_sphere.jpg width=550>');
`,

'phong':`
S.html(\`

<b>Phong shading:</b>

<blockquote>
        A major advancement over Gouraud shading was Phong shading,
        introduced by Bui Tuong Phong in 1973.
        The key advance was to add specular highlights.
        It's not a physically accurate model, but it is so convenient and practical that it is still used today.

	<blockquote>
                A + <big>&Sigma;</big> L<sub>i</sub>col *
		    <big>(</big>D * max(0, N &bull; L<sub>i</sub>dir) +
                                 S * max(0, R<sub>i</sub> &bull; -W)<sup>p</sup><big>)</big>
	</blockquote>

	where:
	<blockquote>
        	R<sub>i</sub> = reflection direction from lightsource L<sub>i</sub>
        	<br>
        	S = specular highlight color
        	<br>
        	p = specular highlight power (higher is shinier).
	</blockquote>

	We can compute R<sub>i</sub> by: R<sub>i</sub> = 2 * N * (N &bull; L<sub>i</sub>dir) - L<sub>i</sub>dir
	<p>
	Then we look at the angle between the reflected light R and the direction back to the camera,
	which in our case is -W. The more closely those vectors are aligned, the brighter the
	highlight will appear.
	<p>

	We attenuate with angle by taking the cosine of this angle, and max that with 0 
	(so that we don't accidentally count surfaces that are slanted away from the light source).
	We then raise to power p to vary shininess, with higher values of p producing shinier highlights.
\`);
setDescription(description + '<p><img src=imgs/gouraud_sphere.jpg width=550>');
`,

'materials':`
S.html(\`

<b>Using Phong shading to simulate different materials:</b>
<p>
<blockquote>
	Using Phong shading, we can distinguish between metal or plastic by our choice of specular color S.
	<p>
	For metals, all light bounces off the surface and ends up tinted by the color of the metal
	(eg: yellow for gold, brownish for copper).
	<p>
	For plastics, some light bounces off the clear acrylic outer surface, and retains its original color.
	Other light penetrates into the acrylic and bounces between the colored dye particles,
	so only light of that color emerges, traveling into diffuse lambertian directions.
	<p>
	This means we can indicate material with Phong shading as follows:
	<blockquote>
	&bull; If S is the same color as D, then the material will be perceived as metal.
	For example, actual metallic gold has yellow highlights.
	<p>
	&bull; On the other hand, if S is white then the material will be perceived as plastic. For example,
	a yellow plastic toy has white highlights.
	</blockquote>
</blockquote>


\`);
setDescription(description + '<p><img src=imgs/materials.jpg width=550>');
`,

};

}

