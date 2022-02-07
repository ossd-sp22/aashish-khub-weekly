
rooms.history = function() {

description = `<b>Notes for Tuesday September 14</b>
               <p>
	       History of Ray tracing`;

code = {

'ray tracing':`
S.html(\`
<b>Topics:</b>
<blockquote>
&bull; History of ray tracing
<p>
&bull; Creating a ray
<p>
&bull; Ray tracing to a sphere
<p>
&bull; Shading and lighting
<p>
&bull; Shadows, reflections, refraction
</blockquote>
\`);
setDescription(description);
`,

'early':`
S.html(\`
<b>Early history of ray tracing:</b>
<p>

The concept of ray tracing goes all the way back to
the 16th Century, when the artist Albrecht Durer,
as illustrated in the woodcut on the upper right.
He used physical threads to help artists compute lines
of sight through a canvas onto a physical scene to be painted.
<p>

Ray tracing on a computer was first implemented by Arthur Appel at IBM in 1968,
in his paper
<a href=http://graphics.stanford.edu/courses/Appel.pdf>
Some techniques for shaded machine renderings of solids</a>.
He used it to compute shadows in renderings of 3D objects.

<p>
Soon after, a working ray tracing system for rendering 3D shaded objects was described
by Goldstein and Nagel at MAGI in 1971,
published in their paper
<a href=https://journals.sagepub.com/doi/abs/10.1177/003754977101600104?journalCode=simb>
3-D Visual Simulation</a>.
<p>
In 1980, Turner Whitted 
described a ray tracing system with reflection, refraction and shadows,
in his landmark paper
<a href=https://www.cs.drexel.edu/~david/Classes/Papers/p343-whitted.pdf>
An Improved Illumination Model for Shaded Display</a>.
The iconic image he created
to illustrate his techniques
is shown on the lower right.
<p>
Interestingly, there are visible artifacts in this image
from the fact that it was recorded on film --
which was how people recorded computer graphics
images back in 1980.
\`);
setDescription(description + '<p><img src=imgs/durer.jpg width=475><p><img src=imgs/whitted.png width=475>');
`,

'examples':`
S.html(\`
<b>Ray tracing capabilities:</b>
<p>

Ray tracing is capable of following the path of light backwards
from the camera into a scene, then bounce off objects and
follow reflections, refractions and other complex interactions
between the camera lens, materials and light.
<p>
Below and to the right are two examples of ray traced scenes
that show some of these capabilities.
<p><center><img src=imgs/glassware.png width=700></center>
\`);
setDescription(description + '<p><font size=4>&nbsp;<p>&nbsp;<p></font><img src=imgs/spheres.png width=550>');
`,

'industry':`
S.html(\`
<b>Use of ray tracing in industry:</b>
<p>

As computers became faster, ray tracing
began to be adopted by industry.
In 2001 the production company
<i>Blue Sky Studios</i>,
an offshoot of MAGI Synthavision,
produced the animated feature film
<i>Ice Age</i>, shown on the upper right,
using ray tracing to render the movie
and all of its characters.
<p>
<table><tr>
<td><center><img src=imgs/cars.jpg width=600></center>
<td width=10>
<td valign=top>
<big><big>
The technique was gradually adopted by
other movie studios, incluing Pixar,
which used ray tracing for various
effects in its animated film <i>Cars</i>,
as shown in the image to the left.
</big></big>
</tr></table>
<p>
Eventually, as Moore's Law has progressed,
real time techniques
have been developed.
This real time capability has allowed ray tracing
to be used in computer games.
<p>
Now NVIDIA
offers real-time ray tracing
on its latest RTX graphics hardware.
As seen in the lower image to the right,
ray tracing can support
depth of field,
soft shadows, reflections, and
subtle lighting effects.
\`);
setDescription(description + '<p><img src=imgs/ice_age.jpg width=550><p><img src=imgs/ray_traced.jpg width=550>');
`,

};

}

