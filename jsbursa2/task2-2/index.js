(function appTwoPlusTwo() {
  'use strict';
  var main;
  var isDecimalNumber = function isDecimalNumberHandler(value) {
    // return typeof value === 'number' // isInteger, see https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
    //  && isFinite(value)
    //  && Math.floor(value) === value;
    return !isNaN(parseFloat(value)) // http://web-answers.ru/questions-and-answers/javascript/kak-na-javascript-proverit-chto-peremennaya-yavlyaetsya-chislom/
      && !isNaN(+value)
      && isFinite(value)
      && value.trim().substr(0, 2) !== '0x';
  };

  main = function mainHandler() {
    var body = document.querySelector('body');
    var input1;
    var input2;
    var btn;
    var error1;
    var error2;
    var result;
    var err;

    input1 = document.createElement('input');
    input2 = document.createElement('input');
    input1.classList.add('first');
    input2.classList.add('second');
    body.appendChild(input1);
    body.appendChild(input2);

    btn = document.createElement('button');
    btn.textContent = 'Посчитать';
    body.appendChild(btn);

    error1 = document.createElement('div');
    error2 = document.createElement('div');
    error1.classList.add('error-message');
    error2.classList.add('error-message');
    error1.textContent = 'Это не число';
    error2.textContent = 'Это не число';

    result = document.createElement('div');
    result.id = 'result';

    btn.addEventListener('click', function handlerClick() {
      if (body.contains(error1)) {
        body.removeChild(error1);
      }
      if (body.contains(error2)) {
        body.removeChild(error2);
      }
      if (body.contains(result)) {
        body.removeChild(result);
      }

      err = false;
      if (!input1.value.length || !isDecimalNumber(input1.value)) {
        body.insertBefore(error1, input1.nextSibling);
        err = true;
      }
      if (!input1.value.length || !isDecimalNumber(input2.value)) {
        body.insertBefore(error2, input2.nextSibling);
        err = true;
      }
      if (err) {
        return false;
      }

      result.textContent = parseFloat(input1.value) + parseFloat(input2.value);
      body.insertBefore(result, btn);
    });
  };
  window.addEventListener('load', main);
}());
