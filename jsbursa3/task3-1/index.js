function jsonpSuccessHandler(data) {
  var content = document.querySelector('#content');
  console.log(data);
  content.innerHTML = data.parse.text['*'];
}

(function appJSONP(){
  'use strict';
  var main = function main() {
    var head = document.querySelector('head');
    var input = document.querySelector('input');
    var button = document.querySelector('button');
    var content = document.querySelector('#content');
    var script;
    var handlerClick = function handlerClick() {
      script = document.createElement('script');
      head.appendChild(script);
      script.src = 'http://en.wikipedia.org/w/api.php?action=parse&page='+ input.value +'&prop=text&section=0&format=json&callback=jsonpSuccessHandler';
      script.parentNode.removeChild(script);
    };
    button.addEventListener('click', handlerClick);
  };
  window.addEventListener('load', main);
}());