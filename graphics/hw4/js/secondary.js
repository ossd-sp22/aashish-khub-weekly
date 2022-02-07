
rooms.secondary = function() {

description = `<b>Notes for Tuesday September 21</b>
               <p>
	       Ray tracing: Secondary rays`;

code = {

'shadows':`

S.html(\`

<b>Shadows</b>
<blockquote>
To see whether a surface point is in shadow
from any given light source,
we trace a <i>shadow ray</i> from that surface point
to that light source.
If the ray hits any other object,
then the object is in shadow at
that surface point.
<p>
To do this, we need to form a shadow ray:
<blockquote>
P + t * Ld<sub>i</sub>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
for t &gt; 0
</blockquote>
<p>
The origin of the shadow ray is the surface point P,
which we had originally computed as P = V + tW.
<p>
The direction of the shadow ray is Ld<sub>i</sub>,
which is the direction toward light source i.
<p>
If we are doing Phong shading, and
we find that an object is in shadow
at a surface point,
then we do not
add in the Diffuse and Specular components
of the surface shading
contributed by that light source.
</blockquote>
\`);
setDescription(description + \`
   <p>
   <table><tr>
   <td><img src=imgs/shadow1.png width=200>
   <td width=20>
   <td width=300><big><big><big>
       <b>Not in shadow:</b>
       <p>
       Ray from surface to light source
       doesn't hit any other objects.
   </tr></table>
   <p>
   <table><tr>
   <td><img src=imgs/shadow2.png width=200>
   <td width=20>
   <td width=300><big><big><big>
       <b>In shadow:</b>
       <p>
       Ray from surface to light source
       hits at least one object.
   </tr></table>

\`);
`,

'reflection':`

S.html(\`

<b>Reflections</b>
<blockquote>
To do a mirror reflection, we need to ask the question:
What would we see if we were to bounce the ray off
the surface as though the surface were a mirror?
<p>
To answer this question, we
form a <i>reflection ray</i>.
The origin of the reflection ray is the surface point P.
<p>
To compute the direction of the reflection ray,
we use the surface normal N to compute the mirror reflection
of the incoming ray,
using a method similar to the way
we computed the reflection of a light direction,
except in this case we replace Ld<sub>i</sub> by -W:
<blockquote>
   W' = 2 * N * (N &bull; -W) + W
</blockquote>
In practice,
we need to render the object
encountered by the reflected ray,
and then mix the color of that object 
into the final color at this pixel.
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/reflection.jpg width=550>');
`,

'refraction 1':`

S.html(\`

<b>Refraction, part 1</b>
<blockquote>
Refraction occurs when light encounters
a transparent object. The light ray
goes into the object, but also changes direction,
according to <i>Snell's Law</i>:
<blockquote>
<i>n</i><sub>1</sub> sin &theta;<sub>1</sub> =
<i>n</i><sub>2</sub> sin &theta;<sub>2</sub>
</blockquote>
where <i>n</i><sub>1</sub>
and <i>n</i><sub>2</sub>
are the indices of refraction of the two materials,
&theta;<sub>1</sub>
is how much the incoming angle deviates from perpendicular to the surface
and
&theta;<sub>2</sub>
is how much the outgoing angle deviates from perpendicular to the surface.
<p>
The index of refraction of a
transparent material describes how much light slows
down when it enters that material.
The larger the index of refraction, the slower
the velocity of the light, and therefore the more the ray will bend.
<p>
The index of refraction of empty space is 1.0.
The index of refraction of
water is about 1.3,
of glass is about 1.5,
and of diamond is about 2.4.

</blockquote>
\`);
setDescription(description + \`
   <p>
   <table><tr>
   <td><img src=imgs/snell.jpg width=250>
   <td width=20>
   <td width=300><big><big><big>
       <b>Snell's Law:</b>
       <p>
       The change in light direction is related
       to the change in index of refraction.
   </tr></table>
   <p>

\`);
`,

'refraction 2':`

S.html(\`

<b>Refraction, part 2</b>
<blockquote>
When ray tracing to a transparent sphere
that will refract the ray,
we need to look at not just the first root of the
surface intersection, where the ray enters the sphere,
but also the second root,
where the ray exits the sphere.
<p>
Note: This is the first time that we are
looking at <i>both</i> of the two roots of a quadratic equation.
<p>
The ray will change direction both when it enters and
when it exits the object.
The situation is in some ways similar to
that of reflection, in that we are trying to figure out
what object, if any, the ray ultimately encounters.
<p>
In general we need to think about three rays:
The first is the ray tracing light backwards
from the eye to the front surface
of the transparent object.
The second ray traces light backwards inside the object.
The third ray traces light backwards to whatever object
can be seen by looking into the transparent object.
<p>
In practice,
we need to render the object
encountered by this third ray,
and mix the color of that object 
into the final color at this pixel.
This is similar to what we do for
reflected rays.
</blockquote>
\`);
setDescription(description + \`
   <p>
   <img src=imgs/refraction.png width=550>
   <p>
   <small><small>We trace light backwards first from the eye,
   then in the object, then to whatever object
   (if any) we encounter.</small></small>

\`);
`,

};

}

