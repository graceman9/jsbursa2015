(function appSimpleAJAX(){
  'use strict';
  var main = function main() {
    var get = document.querySelector('.get');
    var post = document.querySelector('.post');
    var weird = document.querySelector('.weird');
    var url = 'https://cors-test.appspot.com/test';
    var sendXHR = function sendXHR(method, url, container) {
      var xhr = new XMLHttpRequest();
      var handlerXHR = function handlerXHR() {
        console.log(method, 'readyState: ', xhr.readyState);
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status == 200) {
            var r = JSON.parse(xhr.responseText);
            container.style.fontWeight = 'bold';
            container.style.color = 'green';
            container.textContent = r.status.toUpperCase();
          }
          else {
            container.style.fontWeight = 'bold';
            container.style.color = 'red';
            container.textContent = 'Failed';
          }
        }
      };
      xhr.open(method, url);
      xhr.send();
      xhr.addEventListener('readystatechange', handlerXHR);
    };

    sendXHR('GET', url, get);
    sendXHR('POST', url, post);
    sendXHR('WEIRD', url, weird);
  };
  window.addEventListener('load', main);
}());