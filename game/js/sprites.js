
//objeto que carrega um spritesheet
function Spritesheet(imageurl,jsonurl,callback)
{
    this.spritesheet = new Image();
    this.imageready  = false;
    this.jsonready   = false;
    this.spritedata  = {};
    this.usercallback = callback;

    var that = this;

    //carrega a imagem
    this.spritesheet.onload = function() {
      that.imageready = true;
      that.testallready();
    };

    this.spritesheet.src= imageurl;

    //carrega o arquivo json
    _ajax.load(jsonurl,function(data){
      that.jsonready = true;

      //faz o parsing do json
      var jsonobj  = JSON.parse(data);

      that.parsejson(jsonobj.frames);     //cria nosso json de informacoes
      that.testallready();
    });


}

Spritesheet.prototype.draw= function(sprite,x,y,context,center)
{
  var c = center || false;
  var sprite = this.spritedata[sprite];
  
  //retorna se nenhum sprite foi encontrado
  if(!sprite)
    return;

  //calcula a posicao do sprite no canvas
  if(center)
  {
    x = x+sprite.cx;
    y = y+sprite.cy;
  } else {
    x = x+sprite.x;
    y = y+sprite.y;
  }
  context.drawImage(this.spritesheet, sprite.sx, sprite.sy, sprite.sw, sprite.sh,x,y,sprite.sw,sprite.sh);
               
}

Spritesheet.prototype.testallready     = function()
{

  if(this.imageready && this.jsonready)
    this.usercallback();

}

Spritesheet.prototype.parsejson= function(jsonobj)
{
  for( spritename in jsonobj)
  {
     //cria um objeto
     var obj = {x:0,y:0,w:0,h:0,cx:0,cy:0,sx:0,sy:0,sw:0,sh:0};
     var sp  = jsonobj[spritename];
     
     //tamanho original do objeto
     obj.w = sp.sourceSize.w;
     obj.h = sp.sourceSize.h; 

     //retangulo a ser copiado do spritesheet para desenhar esse sprite
     obj.sx = sp.frame.x;
     obj.sy = sp.frame.y;
     obj.sw = sp.frame.w;
     obj.sh = sp.frame.h;

     //deslocamento a ser adicionado nas coordenadas x e y quando o objeto foi
     //deslocado
     if(sp.trimmed)
     {
       obj.x = sp.spriteSourceSize.x;
       obj.y = sp.spriteSourceSize.y;
     }

     //deslocamento a ser adicionado nas coordenadas x e y quando o objeto
     //utiliza-se o centro do objeto
     obj.cx = 0;
     obj.cy = 0;

     //salva o sprite
     this.spritedata[spritename] = obj;
  }
}

//===========================================================================//

function GameObject()
{

  //todo sprite segue o desenho de uma spritesheet
  this.spritesheet = undefined;
  this.animated    = false;
  this.animationMap = {};
  this.animationState = undefined;
  this.sprite = "";
  this.frameDuration=0;
  this.frameDurationMax=3;
  this.frame = 0;
  this.play = false;
  this.animating = false;

  //variaveis utilizadas para achar o centro em relacao ao sprite
  this.sprite_cx = 0;
  this.sprite_cy = 0;

  //position
  this.x = 0;
  this.y = 0;


}

GameObject.prototype.animate = function(s)
{
  if(s)
  {
    this.play = true;
    this.animating = true;
  } else {
    this.play = false;
  }
}


GameObject.prototype.draw = function(ctx)
{
  //sprite
  if(!this.animated)
    this.spritesheet.draw(this.sprite,this.x,this.y,ctx);
  else
  {
    var s = this.animationMap[this.animationState];
    if(this.animating)
    {
      this.frameDuration--;
      if(this.frameDuration <= 0)
      {
        this.frame = (this.frame +1) % s.length;
        this.frameDuration = this.frameDurationMax;
      }

      if(this.frame == 0)
        if(!this.play)
          this.animating = false;
    }

    this.spritesheet.draw(s[this.frame],this.x,this.y,ctx);
  }
}



function Player()
{

  //cria o mapa de animações
  this.animationMap = 
  {
    UP: ["Bman_B_f00.png","Bman_B_f01.png","Bman_B_f02.png","Bman_B_f03.png","Bman_B_f04.png","Bman_B_f05.png","Bman_B_f06.png","Bman_B_f07.png"],
    DOWN:["Bman_F_f00.png","Bman_F_f01.png","Bman_F_f02.png","Bman_F_f03.png","Bman_F_f04.png","Bman_F_f05.png","Bman_F_f06.png","Bman_F_f07.png"],
    LEFT: ["Bman_L_f00.png","Bman_L_f01.png","Bman_L_f02.png","Bman_L_f03.png","Bman_L_f04.png","Bman_L_f05.png","Bman_L_f06.png","Bman_L_f07.png"],
    RIGHT: ["Bman_R_f00.png","Bman_R_f01.png","Bman_R_f02.png","Bman_R_f03.png","Bman_R_f04.png","Bman_R_f05.png","Bman_R_f06.png","Bman_R_f07.png"],
  }

  this.frameDurationMax = 3;
  this.animated = true;
  this.animationState = "DOWN";

  //player specific properties
  this.speed = 2;
  this.bombs = 1;
  this.power = 1;

}


Player.prototype = new GameObject();


//funcao para criar uma bomba na posicao do usuario
Player.prototype.dropBomb = function()
{

}


