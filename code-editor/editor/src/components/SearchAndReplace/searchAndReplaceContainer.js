class SearchAndReplace extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.searchedContent = ""
        this.appendChild(this._buildContainer())
    }

    _buildContainer() {
        const container = document.createElement('div')
        return container
    }
}

customElements.define('customer-search-and-replace', SearchAndReplace)