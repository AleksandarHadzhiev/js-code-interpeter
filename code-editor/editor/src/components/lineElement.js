import HighlightForSingleLineSearch from "../classes/highlighters/HighlighterForSingleLineSearch.js"

export default class CustomLineELement extends HTMLElement {
    constructor(text, index) {
        super()
        this.index = index
        this.searchBar = document.getElementById('search-field')
        this.searchComponent = document.getElementById('search-component')
        this.classList.add('line', 'content-format')
        this.text = text.toLowerCase()
        this.textContent = text.toLowerCase()
        this.searchBar.addEventListener('input', (event) => {
            this.content = event.target.value.toLowerCase()
            if (this.content != "") {
                this._highlightAppearencesOnLine()
            }
            else {
                this.replaceChildren()
            }
        })
    }

    _highlightAppearencesOnLine() {
        const lines = String(this.content).split('\n');
        if (lines.length == 1) {
            this.replaceChildren()
            new HighlightForSingleLineSearch(this.text, this, this.content).highlightAppearencesOnLine()
        }
    }
}

customElements.define('custom-line', CustomLineELement)