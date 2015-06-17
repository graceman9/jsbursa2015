/* global gameUrls */
(function appTicTacToe30() {
  'use strict';
  var main = function main() {
    var ws = new WebSocket(gameUrls.list);
    var startGameDIV = document.querySelector('.startGame');
    var mainGameDIV = document.querySelector('.mainGame');
    var existingGamesUL = document.querySelector('.existing-games');
    var createGameBTN = document.querySelector('.createGame');
    var newGameBTN = document.querySelector('.newGame');
    var startStatusMessageDIV = startGameDIV.querySelector('.status-message');
    var mainStatusMessageDIV = mainGameDIV.querySelector('.status-message');
    var yourId;
    var playerId;
    var game = {};
    var step = 'x';
    var yourTurn = false;
    var gameOver = false;
    var field = document.querySelector('.field');

    function setStatusText(div, text) {
      div.textContent = text;
    }
    function generateField(count) {
      var cnt = count || 10;
      var i;
      var j;
      var row;
      var cell;
      var idx = 1;
      for (i = 0; i < cnt; i++) {
        row = document.createElement('div');
        row.classList.add('row');
        field.appendChild(row);
        for (j = 0; j < cnt; j++) {
          cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('data-idx', idx.toString());
          idx++;
          row.appendChild(cell);
        }
      }
    }
    function xhrRequest(method, url, data, headers, successCallback, failCallback) {
      var xhr;
      try {
        xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (headers) {
          headers.forEach(function hEach(item) {
            xhr.setRequestHeader(item.name, item.value);
          });
        }
        xhr.send(JSON.stringify(data));
        xhr.addEventListener('readystatechange', function hXHR() {
          var response;
          if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
              response = JSON.parse(xhr.responseText);
              successCallback.call(this, xhr, response);
            } else {
              failCallback.call(this, xhr);
            }
          }
        });
      } catch (e) {
        // console.error('Unexpected error occurred.', e);
      }
    }
    function changeTurn() {
      step = step === 'x' ? 'o' : 'x';
      yourTurn = !yourTurn;
    }
    function doStep(cell) {
      cell.classList.add(step);
      changeTurn();
    }
    function doGameOver() {
      gameOver = true;
      newGameBTN.textContent = 'Новая игра';
      newGameBTN.classList.add('new');
    }
    function waitForNextStep() {
      if (gameOver) {
        return false;
      }
      xhrRequest('GET', gameUrls.move, null,
        [
          {'name': 'Game-ID', 'value': yourId},
          {'name': 'Player-ID', 'value': playerId}
        ],
        function hSuccess(xhr, response) {
          if (response.move) {
            doStep(field.querySelector('.cell[data-idx="' + response.move + '"]'));
            if (!yourTurn) {
              waitForNextStep();
            }
          }
          if (response.win) {
            setStatusText(mainStatusMessageDIV, response.win);
            doGameOver();
          }
        },
        function hFail() {
          waitForNextStep();
        });
    }

    function gamePrintError(xhr) {
      var response = null;
      if (xhr.responseText.length) {
        response = JSON.parse(xhr.responseText);
      }
      if (response && response.message) {
        setStatusText(mainStatusMessageDIV, response.message);
      } else {
        setStatusText(mainStatusMessageDIV, 'Неизвестная ошибка');
        doGameOver();
      }
    }
    function handlerFieldClick(e) {
      var cell = e.target;
      if (!cell.classList.contains('cell') || cell.classList.contains('x') || cell.classList.contains('o')) {
        return false;
      }
      xhrRequest('POST', gameUrls.move, {move: cell.getAttribute('data-idx')},
        [
          {'name': 'Content-Type', 'value': 'application/json'},
          {'name': 'Game-ID', 'value': yourId},
          {'name': 'Player-ID', 'value': playerId}
        ],
        /**
         * @param {object} xhr
         * @param {{win:string}} response
         */
        function hSuccess(xhr, response) {
          if (response.win) {
            setStatusText(mainStatusMessageDIV, response.win);
            doGameOver();
          }
          doStep(cell);
          if (!yourTurn) {
            waitForNextStep();
          }
        },
        function hFail(xhr) {
          gamePrintError(xhr);
        });
      e.stopPropagation();
    }
    function disableButton(btn) {
      btn.setAttribute('disabled', 'disabled');
    }
    function enableButton(btn) {
      btn.removeAttribute('disabled');
    }
    function showGameField() {
      startGameDIV.style.display = 'none';
      mainGameDIV.style.display = 'block';
    }
    function hideGameField() {
      startGameDIV.style.display = 'block';
      mainGameDIV.style.display = 'none';
      enableButton(createGameBTN);
    }
    function addGame(id) {
      var li = document.createElement('li');
      li.textContent = id;
      li.setAttribute('data-id', id);
      existingGamesUL.appendChild(li);
    }
    function removeGame(id) {
      var li = existingGamesUL.querySelector('li[data-id="' + id + '"]');
      li.parentNode.removeChild(li);
    }
    function startGame(thePlayerId) {
      setStatusText(startStatusMessageDIV, 'Ожидаем начала игры');
      disableButton(createGameBTN);
      xhrRequest('POST', gameUrls.gameReady, {player: thePlayerId, game: yourId},
        [
          {'name': 'Content-Type', 'value': 'application/json'}
        ],
        function hSuccess(xhr, response) {
          game.side = response.side;
          showGameField();
          generateField();
          if (!yourTurn) {
            waitForNextStep();
          }
        },
        function hFail(xhr) {
          if (xhr.status === 410) {
            setStatusText(startStatusMessageDIV, 'Ошибка старта игры: другой игрок не ответил');
          } else {
            setStatusText(startStatusMessageDIV, 'Неизвестная ошибка старта игры');
          }
        });
    }
    function handleListWS(e) {
      var response = JSON.parse(e.data);
      if (response.action === 'add') {
        addGame(response.id);
      } else if (response.action === 'remove') {
        removeGame(response.id);
      } else if (response.action === 'startGame') {
        playerId = response.id;
        startGame(playerId);
      } else {
        // console.warn(response.error);
      }
    }
    function handleBtnCreateGame() {
      disableButton(createGameBTN);
      setStatusText(startStatusMessageDIV, 'Ожидаем начала игры');
      xhrRequest('POST', gameUrls.newGame, null, null,
        /**
         * @param {object} xhr
         * @param {{yourId:int}} response
         */
        function hSuccess(xhr, response) {
          yourId = response.yourId;
          ws.send(JSON.stringify({register: yourId}));
          yourTurn = true;
        },
        function hFail() {
          setStatusText(startStatusMessageDIV, 'Ошибка создания игры');
          enableButton(createGameBTN);
        });
    }
    function handleBtnNewGame() {
      hideGameField();
      if (newGameBTN.classList.contains('new')) {
        // hideGameField();
      } else {
        xhrRequest('PUT', gameUrls.surrender, null,
          [
            {'name': 'Game-ID', 'value': yourId},
            {'name': 'Player-ID', 'value': playerId}
          ],
          function hSuccess() {
            // hideGameField();
          },
          function hFail(xhr) {
            gamePrintError(xhr);
          });
      }
    }
    function handleListItemClick(e) {
      if (e.target.nodeName === 'LI') {
        yourId = e.target.getAttribute('data-id');
        ws.send(JSON.stringify({register: yourId}));
      }
    }
    ws.addEventListener('message', handleListWS);
    createGameBTN.addEventListener('click', handleBtnCreateGame);
    newGameBTN.addEventListener('click', handleBtnNewGame);
    existingGamesUL.addEventListener('click', handleListItemClick);
    field.addEventListener('click', handlerFieldClick);
  };
  window.addEventListener('load', main);
}());
