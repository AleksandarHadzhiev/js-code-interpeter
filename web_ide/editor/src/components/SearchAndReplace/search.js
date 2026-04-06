class CustomSearchContainer extends HTMLElement {
    constructor() {
        super()
        const container = this._buildSearchContainer()
        this.appendChild(container)
    }

    _buildSearchContainer() {
        const searchContainer = document.createElement('div')
        searchContainer.classList.add('hidden')
        searchContainer.setAttribute('id', 'search-container')
        const searchField = this._buildSearchTextField()
        searchContainer.appendChild(searchField)
        return searchContainer
    }

    _buildSearchTextField() {
        const searchField = document.createElement('input')
        searchField.classList.add('input-field')
        searchField.setAttribute('id', 'search-field')
        searchField.setAttribute('placeholder', "Find")
        return searchField
    }
}

customElements.define('custom-search-container', CustomSearchContainer)