/* global getWinner */
(function appTicTacToe() {
  'use strict';
  window.addEventListener('load', function handlerLoad() {
    var errmsg = document.querySelector('.error-message');
    var winmsg = document.querySelector('.winner-message');
    var startGame = document.querySelector('.startGame');
    var mainGame = document.querySelector('.mainGame');
    var field = document.querySelector('.field');
    var input = document.querySelector('input');
    var btnG = document.querySelector('button.generateField');
    var btnS = document.querySelector('button.startNewGame');
    var X = 'x';
    var O = 'o';
    var turn = X;
    var data;
    var state = {};
    var saveState = function saveState() {
      localStorage.setItem('game', JSON.stringify(state));
    };
    var toggleTurn = function handlerToggleTurn() {
      turn = turn === X ? O : X;
    };

    var generateField = function generateField(count) {
      var i;
      var j;
      var row;
      var cell;
      var idx = 1;
      for (i = 0; i < count; i++) {
        row = document.createElement('div');
        row.classList.add('row');
        field.appendChild(row);
        for (j = 0; j < count; j++) {
          cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('data-idx', idx);
          idx++;
          row.appendChild(cell);
        }
      }
    };

    var checkGameState = function checkGameState() {
      var winner;
      winner = getWinner();
      if (winner === X) {
        winmsg.textContent = 'Крестик победил';
      } else if (winner === O) {
        winmsg.textContent = 'Нолик победил';
      } else {
        // nothing, game continue
      }
    };

    var handlerFieldClick = function handlerFieldClick(e) {
      var cell = e.target;
      if (!cell.classList.contains('cell') || cell.classList.contains(X) || cell.classList.contains(O) || winmsg.textContent.length) {
        return false;
      }

      if (getWinner()) {
        return false;
      }

      cell.classList.add(turn);
      toggleTurn();
      if (!state.steps) {
        state.steps = [];
      }
      state.steps.push(cell.getAttribute('data-idx'));
      saveState();

      checkGameState();

      e.stopPropagation();
    };

    var handlerButtonGenerateClick = function handlerButtonGenerateClick() {
      var v = input.value;
      errmsg.textContent = '';
      if (!v.length || isNaN(v) || v < 5 || v > 15 || v.indexOf('.') !== -1) {
        errmsg.textContent = 'Вы ввели некорректное число';
      } else {
        mainGame.style.display = 'block';
        startGame.style.display = 'none';

        // generate field
        generateField(v);
        state.count = v;
        saveState();
      }
    };

    var handlerButtonStartClick = function handlerButtonStartClick() {
      var rows = document.querySelectorAll('.row');
      winmsg.textContent = '';
      // console.log(rows);
      [].forEach.call(rows, function forEachCell(element) {
        element.parentNode.removeChild(element);
      });
      state = {};
      saveState();
      turn = X;

      mainGame.style.display = 'none';
      startGame.style.display = 'block';
    };

    errmsg.textContent = 'Восстановить игру не удалось. Хотите создать новую? Введиче размер поля (целое число) и нажмите кнопку.';
    data = localStorage.getItem('game');
    state = data ? JSON.parse(data) : {};
    if (state) {
      if (state.count) {
        input.value = state.count;
        handlerButtonGenerateClick();
      }

      if (state.steps && state.steps.length) {
        state.steps.forEach(function handlerForEachSteps(element) {
          var cell;
          if (getWinner()) {
            return false;
          }
          cell = field.querySelector('.cell[data-idx="' + element + '"]');
          cell.classList.add(turn);
          toggleTurn();
          checkGameState();
        });
      }
    }

    field.addEventListener('click', handlerFieldClick);
    btnG.addEventListener('click', handlerButtonGenerateClick);
    btnS.addEventListener('click', handlerButtonStartClick);
  });
}());
