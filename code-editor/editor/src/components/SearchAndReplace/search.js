class Search extends HTMLElement {
    constructor() {
        super()
        const container = this._buildMainContainer()
        this.appendChild(container)
    }

    _buildMainContainer() {
        const mainContainer = document.createElement('div')
        mainContainer.classList.add("search-container")
        return mainContainer
    }
}

customElements.define('custom-search', Search)