
rooms.notes = function() {

description = `<b>Notes for Tuesday September 7</b>
               <p>
	       Images, lines, pixels and fragment shaders.`;

code = {

'intro':`
S.html(\`
<b>What we will cover today</b>
<ul>
	<li>images
	<li>color
	<li>gamma correction
	<li>coordinate systems
	<li>2D and 3D APIs
	<li>2D API -- drawing lines
	<li>3D API -- fragment shaders
</ul>
</pre>
\`);
`,

'images':`
S.html(\`
<b>Images and pixels</b>
<blockquote>
	An image is essentially an array of pixels.
	<p>
	Every pixel has a unique index.
	<p>
	<img src=imgs/image-scan.png width=400>
	<p>
	Pixels generally store: red,green,blue,alpha
	<p>
	Alpha measures transparency.
</blockquote>
\`);
`,

'color':`
S.html(\`
<b>RGB color space and human color perception</b>
<p>
<blockquote>
<table>
<tr>
<td><img src=imgs/humancolor.png width=400>
<td width=10>
<td valign=top>
<font size=5>People can see many colors
within the visible spectrum.
<p>&nbsp;<br>
We can only approximate that with the three values
<font color=red>red</font>,
<font color=#20a020>green</font> and
<font color=blue>blue</font>.</font>
</table>
</blockquote>
<ul>
	<li>A color is stored as red, green, blue, alpha components.
	<br>
	<b>Alpha is opacity.</b>
	<p>
	<li>For each component: 0.0 == none, 1.0 == maximum
	<p>
	<li>To save space, components are quantized as 0 ... 255.
	<p>
	Each pixel fits into a 32 bit word:
	<p>
	<blockquote>
	<table>
	<tr><th width=100><big><font color=red>RED</font>
	    <th width=100><big><font color=#20a020>GREEN</font>
	    <th width=100><big><font color=blue>BLUE</font>
	    <th width=100><big>ALPHA</tr>
	<tr><th><font color=red><big>0...255<br>8 bits</font>
	    <th><font color=#20a020><big>0...255<br>8 bits</font>
	    <th><font color=blue><big>0...255<br>8 bits</font>
	    <th><big>0...255<br>8 bits</tr>
	</table>
	</blockquote>
</ul>
\`);
`,

'gamma':`
S.html(\`
<b>Gamma correction</b>
	<p>
	<li>Humans perceive brightness logarithmically.
	<p>
	<li>Therefore 0 ... 255 image pixel values are stored with a power law:
	<p>
	<blockquote>
	<table><tr>
	<td><img src=imgs/gamma.png width=210>
	<td width=20>&nbsp;
	<td>
	<ul><font size=5>
	<li>128 represents about 0.25 brightness.
	<p>
	<li>187 represents about 0.50 brightness.
	</ul>
	</tr></table>
	</blockquote>
	<p>
	<li>But fragment shader values are computed linearly:
	<ul><blockquote>
	<li>We don't want: 0.50 &rarr; 128
	</blockquote></ul>
	<p>
	<li>A good approximate gamma correction:
	<p>
	       <blockquote>
	       <blockquote>
	       sqrt([r,g,b])
	       </blockquote>
	       </blockquote>
<p>
<blockquote>
</blockquote>
\`);
`,

'coordinates':`
S.html(\`
<b>Coordinate systems</b>
<blockquote>
	<p>
	<ul>
		<li>2D coordinates: x,y
		<p>
		<li>3d coordinates: x,y,z
		<p>
		<img src=imgs/axes.png width=400>
		<p>
		<li>Right hand rule
		<p>
		<img src=imgs/right_hand_rule.jpg width=200>
	</ul>
</blockquote>
\`);
`,

'APIs':`
S.html(\`
<b>Building on top of an API</b>
<ul>
	<li>2D canvas:
	<p>
	<ul>
		<li>lines and shapes
		<p>
		<li>stroke vs fill
	</ul>
	<p>
	<li>Creating pixel by pixel:
	<p>
	<ul>
		<li>loop over all pixels
		<p>
		<ul>
		<p>
			<li>input: x,y
			<p>
			<ul>
			       <li>possibly also time
			       <li>possibly also cursor position
			</ul>
			<p>
			<li>fragment shader on GPU
			<p>
			<li>output: r,g,b,&alpha;
		</ul>
	</ul>
</ul>
\`);
`,

'2D API':`
S.html(\`
<b>Example of using a 2D API</b>
<ul>
<p>
	<li>Build a simple pattern.
	<p>
	<li>Animate using time.
	<p>
	<li><a href=https://www.w3schools.com/tags/ref_canvas.asp>HTML Canvas Reference</a>
</ul>
\`);
`,

'fragment shaders':`
S.html(\`
<b>Talking to the fragment shader</b>
<ul>
<table><tr>
<th valign=top>
<big>A square can be represented<br>as two triangles</big>
<p>
<img src=imgs/square_as_triangle_strip.png height=333>
</td>
<td width=45></td>
<th valign=top>
<big>Fragments can be<br>parts of pixels</big>
<p>
<img src=imgs/scan_conversion.png height=333>
</td>
</tr></table>
<p>
<b>Example of writing to a fragment shader on the GPU</b>
<ul>
	<li>Sine waves
	<p>
	<li>Build an interesting pattern
	<p>
	<li><a href=https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf>WebGL reference</a>
</ul>
</blockquote>
\`);
`,

};

}

