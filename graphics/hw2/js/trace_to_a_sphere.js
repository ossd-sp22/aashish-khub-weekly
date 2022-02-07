
rooms.trace_to_a_sphere = function() {

description = `<b>Notes for Tuesday September 14</b>
               <p>
	       Ray tracing to a sphere`;

code = {

'trace to a sphere':`
S.html(\`
<b>Suppose we want to trace a ray to a sphere:</b>

<blockquote>
        We represent the sphere as a center point C and a radius r.
        <br>
        That's four numbers:

<blockquote>
                [c<sub>x</sub>,c<sub>y</sub>,c<sub>z</sub>,r]
</blockquote>

        The points on the surface of the sphere are all distance r from its center.
        <br>
        So any point on the surface of a sphere can be described by:

<blockquote>
                (x - c<sub>x</sub>)<sup>2</sup> + (y - c<sub>y</sub>)<sup>2</sup> + (z - c<sub>z</sub>)<sup>2</sup> = r<sup>2</sup>
</blockquote>
        or, equivalently:
<blockquote>
                (x - c<sub>x</sub>)<sup>2</sup> + (y - c<sub>y</sub>)<sup>2</sup> + (z - c<sub>z</sub>)<sup>2</sup> - r<sup>2</sup> = 0
</blockquote>

        Our goal is to find a point on both the ray and the sphere surface.
        <p>

        To find this intersection point:
	<blockquote>
	&bull; Substitute the ray equation into the sphere equation.
        <br>
        &bull; This replaces the equation in x,y,z by an equation in t.
	</blockquote>

</blockquote>

\`);
setDescription(description + '<p><img src=imgs/ray_hits_sphere.png width=550>');
`,

'change coords':`
S.html(\`
<b>First let's make things easier by changing coordinate systems:</b>
<blockquote>

        Translate everything by -C, so the sphere center moves to [0,0,0].
        <br>
        In this new coordinate system, the ray origin has a new location:

        <blockquote>
                <font color=red>V</font> = V - [c<sub>x</sub>,c<sub>y</sub>,c<sub>z</sub>]
        </blockquote>

        Find t along <font color=red>V</font> + t*W such that:

        <blockquote>
                x*x + y*y + z*z - r*r = 0
        </blockquote>

        Substituting [ <font color=red>V<sub>x</sub></font> + t*W<sub>x</sub> , <font color=red>V<sub>y</sub></font> + t*W<sub>y</sub> , <font color=red>V<sub>z</sub></font> + t*W<sub>z</sub> ] for [x,y,z]:

        <blockquote>
                (<font color=red>V<sub>x</sub></font> + t*W<sub>x</sub>) * (<font color=red>V<sub>x</sub></font> + t*W<sub>x</sub>) +
                <br>
                (<font color=red>V<sub>y</sub></font> + t*W<sub>y</sub>) * (<font color=red>V<sub>y</sub></font> + t*W<sub>y</sub>) +
                <br>
                (<font color=red>V<sub>z</sub></font> + t*W<sub>z</sub>) * (<font color=red>V<sub>z</sub></font> + t*Wz) - r*r = 0
        </blockquote>
</blockquote>

\`);
setDescription(description);
`,

'rearrange terms':`
S.html(\`

<b>We can simplify this equation by rearranging terms:</b>
<blockquote>

	Starting with what we had before:

	        <blockquote>
                (<font color=red>V<sub>x</sub></font> + t*W<sub>x</sub>) * (<font color=red>V<sub>x</sub></font> + t*W<sub>x</sub>) +
                <br>
                (<font color=red>V<sub>y</sub></font> + t*W<sub>y</sub>) * (<font color=red>V<sub>y</sub></font> + t*W<sub>y</sub>) +
                <br>
                (<font color=red>V<sub>z</sub></font> + t*W<sub>z</sub>) * (<font color=red>V<sub>z</sub></font> + t*Wz) - r*r = 0
        </blockquote>


        Rearrange terms to get a quadratic equation <b>at<sup>2</sup> + bt + c = 0</b>
        <blockquote>

                &nbsp;&nbsp; &nbsp; (W<sub>x</sub> * W<sub>x</sub> +
                W<sub>y</sub> * W<sub>y</sub> + W<sub>z</sub> * Wz) * t * t +
                <br>
                2 * (<font color=red>V<sub>x</sub></font> * W<sub>x</sub> +
                <font color=red>V<sub>y</sub></font> * W<sub>y</sub> +
                <font color=red>V<sub>z</sub></font> * W<sub>z</sub>) &nbsp; &nbsp; &nbsp; &nbsp;* t +
                <br>
                &nbsp;&nbsp; &nbsp; (<font color=red>V<sub>x</sub></font> *
                <font color=red>V<sub>x</sub></font> + <font color=red>V<sub>y</sub></font> *
                <font color=red>V<sub>y</sub></font> + <font color=red>V<sub>z</sub></font> *
                <font color=red>V<sub>z</sub></font> - r*r) &nbsp; = 0
        </blockquote>

        We can further simplify this by using the definition of dot product:

        <blockquote>
                (W&bull;W) * t*t + 2 (<font color=red>V</font>&bull;W) * t +
                (<font color=red>V</font>&bull;<font color=red>V</font> - r*r) = 0
        </blockquote>

        W is unit length, so W&bull;W == 1, and the equation simplifies to:

        <blockquote>
                t*t &nbsp; + &nbsp; 2 (<font color=red>V</font>&bull;W) * t &nbsp; + &nbsp;
                (<font color=red>V</font>&bull;<font color=red>V</font> - r*r) &nbsp; = &nbsp; 0
        </blockquote>

</blockquote>

\`);
setDescription(description);
`,

'solve':`
S.html(\`
<b>Now let's use the quadratic equation to solve for t:</b>
<blockquote>
        Plug <u>t*t + 2(<font color=red>V</font>&bull;W) * t +
        (<font color=red>V</font>&bull;<font color=red>V</font> - r*r) = 0</u> into the quadratic equation.

        <p>
        Then we will be able to solve for t:

        <blockquote>
                t = -b <u>+</u> &radic;<span style="text-decoration:overline">(b*b - 4*a*c) / 2a</span>
        </blockquote>

        In our case:
        <blockquote>
                a = 1
                <br>
                b = 2(<font color=red>V</font>&bull;W)
                <br>
                c = <font color=red>V</font>&bull;<font color=red>V</font> - r*r
        </blockquote>

        A somewhat simpler version of the quadratic equation for our use:

        <blockquote>
                t = -b/2 <u>+</u> &radic;<span style="text-decoration:overline">(b/2)*(b/2) - c</span>
        </blockquote>

        Substituting, we get:

        <blockquote>
                t = (<font color=red>V</font>&bull;W) <u>+</u>
                &radic;<span style="text-decoration:overline">
                (<font color=red>V</font>&bull;W)<sup>2</sup> -
                <font color=red>V</font>&bull;<font color=red>V</font> + r*r</span>
        </blockquote>
</blockquote>

\`);
setDescription(description);
`,

'how many solutions':`
S.html(\`
<b>How many solutions are there?</b>
<blockquote>
        If the ray misses the sphere, then there will be a negative value under the square root.

        <blockquote>

                &bull; In that case there are no real roots to the equation.
                <br>
                &bull; That's how we know the ray has missed the sphere.
        </blockquote>

        If there are real roots, then there are up to two solutions for t.
        <p>

        <blockquote>
        &bull; The smaller solution is where the ray enters the sphere.
        <br>
        &bull; The larger solution is where the ray exits the sphere.
        </blockquote>
        <p>

        So the complete solution to find surface point P is:

<blockquote>
        t = (<font color=red>V</font>&bull;W) - &radic;<span style="text-decoration:overline">(<font color=red>V</font>&bull;W)<sup>2</sup> - <font color=red>V</font>&bull;<font color=red>V</font> + r*r</span>

        <p>

        P = <font color=red>V</font> + t * W
	<br>&nbsp;&nbsp;
          = [ <font color=red>V<sub>x</sub></font> + t*W<sub>x</sub> , <font color=red>V<sub>y</sub></font> + t*W<sub>y</sub> , <font color=red>V<sub>z</sub></font> + t*W<sub>z</sub> ]
</blockquote>
</blockquote>

\`);
setDescription(description + '<p><img src=imgs/two_roots.jpg width=550>');
`,

};

}

