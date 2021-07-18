export default class Square {
  #element = null;
  #number = null;

  constructor(element, number) {
    this.#element = element;
    this.#number = number;
  }

  getNumber() {
    return this.#number;
  }
  setNumber(newNumber) {
    this.#number = newNumber;
    this.#element.innerText = newNumber;
    this.#element.classList.remove('empty');
  }
  removeNumber() {
    this.#number = null;
    this.#element.innerText = '';
    this.#element.classList.add('empty');
  }

  getElement() {
    return this.#element;
  }

  getIndex() {
    return [...this.#element.parentNode.children].indexOf(this.#element);
  }

  isEmpty() {
    return this.#number === null;
  }
}
