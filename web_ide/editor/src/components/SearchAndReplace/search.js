export default class CustomSearchContainer {
    constructor() {
    }

    buildSearchContainer() {
        const searchContainer = document.createElement('div')
        searchContainer.setAttribute('id', 'search-container')
        searchContainer.className = 'search-container'
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
