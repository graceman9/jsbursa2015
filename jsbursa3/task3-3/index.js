/* global gameUrls */

/**
 * TODO: Провалился сценарий N2+N3. Либо неправильно выполнили POST, либо не вывели/вывели не то сообщение в N3
 */
(function appTicTacToe30() {
  'use strict';
  var main = function main() {
    var ws = new WebSocket(gameUrls.list);
    var startGameDIV = document.querySelector('.startGame');
    var mainGameDIV = document.querySelector('.mainGame');
    var existingGamesUL = document.querySelector('.existing-games');
    var createGameBTN = document.querySelector('.createGame');
    var startStatusMessageDIV = startGameDIV.querySelector('.status-message');
    var mainStatusMessageDIV = mainGameDIV.querySelector('.status-message');
    var yourId;
    var playerId;
    var game = {};
    var field = document.querySelector('.field');
    function generateField(count) {
      count = count || 10;
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
          cell.setAttribute('data-idx', idx.toString());
          idx++;
          row.appendChild(cell);
        }
      }
    }
    function handlerFieldClick(e) {
      var cell = e.target;
      if (!cell.classList.contains('cell') || cell.classList.contains('x') || cell.classList.contains('o')) {
        return false;
      }
      xhrRequest('POST', gameUrls.move, {move: cell.getAttribute('data-idx')}, [
          {'name': 'Game-ID', 'value': yourId},
          {'name': 'Player-ID', 'value': playerId}
        ],
        /**
         * @param {{win:string}} response
         */
        function hSuccess(response) {
          if (response.win) {
            setStatusText(mainStatusMessageDIV, 'Игра выиграна ' + response.win);
          }
          //cell.classList.add(); // TODO..............
        },
        function hFail() {
        });
      e.stopPropagation();
    }
    function disableButton(btn) {
      btn.setAttribute('disabled', 'disabled');
    }
    function enableButton(btn) {
      btn.removeAttribute('disabled');
    }
    function setStatusText(div, text) {
      div.textContent = text;
    }
    function xhrRequest(method, url, data, headers, successCallback, failCallback) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (headers) {
          headers.forEach(function hEach() {
            xhr.setRequestHeader(this.name, this.value);
          });
        }
        xhr.send(data);
        xhr.addEventListener('readystatechange', function hXHR() {
          if (xhr.readyState === xhr.DONE) {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
              successCallback.call(this, response);
            } else {
              failCallback.call(this, response, xhr);
            }
          }
        });
      } catch (e) {
        alert('Unexpected error occured.');
      }
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
    function startGame(playerId) {
      setStatusText(startStatusMessageDIV, 'Ожидаем начала игры');
      disableButton(createGameBTN);
      xhrRequest('POST', gameUrls.gameReady, {player: playerId, game: yourId}, null,
        function hSuccess(response) {
          game.side = response.side;
          startGameDIV.style.display = 'none';
          mainGameDIV.style.display = 'block';
          generateField();
        },
        function hFail(response, xhr) {
          if (xhr.status === 410) {
            setStatusText(startGameDIV, 'Ошибка старта игры: другой игрок не ответил');
          } else {
            setStatusText(startGameDIV, 'Неизвестная ошибка старта игры');
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
        console.warn(response.error);
      }
    }
    function handleBtnCreateGame() {
      disableButton(createGameBTN);
      xhrRequest('POST', gameUrls.newGame, null, null,
        /**
         * @param {{yourId:int}} response
         */
        function hSuccess(response) {
          yourId = response.yourId;
          ws.send(JSON.stringify({register: yourId}));
        },
        function hFail() {
          setStatusText(startStatusMessageDIV, 'Ошибка создания игры');
          enableButton(createGameBTN);
        });
    }
    function handleListItemClick(e) {
      if (e.target.nodeName === 'LI') {
        yourId = e.target.getAttribute('data-id');
        ws.send(JSON.stringify({register: yourId}));
      }
    }
    ws.addEventListener('message', handleListWS);
    createGameBTN.addEventListener('click', handleBtnCreateGame);
    existingGamesUL.addEventListener('click', handleListItemClick);
    field.addEventListener('click', handlerFieldClick);
  };
  window.addEventListener('load', main);
}());
