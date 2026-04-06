class CustomSearchContainer extends HTMLElement {
    constructor() {
        super()
        const container = this._buildSearchContainer()
        this.appendChild(container)
    }

    _buildSearchContainer() {
        const searchContainer = document.createElement('div')
        searchContainer.classList.add('hidden')
        searchContainer.setAttribute('id', 'text-search')
        return searchContainer
    }
}

customElements.define('custom-search-container', CustomSearchContainer)