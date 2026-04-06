class CustomSearchContainer extends HTMLElement {
    constructor() {
        super()
        const container = this._buildSearchContainer()
        this.appendChild(container)
    }

    _buildSearchContainer() {
        const searchContainer = document.createElement('div')
        searchContainer.classList.add('hidden')
        return searchContainer
    }
}

customElements.define('custom-search-container', CustomSearchContainer)