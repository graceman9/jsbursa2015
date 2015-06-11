(function appTodo() {
  'use strict';

  var state = {
    items: []
  };

  var data = localStorage.getItem('tasks');
  if (data) {
    state = JSON.parse(data);
  }

  window.addEventListener('load', function handlerLoad() {
    var button = document.querySelector('button');
    var list = document.querySelector('ul');
    var input = document.querySelector('input');

    function update() {
      var i;
      var el;
      list.innerHTML = '';
      state.items.sort(function helperLexicographicSort(a, b) { return a.localeCompare(b); });
      for (i = 0; i < state.items.length; i++) {
        el = document.createElement('li');
        el.textContent = state.items[i];
        list.appendChild(el);
      }
    }
    update();

    function add() {
      var l;
      if (!input.value.length) {
        return false;
      }
      l = input.value;
      state.items.push(l);
      update();
      localStorage.setItem('tasks', JSON.stringify(state));
      input.value = '';
      return true;
    }

    button.addEventListener('click', function handlerClick() {
      return add();
    });

    input.addEventListener('keyup', function handlerKeyup(e) {
      if (e.keyCode === 13) {
        return add();
      }
    });
  });
}());
