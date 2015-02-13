navigator.getUserMedia = (navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia );

/* global requestAnimationFrame */

window.distance = function(x1,y1,z1,x2,y2,z2)
{
  x1 = x1 - x2;
  y1 = y1 - y2;
  z1 = z1 - z2;
  
  return Math.sqrt(x1*x1 + y1*y1 + z1*z1);
};

document.addEventListener("DOMContentLoaded", function()    {

      if (!navigator.getUserMedia)
      {
        alert('Sorry, the browser you are using is not supported');
        return;
      }

      var v = document.querySelector("#v");
      var c = document.querySelector("#c");
      var btn = document.querySelector("#capturebtn");
      var sbtn = document.querySelector("#savebtn");
      var img = document.querySelector("#background");
      img.BackgroundSet = false;
      var b = document.querySelector("#back");
      var ctx  = c.getContext('2d');
      var bctx = b.getContext('2d');
      var w = 640, h = 480;

      btn.addEventListener("click", function(){
        img.src = b.toDataURL();
        img.BackgroundSet = true;
      });
      
      sbtn.addEventListener("click", function(){
        window.open(c.toDataURL());
      });

      v.addEventListener("canplay", function() {
        if(v.videoWidth > 0)
        {
          //videoWidth isn't always set correctly in all browsers
          h = v.videoHeight / (v.videoWidth / w);
        }

        b.width  = c.width  = w;
        b.height = c.height = h;
      });
      
      var userMedia =   navigator.getUserMedia(
          {
            video: true,
            audio: false
          },
          function(stream) {
            var url = window.URL || window.webkitURL;
            v.src = url ? url.createObjectURL(stream) : stream;
            v.play();
          },
          function(error) {
            alert("Something went wront :( ");
          });

      var draw = function()
      {
        if(!v.playing)
          return;
          
        //draw in the back canvas
        try
        {
          if ( v.readyState !== v.HAVE_ENOUGH_DATA )
          {
            //waits for next frame
            console.log('Not enough data on ',v);
            requestAnimationFrame(draw);
            return;
          } else {
             bctx.drawImage(v,0,0);
             ctx.drawImage(v,0,0);             
          }
        } catch (e) {
          console.log("Could not get video frame",e);
          requestAnimationFrame(draw);
          return;
        }

        //filter background (if set)
        if(img.BackgroundSet)
        {
          //draw background picture
          ctx.drawImage(img,0,0);
        
          //find alpha values
          var fI = bctx.getImageData(0,0,c.width,c.height);
          var fIB = ctx.getImageData(0,0,c.width,c.height);
          var frameImageLength = fI.data.length;
          for(var i=0; i < frameImageLength; i+=4) {
            var r1 = fIB.data[i];
            var g1 = fIB.data[i+1];
            var b1 = fIB.data[i+2];
            var r2 = fI.data[i];
            var g2 = fI.data[i+1];
            var b2 = fI.data[i+2];            
            
            if(window.distance(r1,g1,b1,r2,g2,b2) < 20)
            {
              fI.data[i+3] = 0;
            }
                        
            
    
            //var gray = 0.11*cr + 0.59*cg + 0.30*cb;
            //frameImage.data[i] = gray;
            //frameImage.data[i+1] = gray;
            //frameImage.data[i+2] =  gray;
          }
            ctx.putImageData(fI,0,0);
        }


        //ctx.drawImage(b,0,0);
        requestAnimationFrame(draw);
      };
      v.addEventListener("play", function() {
        v.playing = true;
        draw();
      });

      v.addEventListener("stop", function() {
        v.playing = false;
      });

      v.addEventListener("pause", function() {
        v.playing = false;
      });
}, false);
