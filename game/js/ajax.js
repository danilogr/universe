/*
 * A idéia é utilizar um padrão singleton para criar apenas um único objeto
 * de requisição. As chamadas são colocadas em uma fila e atendidas em ordem
 * */

window._ajax = {

    xmlhttprequest : undefined,
    requestQueue : [],
    working      : false, //se true quer dizer que uma requisição ajax está em progresso
    usercallback : undefined,

    _callback : function () {
        if(_ajax.xmlhttprequest.readyState == 4)
        {
          if(_ajax.xmlhttprequest.status == 200)
        {
          //chama funcao do usuario
          _ajax.usercallback(_ajax.xmlhttprequest.responseText);
        }

        //faz uma chamada para a proxima requisicao
        _ajax._request();

      }
    },

    load: function(filename,callback)
    {
      //cria o objeto de requisição caso o mesmo não tenha sido criado
      if(!_ajax.xmlhttprequest)
      {
        if(window.XMLHttpRequest)
        { //código válido  para IE7+, Firefox, Chrome, Opera e Safari
          _ajax.xmlhttprequest = new XMLHttpRequest();
        } else {
          //fallback code para IE6, IE5
          _ajax.xmlhttprequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        _ajax.xmlhttprequest.onreadystatechange = _ajax._callback;
      }

      //adiciona a requisicao na fila
      _ajax.requestQueue.push([filename,callback]);

      //se nenhum requisição está sendo processada então faz o pedido 
      _ajax._request();

    },

    _request: function()
    {

      if(_ajax.requestQueue.length <= 0)
      {
        _ajax.working = false;
        return;
      }

      //pega primeiro elemento da fila
      var workingreq = _ajax.requestQueue.splice(0,1)[0];

      //faz a requisicao ajax
      _ajax.usercallback = workingreq[1];
      _ajax.xmlhttprequest.open("GET",workingreq[0],true);
      _ajax.working = true;
      _ajax.xmlhttprequest.send();

    }

}



