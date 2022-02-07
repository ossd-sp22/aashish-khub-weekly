
   var Matrix = function() {
      this._mS = [];
      this._to = 0;
      this._mS[0] = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
      this._m = function(arg) {
         if (typeof arg != 'undefined')
	    this._mS[this._to] = arg;
	 return this._mS[this._to];
      };
      this.push = function() {
         this._mS[this._to+1] = this._mS[this._to++];
      };
      this.pop = function() {
         --this._to;
      };
      this.identity = function() {
         return this._m(this._id());
      };
      this.normalMatrix = function(m) {
         var a = m[0]*m[0] + m[1]*m[1] + m[ 2]*m[ 2],
	     b = m[4]*m[4] + m[5]*m[5] + m[ 6]*m[ 6],
	     c = m[8]*m[8] + m[9]*m[9] + m[10]*m[10];
	 return [m[0]/a,m[1]/a,m[ 2]/a,0,
	         m[4]/b,m[5]/b,m[ 6]/b,0,
		 m[8]/c,m[9]/c,m[10]/c,0,
		 0,0,0,1];
      };
      this.transpose = function(m) {
         return [m[0],m[4],m[ 8],m[12],
	         m[1],m[5],m[ 9],m[13],
		 m[2],m[6],m[10],m[14],
		 m[3],m[7],m[11],m[15]];
      };
      this.inverse = function(m) {
         let dst = [], det = 0, cofactor = (c, r) => {
            let s = (i,j) => m[c+i & 3 | (r+j & 3) << 2];
            return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
                                        - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
                                        + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
         }
         for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
         for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
         for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
         return dst;
      };
      this.translate = function(x,y,z) {
         this._xf(this._tr(x,y,z));
      };
      this.aimX = function(X,Y) {
         this._xf(this._aX(X,Y));
      };
      this.aimY = function(Y,Z) {
         this._xf(this._aY(Y,Z));
      };
      this.aimZ = function(Z,X) {
         this._xf(this._aZ(Z,X));
      };
      this.rotateX = function(a) {
         this._xf(this._rX(a));
      };
      this.rotateY = function(a) {
         this._xf(this._rY(a));
      };
      this.rotateZ = function(a) {
         this._xf(this._rZ(a));
      };
      this.scale = function(x,y,z) {
         if (typeof y=='undefined')
	    z=y=x;
	 this._xf(this._sc(x,y,z));
      };
      this.perspective = function(x,y,z) {
         this._xf(this._pe(x,y,z));
      };
      this._xf = function(m) {
         this._m(this._mm(m,this._m()));
      };
      this._id = function() {
         return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
      };
      this._tr = function(x,y,z) {
         return [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1];
      };
      this._aX = function(X,Y) {
         let x = normalize(X);
         let z = normalize(cross(X,Y));
         let y = cross(z,x);
         return [ x[0],x[1],x[2],0, y[0],y[1],y[2],0, z[0],z[1],z[2],0, 0,0,0,1 ];
      }
      this._aY = function(Y,Z) {
         let y = normalize(Y);
         let x = normalize(cross(Y,Z));
         let z = cross(x,y);
         return [ x[0],x[1],x[2],0, y[0],y[1],y[2],0, z[0],z[1],z[2],0, 0,0,0,1 ];
      }
      this._aZ = function(Z,X) {
         let z = normalize(Z);
         let y = normalize(cross(Z,X));
         let x = cross(y,z);
         return [ x[0],x[1],x[2],0, y[0],y[1],y[2],0, z[0],z[1],z[2],0, 0,0,0,1 ];
      }
      this._rX = function(a) {
         var c = Math.cos(a),s = Math.sin(a);
	 return [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1];
      };
      this._rY = function(a) {
         var c = Math.cos(a),s = Math.sin(a);
	 return [c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1];
      };
      this._rZ = function(a) {
         var c = Math.cos(a),s = Math.sin(a);
	 return [c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1];
      };
      this._sc = function(x,y,z) {
         return [x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1];
      };
      this._pe = function(x,y,z) {
         var rr = x*x + y*y + z*z;
	 return [1,0,0,x/rr, 0,1,0,y/rr, 0,0,1,z/rr, 0,0,0,1];
      };
      this._d = function(a,b) {
	 return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + (b.length<4 ? a[3] : a[3]*b[3]);
      };
      this._x = function(m) {
         return [m[0],m[1],m[2],m[3]];
      };
      this._y = function(m) {
         return [m[4],m[5],m[6],m[7]];
      };
      this._z = function(m) {
         return [m[8],m[9],m[10],m[11]];
      };
      this._w = function(m) {
         return [m[12],m[13],m[14],m[15]];
      };
      this._mm = function(a,b) {
         var t = this.transpose(b);

         var x = this._x(a), y = this._y(a), z = this._z(a), w = this._w(a);
         var X = this._x(t), Y = this._y(t), Z = this._z(t), W = this._w(t);

         return [this._d(x, X), this._d(x, Y), this._d(x, Z), this._d(x, W), 
	         this._d(y, X), this._d(y, Y), this._d(y, Z), this._d(y, W), 
		 this._d(z, X), this._d(z, Y), this._d(z, Z), this._d(z, W), 
		 this._d(w, X), this._d(w, Y), this._d(w, Z), this._d(w, W)];
      };
      this._mv = function(m,v) {
         var M = this._m();
         var x = this._d( [M[0],M[4],M[ 8],M[12]] , v );
         var y = this._d( [M[1],M[5],M[ 9],M[13]] , v );
         var z = this._d( [M[2],M[6],M[10],M[14]] , v );
         var w = this._d( [M[3],M[7],M[11],M[15]] , v );
         return [x / w, y / w, z / w];
      };
      this.transform = function(v) {
         return this._mv(this._m(),v);
      }
   };
   function dot(a,b) {
      return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
   };
   function cross(a,b) {
      return [ a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0] ];
   };
   function lerp(t,a,b) {
      return a + t*(b-a);
   };
   function normalize(v) {
      var x = v[0], y = v[1], z = v[2], r = Math.sqrt(x*x + y*y + z*z);
      v[0] /= r;
      v[1] /= r;
      v[2] /= r;
   };
   var pts=[[-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]];
   var eds=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
   function unitCube() {
      for (var i = 0 ; i < eds.length ; i++)
         mLine(pts[eds[i][0]], pts[eds[i][1]]);
   }
   function standardView(x,y,theta,phi,s) {
      m.translate(width()*x,height()*(1-y),0);
      m.perspective(0,0,-width()*2);
      m.rotateX(phi);
      m.rotateY(theta);
      s *= width()/3.5;
      m.scale(s,-s,s);
   };
   function vecAdd(a,b) {
      return [a[0] + b[0],a[1] + b[1],a[2] + b[2]];
   };
   function vecScale(a,s) {
      return [s*a[0],s*a[1],s*a[2]];
   };
   function vecLerp(t,a,b) {
      return [lerp(t,a[0],b[0]),lerp(t,a[1],b[1]),lerp(t,a[2],b[2])];
   };
   function mLine(a,b) {
      var A = m.transform(a);
      var B = m.transform(b);
      line(A[0],A[1],B[0],B[1]);
   };
   function mCurve(c) {
      for (var n = 1; n < c.length; n++) {
         var A = m.transform(c[n-1]);
         var B = m.transform(c[n]);
         line(A[0],A[1],B[0],B[1]);
      }
   };
   function mArrow(a,b){
      var A = m.transform(a);
      var B = m.transform(b);
      arrow(A[0],A[1],B[0],B[1]);
   };
   function mText(str,p,ax,ay){
      var P = m.transform(p);
      text(str,P[0],P[1],ax,ay);
   };

