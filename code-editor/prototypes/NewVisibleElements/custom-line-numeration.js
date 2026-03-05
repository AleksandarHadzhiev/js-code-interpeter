export default class CustomLineNumeration extends HTMLElement {
    constructor(index) {
        super()
        this.classList.add('line')
        this.index = index
        this.textContent = index + 1
    }
}

customElements.define('custom-line-numeration', CustomLineNumeration)