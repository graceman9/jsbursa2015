function jsonpSuccessHandler(data) {
  var content = document.querySelector('#content');
  console.log(data);
  content.innerHTML = data.parse.text['*'];
}

(function appJSONP(){
  'use strict';
  var main = function main() {
    var head = document.querySelector('head');
    var body = document.querySelector('body');
    var input = document.createElement('input');
    var button = document.createElement('button');
    var content = document.createElement('content');
    var script;
    var handlerClick = function handlerClick() {
      script = document.createElement('script');
      head.appendChild(script);
      script.src = 'http://en.wikipedia.org/w/api.php?action=parse&page='+ input.value +'&prop=text&section=0&format=json&callback=jsonpSuccessHandler';
      script.parentNode.removeChild(script);
    };
    content.id = 'content';
    button.textContent = 'Отправить';
    body.appendChild(input);
    body.appendChild(button);
    body.appendChild(content);

    button.addEventListener('click', handlerClick);
  };
  window.addEventListener('load', main);
}());