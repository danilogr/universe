document.addEventListener("DOMContentLoaded", function()    {
      var v = document.querySelector("#v");
      var c = document.querySelector("#c");
      var b = document.querySelector("#back");
      var ctx  = c.getContext('2d');
      var bctx = b.getContext('2d');

      var nebula = new Image();
      nebula.src = "images/nebula.png";

      var draw = function()
      {
        //draw in the back canvas
        bctx.drawImage(v,0,0);

        //find alpha values
        var frameImage = bctx.getImageData(0,0,c.width,c.height);
        var frameImageLength = frameImage.data.length;
        for(var i=0; i < frameImageLength; i+=4) {
          var cr = frameImage.data[i],
              cg = frameImage.data[i+1],
              cb = frameImage.data[i+2];
          if (cr < 100 && cb < 100)
          {
            frameImage.data[i+1] = cg/2;
            if(cg > 100)
              frameImage.data[i+3] = 255 - cg; //smooth
          }
        }

        bctx.putImageData(frameImage,0,0);
        ctx.drawImage(nebula,0,0);
        ctx.drawImage(b,0,0);
        requestAnimationFrame(draw);
      }


      v.addEventListener("loadedmetadata", function() {
        b.width  = c.width  = this.videoWidth;
        b.height = c.height = this.videoHeight;

        draw();
      });

    }, false);
