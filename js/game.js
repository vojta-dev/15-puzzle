import Square from './square.js';

export default class Game {
  #squares = [];

  constructor(element, buttonElement) {
    let HTML = '';

    for (let i = 1; i < 16; i++) {
      HTML += /* html */ `<div class="square">${i}</div>`;
    }

    HTML += /* html */ `<div class="square empty"></div>`;

    element.innerHTML = HTML;

    const squareElements = [...element.getElementsByClassName('square')];

    squareElements.forEach((element, index) => {
      const isEmpty = [...element.classList].includes('empty');
      const square = new Square(element, isEmpty ? null : index + 1);
      this.#squares.push(square);
    });

    element.addEventListener('click', (event) => {
      const square = this.#squares.find((square) => square.getElement() === event.target);

      if (square !== undefined) this.#handleClick(square);
    });

    buttonElement.addEventListener('click', () => this.#shuffle());
  }

  #getEmptySquare() {
    return this.#squares.find((square) => square.isEmpty());
  }

  #handleClick(square) {
    if (this.#isValidMove(square)) {
      this.#getEmptySquare().setNumber(square.getNumber());
      square.removeNumber();
      this.#updateGameOverColors();
    }
  }

  #isValidMove(square) {
    if (square.isEmpty()) return false;

    const squareIndex = square.getIndex();
    const emptySquareIndex = this.#getEmptySquare().getIndex();

    const sameColumn = squareIndex % 4 === emptySquareIndex % 4;
    const sameRow = Math.floor(squareIndex / 4) === Math.floor(emptySquareIndex / 4);

    const isUp = squareIndex - 4 === emptySquareIndex;
    const isDown = squareIndex + 4 === emptySquareIndex;
    const isRight = squareIndex + 1 === emptySquareIndex;
    const isLeft = squareIndex - 1 === emptySquareIndex;

    return (isUp || isDown || isRight || isLeft) && (sameRow || sameColumn);
  }

  // terrible name :(
  #updateGameOverColors() {
    const isGameOver = this.#squares
      .slice(0, -1) // last square should be empty
      .every((square, index) => {
        return square.getNumber() === index + 1;
      });

    this.#squares.forEach((square) => {
      square.getElement().style.backgroundColor = isGameOver ? 'lime' : '';
    });
  }

  #shuffle() {
    const squares = [...this.#squares];

    // https://web.archive.org/web/20200614210106/https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
    const isSolvable = () => {
      let inversions = 0;

      const emptySquareRowIndex = Math.floor(this.#getEmptySquare().getIndex() / 4);

      for (let i = 0; i < squares.length; i++) {
        const squareNumber1 = squares[i].getNumber();

        for (let j = i + 1; j < squares.length; j++) {
          const squareNumber2 = squares[j].getNumber();

          if (squareNumber1 !== null && squareNumber2 !== null && squareNumber1 > squareNumber2) {
            inversions++;
          }
        }
      }

      return emptySquareRowIndex % 2 !== inversions % 2;
    };

    const shuffleRandomly = () => {
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      // shuffle numbers
      for (let i = numbers.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
      }

      // apply shuffled numbers
      numbers.forEach((number, index) => {
        const square = squares[index];

        if (number === 0) square.removeNumber();
        else square.setNumber(number);
      });
    };

    while (true) {
      shuffleRandomly();

      if (isSolvable()) {
        this.#updateGameOverColors();
        return;
      }
    }
  }
}
