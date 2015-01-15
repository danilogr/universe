navigator.getUserMedia = (navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia );

document.addEventListener("DOMContentLoaded", function()    {

      if (!navigator.getUserMedia)
      {
        alert('Sorry, the browser you are using is not supported');
        return;
      }

      var v = document.querySelector("#v");
      var c = document.querySelector("#c");
      var b = document.querySelector("#back");
      var ctx  = c.getContext('2d');
      var bctx = b.getContext('2d');
      var w = 640, h = 480;

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
             ctx.drawImage(v,0,0);
          }
        } catch (e) {
          console.log("Could not get video frame",e);
          requestAnimationFrame(draw);
          return;
        }


        //find alpha values
        var frameImage = ctx.getImageData(0,0,c.width,c.height);
        var frameImageLength = frameImage.data.length;
        for(var i=0; i < frameImageLength; i+=4) {
          var cr = frameImage.data[i],
              cg = frameImage.data[i+1],
              cb = frameImage.data[i+2];

          var gray = 0.11*cr + 0.59*cg + 0.30*cb;
          frameImage.data[i] = gray;
          frameImage.data[i+1] = gray;
          frameImage.data[i+2] =  gray;
        }

        ctx.putImageData(frameImage,0,0);
        //ctx.drawImage(b,0,0);
        requestAnimationFrame(draw);
      }
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
