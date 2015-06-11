var main = function(){
    var theX = 'x',
        theO = 'o';
    var firstTurn = theX;
    var prevTurn = null;
    var inverseTurn = function(turn) {
        if (turn !== theX && turn !== theO) {
            return null;
        }
        return turn === theX ? theO : theX;
    };
    var wmsg = document.querySelector('.winner-message');
    var gameOver = false;
    var cells = document.querySelectorAll('.field .cell');
    var btnStart = document.querySelector('.startNewGame');
    btnStart.addEventListener('click', function(){
        wmsg.innerHTML = '';
        //firstTurn = inverseTurn(firstTurn);
        prevTurn = null;
        [].forEach.call(cells, function(cell){
            cell.classList.remove(theO);
            cell.classList.remove(theX);
        });
        gameOver = false;
    });

    document.querySelector('.field').addEventListener('click', function(e){
        if (gameOver) {
            return;
        }
        if (e.target && e.target.classList.contains('cell')) {
            var cell = e.target;
            if (!cell.classList.contains(theO) && !cell.classList.contains(theX)) {
                var turn = !prevTurn ? firstTurn : inverseTurn(prevTurn);
                prevTurn = turn;
                cell.classList.add(turn);
                var result = getWinner();
                if (result) {
                    wmsg.innerHTML = turn === theX ? "Крестик победил" : "Нолик победил";
                    gameOver = true;
                }
            }
        }
        e.stopPropagation();
    });

};
window.addEventListener('load', main);