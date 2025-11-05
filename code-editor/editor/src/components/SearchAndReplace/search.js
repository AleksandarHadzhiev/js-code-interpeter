class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.reader = document.getElementById('reader')
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
        searchBar.addEventListener('input', (event) => {
            const content = String(event.target.value)
            if (content.trim() == "") {
                const highlightedElements = document.getElementsByName('highlighted')
                highlightedElements.forEach((highlighted) => {
                    highlighted.replaceWith(highlighted.textContent)
                })
            }
            this._searchForContentInsideReader(content)
        })
        return searchBar
    }

    _searchForContentInsideReader(content) {
        const lines = this.reader.childNodes
        lines.forEach(line => {
            if (line.textContent.includes(content)) {
                this._searchTheWordsOfLineForContent(line, content)
            }
        });
    }

    _searchTheWordsOfLineForContent(line, content) {
        const words = line.childNodes
        const highlighted = `<span name="highlighted" style="background-color: lightyellow">${content}</span>`
        words.forEach((word) => {
            if (word.textContent.includes(content)) {
                let innerHTML = word.innerHTML
                innerHTML = String(innerHTML).replace(content, highlighted)
                word.innerHTML = innerHTML
            }
        })
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