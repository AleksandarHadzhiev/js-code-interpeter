class Search extends HTMLElement {
    constructor() {
        super()
        const container = this._buildMainContainer()
        this.appendChild(container)
    }

    _buildMainContainer() {
        const mainContainer = document.createElement('div')
        mainContainer.classList.add("search-container")
        const searchBar = this._buildSearchBar()
        mainContainer.appendChild(searchBar)
        return mainContainer
    }

    _buildSearchBar() {
        const searchBar = document.createElement('input')
        searchBar.classList.add('search-bar')
        searchBar.placeholder = "Search for..."
        searchBar.addEventListener('input', () => {
            console.log('writing')
        })
        return searchBar
    }
}

customElements.define('custom-search', Search)