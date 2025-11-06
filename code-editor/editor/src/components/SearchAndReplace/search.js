class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.specialCharaters = ['(', ')', '[', ']', '{', '}']
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
            this.foundElements = []
            const content = String(event.target.value)
            const highlightedElements = document.getElementsByName('highlighted')
            while (highlightedElements.length > 0) {
                highlightedElements[0].replaceWith(highlightedElements[0].textContent)
            }
            if (content.trim() != "")
                this._searchForContentInsideReader(content.toLowerCase())
            this._updateInfo()
        })
        return searchBar
    }

    _updateInfo() {
        const info = document.getElementById('info')
        info.textContent = `${this.foundElements.length > 0 ? "1" : '0'} : ${this.foundElements.length}`;
    }

    _searchForContentInsideReader(content) {
        const lines = this.reader.childNodes
        lines.forEach((line, index) => {
            if (line.textContent.includes(content)) {
                this._searchTheWordsOfLineForContent(line, content, index)
            }
        });
    }

    _searchTheWordsOfLineForContent(line, content, lineIndex) {
        const words = line.childNodes
        words.forEach((word, index) => {
            const wordContent = String(word.textContent).toLowerCase()
            if (wordContent.includes(content)) {
                this._updateInnerHTMLForWord(content, wordContent, word, index, lineIndex)
            }
        })
    }

    _updateInnerHTMLForWord(content, wordContent, word, wordIndex, lineIndex) {
        const appearences = this._findHowManyTimesTheContentAppearsInAWord(content, wordContent)
        let innerHtml = this._generateNewHTML(word, appearences, content, wordIndex, lineIndex)
        word.innerHTML = innerHtml
    }

    _findHowManyTimesTheContentAppearsInAWord(content, word) {
        let regex = null
        if (this.specialCharaters.includes(content))
            regex = new RegExp(`${`\\`}${content} `, 'g')
        else regex = new RegExp(content, 'g')
        if (content == word) { return [0] }
        const matches = String(word).matchAll(regex)
        const indexes = []
        matches.forEach((match) => {
            indexes.push(match.index)
        })
        return indexes
    }

    _generateNewHTML(word, appearences, content, wordIndex, lineIndex) {
        let oldText = String(word.innerHTML)
        let innerHtml = ""
        appearences.forEach((appearence, index) => {
            let initialText = this._generateInitialText(appearences, appearence, content, oldText, index)
            const replaceText = `<span id="${lineIndex}-${wordIndex}-${index}" name= "highlighted" style="background-color: lightyellow">${oldText.substring(appearence, appearence + content.length)}</span>`
            this.foundElements.push(`${lineIndex}-${wordIndex}-${index}`)
            innerHtml += `${initialText}${replaceText}`
        });
        oldText = oldText.substring(appearences[appearences.length - 1] + content.length, oldText.length)
        innerHtml += oldText
        return innerHtml
    }

    _generateInitialText(appearences, appearence, content, oldText, index) {
        if (index == 0)
            return oldText.substring(0, appearence)
        else return oldText.substring(appearences[index - 1] + content.length, appearence)
    }

    _buildFoundElementsContainer() {
        const container = document.createElement('div')
        container.classList.add('found-elements')
        container.appendChild(this._buildInfoElement())
        return container
    }

    _buildInfoElement() {
        const info = document.createElement('p')
        info.setAttribute('id', 'info')
        info.classList.add('info')
        info.innerHTML = `0 : ${this.foundElements.length} `
        return info
    }
}

customElements.define('custom-search', Search)