
rooms.example2D = function() {

lib2D();

description = `<b> Assignment 1 Artwork: <i>The 8 a.m. Flower.</i> </b>
 <br> <br> <p> The soothing, colorful shades of the flower are 
 reminescent of morning skies. Drag the flower around using your mouse,
  or hit the spacebar to see more petals! </p>`;

code = {
'explanation': `
  S.html(\`
     A 2D canvas lets you create paths.
     <p>
     You can either
     draw <i>strokes</i> along those paths or else
     create solid shapes by <i>filling</i> those paths.
  \`);
`,
init: `
  S.x = 400;
  S.y = 400;
`,
assets: `
function getXY (r, theta) {
    x = S.x + (r*Math.cos(theta));
    y = S.y + (r*Math.sin(theta));
    return( [x,y] )
  }

  S.drawPetals = (radius, petals) => {

  let ctx = S.context;
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';

  grad = S.context.createRadialGradient(S.x,S.y,10,
  S.x,S.y,radius);
  grad.addColorStop(0.5*Math.sin(time)+.5,"yellow");
  grad.addColorStop(0.5,"turquoise");
  grad.addColorStop(0.5*Math.cos(time)+.5,"blue");

  var phaseShift = Math.cos(time+Math.PI/petals); //oscillating phase shift, flower swirls!

  for (var i = 1; i <= petals; i++) {
    var phi = (2*Math.PI/petals);
    var startAngle = i*phi + phaseShift;
    var endAngle   = startAngle + phi;
    S.context.beginPath();

    S.context.moveTo(...getXY(0,0)); //start here
    var nextThreePoints = [
        ...getXY(radius, startAngle),
        ...getXY(radius, endAngle),
        ...getXY(0,0)
    ]
    S.context.bezierCurveTo(...nextThreePoints);
    S.context.stroke();
  S.context.fillStyle = grad;
  S.context.fill();
  }
}
`,
render: `
var radius = 400.0;
let petals = S.isSpace ? 42 : 7;

S.drawPetals(radius, petals);
`,
events: `
  onDrag = (x,y) => {
     S.x = x;
     S.y = y;
  }
  onKeyPress   = key => S.isSpace = key == 32;
  onKeyRelease = key => S.isSpace = false;
`
};

}

