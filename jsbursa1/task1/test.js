window.addEventListener('load',function(){
    var startNewGame = document.querySelector('.startNewGame');
    var cells = document.querySelectorAll('.cell');
    var nextValue = 'x';
    startNewGame.addEventListener('click', function(){
        //alert('Начинаем новую игру!!!');
        clearCells(cells);
    });
    alert(nextValue);

    for(i = 0; i < cells.length; i++ ){
        var cell = cells.item(i);
        cell.addEventListener('click', function (event, nextValue){
            alert(nextValue);
            if(cell.classList.contains('x')){
                return;
            } else if(cell.classList.contains('o')){
                return;
            } else {
                cell.classList.add(nextValue);
                nextValue = nextValue == 'x'? 'y' : 'x';
            }
        });
    }
});
[21:19:34] dmytro.ja: [9:18:05 PM] Dmitry dd:    cell.classList.add(nextValue);

<<<
[21:19:56] dmytro.ja: [9:19:33 PM] Dmitry dd: nextValue

<<< равно undefiend
/**
 * Created by serg on 5/20/15.
 */
