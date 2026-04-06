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
        const info = this._buildInfo()
        searchContainer.appendChild(searchField)
        searchContainer.appendChild(info)
        return searchContainer
    }

    _buildSearchTextField() {
        const searchField = document.createElement('textarea')
        searchField.classList.add('input-field')
        searchField.setAttribute('id', 'search-field')
        searchField.setAttribute('placeholder', "Find")
        return searchField
    }

    _buildInfo() {
        const info = document.createElement('p')
        info.classList.add('info')
        info.setAttribute('id', 'info-highlighted-lines')
        info.textContent = "No results"
        return info
    }
}

customElements.define('custom-search-container', CustomSearchContainer)