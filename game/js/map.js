function Map(maparray, spritesarray, swidth, sheight, spritesheet) {

    //cria os dados iniciais
    this.map = maparray;
    this.spritelist = spritesarray;
    this.spritesheet = spritesheet || undefined;

    this.blockw = swidth;
    this.blockh = sheight;


    //cria o canvas para o mapa
    this.canvas = document.createElement('canvas');
    this.canvas.width = swidth * (maparray[0].length);
    this.canvas.height = sheight * maparray.length;
    this.ctx = this.canvas.getContext('2d');

}

//redesenha apenas uma parte do mapa
Map.prototype.updateTile = function (posx, posy) {
    //posicao valida
    if (
        posy >= 0 && posy <= this.map.length &&
        posx >= 0 && posx <= this.map[0].length) {
        this.spritesheet.draw(this.spritelist[this.map[posy][posx]], posx * this.blockw,
            posy * this.blockh, this.ctx);
    }
}

//redesenha o mapa no canvas
Map.prototype.update = function () {
    //se nenhuma folha de sprites foi passada, retorna
    if (!this.spritesheet)
        return;

    var pox = 0,
        posy = 0;
    for (var l = 0; l < this.map.length; ++l) {
        posx = 0;
        var line = this.map[l];
        for (var i = 0; i < line.length; ++i) {

            //se  for apenas um sprite
            this.spritesheet.draw(this.spritelist[line[i]], posx, posy, this.ctx);
            posx = posx + this.blockw;
        }

        posy = posy + this.blockh;
    }

}

//
Map.prototype.draw = function (ctx, x, y) {
    ctx.drawImage(this.canvas, x, y);
}


//funcao de colisao do mapa
//apenas devolve qual tijolo na proxima posicao x e y desejada
Map.prototype.tile = function (x, y, vx, vy, value) {
    //encontra o primeiro bloco
    var tilex = Math.floor(x / this.blockw);
    var tiley = Math.floor(y / this.blockh);


    //encontra o segundo bloco
    var tilex1 = Math.floor((x + vx) / this.blockw);
    var tiley1 = Math.floor((y + vy) / this.blockh);

    //Game.ctx.fillStyle="#FF0000";
    //Game.ctx.fillRect(x,y,5,5);
    //Game.ctx.fillRect(x+vx,y+vy,5,5);

    return (this.map[tiley][tilex] == value) && (this.map[tiley1][tilex1] == value);
}