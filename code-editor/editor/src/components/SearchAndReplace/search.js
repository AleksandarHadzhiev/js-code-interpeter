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
            const highlightedElements = document.getElementsByName('highlighted')
            while (highlightedElements.length > 0) {
                highlightedElements[0].replaceWith(highlightedElements[0].textContent)
            }
            if (content.trim() != "")
                this._searchForContentInsideReader(content.toLowerCase())
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
        words.forEach((word) => {
            const wordContent = String(word.textContent).toLowerCase()
            if (wordContent.includes(content)) {
                this._updateInnerHTMLForWord(content, wordContent, word)
            }
        })
    }

    _updateInnerHTMLForWord(content, wordContent, word) {
        const appearences = this._findHowManyTimesTheContentAppearsInAWord(content, wordContent)
        let innerHtml = this._generateNewHTML(word, appearences, content)
        word.innerHTML = innerHtml
    }

    _findHowManyTimesTheContentAppearsInAWord(content, word) {
        const matches = String(word).matchAll(content)
        const indexes = []
        matches.forEach((match) => {
            indexes.push(match.index)
        })
        return indexes
    }

    _generateNewHTML(word, appearences, content) {
        let oldText = String(word.innerHTML)
        let innerHtml = ""
        appearences.forEach((appearence, index) => {
            let initialText = this._generateInitialText(appearences, appearence, content, oldText, index)
            const replaceText = `<span name="highlighted" style="background-color: lightyellow">${oldText.substring(appearence, appearence + content.length)}</span>`
            innerHtml += `${initialText}${replaceText}`
        });
        oldText = oldText.substring(appearences[appearences.length - 1] + 1, oldText.length)
        innerHtml += oldText
        return innerHtml
    }

    _generateInitialText(appearences, appearence, content, oldText, index) {
        if (index == 0)
            return oldText.substring(0, appearence)
        else if (index == appearences.length - 1) return oldText.substring(appearence + content.length, oldText.length)
        else return oldText.substring(appearence + content.length, appearences[index + 1])
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