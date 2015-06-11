function getWinner() {
  function getCharForCell(cell) {
    if (cell.classList.contains('x')) {
      return 'x';
    }
    if (cell.classList.contains('o')) {
      return 'o';
    }
    return ' ';
  }

  var rows = document.querySelectorAll('.row');
  var searchString = '|';
  var fieldSize = rows.length;
  var i;
  var j;
  for (i = 0; i < fieldSize; i++) {
    for (j = 0; j < fieldSize; j++) {
      searchString += getCharForCell(rows[i].children[j]);
    }
    searchString += '|';
  }

  searchString +='|||';
  for (i = 0; i < fieldSize; i++) {
    for (j = 0; j < fieldSize; j++) {
      searchString += getCharForCell(rows[j].children[i]);
    }
    searchString += '|';
  }

  searchString +='|||';
  for (i = 4; i < fieldSize; i++) {
    for (j = 0; i - j >=0; j++) {
      searchString += getCharForCell(rows[i - j].children[j]);
    }
    searchString += '|';
  }

  searchString +='|||';
  for (i = fieldSize - 5; i >=0; i--) {
    for (j = 0; i + j < fieldSize; j++) {
      searchString += getCharForCell(rows[i + j].children[j]);
    }
    searchString += '|';
  }

  if (searchString.indexOf('xxxxx') !== -1) {
    return 'x';
  }

  if (searchString.indexOf('ooooo') !== -1) {
    return 'o';
  }

  return;
}
