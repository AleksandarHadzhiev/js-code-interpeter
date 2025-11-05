class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        const container = this._buildMainContainer()
        this.appendChild(container)
    }

    _buildMainContainer() {
        const mainContainer = document.createElement('div')
        mainContainer.classList.add("search-container")
        const searchBar = this._buildSearchBar()
        const foundElementsContainer = this._buildFoundElementsContainer()
        mainContainer.appendChild(searchBar)
        mainContainer.appendChild(foundElementsContainer)
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

    _buildFoundElementsContainer() {
        const container = document.createElement('div')
        container.classList.add('found-elements')
        container.appendChild(this._buildInfoElement())
        return container
    }

    _buildInfoElement() {
        const info = document.createElement('p')
        info.classList.add('info')
        info.innerHTML = `0 : ${this.foundElements.length}`
        return info
    }
}

customElements.define('custom-search', Search)