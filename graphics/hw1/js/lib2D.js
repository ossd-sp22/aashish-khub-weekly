
function lib2D() {

S.context = myCanvas.getContext('2d');

beforeDraw = () => {
   S.context.fillStyle = 'black';
   S.context.fillRect(0, 0, myCanvas.width, myCanvas.height);
   S.context.fillStyle = 'white';
   S.context.strokeStyle = 'white';
}

addEventListenersToCanvas = function(canvas) {
   let r = canvas.getBoundingClientRect();

   if (! onDrag      ) onDrag       = (x, y) => { };
   if (! onMove      ) onMove       = (x, y) => { };
   if (! onPress     ) onPress      = (x, y) => { };
   if (! onRelease   ) onRelease    = (x, y) => { };
   if (! onKeyPress  ) onKeyPress   = key => { };
   if (! onKeyRelease) onKeyRelease = key => { };

   canvas.addEventListener('mousemove', function(e) {
      (this._isDown ? onDrag : onMove)(e.clientX - r.left, e.clientY - r.top);
   });
   canvas.addEventListener('mousedown', function(e) {
      onPress(e.clientX - r.left, e.clientY - r.top);
      this._isDown = true ;
   });
   canvas.addEventListener('mouseup'  , function(e) {
      onRelease(e.clientX - r.left, e.clientY - r.top);
      this._isDown = false;
   });
   window.addEventListener('keydown', function(e) {
      if (! isEditing()) {
         switch (e.keyCode) {
         case  32: // SPACE
         case  33: // PAGE UP
         case  34: // PAGE DOWN
            e.preventDefault();
         }
      }
      onKeyPress(e.keyCode);
   }, true);
   window.addEventListener('keyup', function(e) {
      onKeyRelease(e.keyCode);
   }, true);
}
addEventListenersToCanvas(myCanvas);

}

