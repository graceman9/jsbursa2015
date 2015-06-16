(function appSimpleAJAX() {
  'use strict';
  var main = function main() {
    var get = document.querySelector('.get');
    var post = document.querySelector('.post');
    var weird = document.querySelector('.weird');
    var testURL = 'http://cors-test.appspot.com/test';
    var sendXHR = function sendXHR(method, url, container) {
      var xhr = new XMLHttpRequest();
      var handlerXHR = function handlerXHR() {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200 && JSON.parse(xhr.responseText).status === 'ok') {
            container.style.fontWeight = 'bold';
            container.style.color = 'green';
            container.textContent = 'OK';
          } else {
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

    sendXHR('GET', testURL, get);
    sendXHR('POST', testURL, post);
    sendXHR('WEIRD', testURL, weird);
  };
  window.addEventListener('load', main);
}());
