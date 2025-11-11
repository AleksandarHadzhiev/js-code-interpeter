export class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.currentPosition = 0
        this.prevElement = null
        this.reader = document.getElementById('highlighter')
        this._buildMainContainer()
    }

    _buildMainContainer() {
        this.classList.add("search-container")
        const searchBar = this._buildSearchBar()
        const foundElementsContainer = this._buildFoundElementsContainer()
        this.appendChild(searchBar)
        this.appendChild(foundElementsContainer)
    }

    _buildSearchBar() {
        const searchBar = document.createElement('textarea')
        searchBar.classList.add('search-bar')
        searchBar.setAttribute('id', 'search-field')
        searchBar.placeholder = "Search for..."
        searchBar.addEventListener('input', (event) => {
            this._highlightElements(event)
        })
        return searchBar
    }

    _highlightElements(event) {
        this.currentPosition = 0
        const content = String(event.target.value)
        this._cleanUpOldHighlights()
        console.log(this.foundElements)
        if (content.trim() != "")
            this._searchForContentInsideReader(content.toLowerCase())
        this._updateInfo()
    }

    _cleanUpOldHighlights() {
        this.reader.innerHTML = this.reader.textContent
        this.foundElements = []
        this.prevElement = null
    }

    _updateInfo() {
        const switcher = document.getElementById('position-switcher')
        const info = document.getElementById('info')
        if (this.foundElements.length > 0) {
            switcher.classList.remove('hidden')
            info.textContent = `${this.currentPosition + 1} : ${this.foundElements.length}`;
        }
        else info.textContent = `No elements found`;
    }

    _searchForContentInsideReader(content) {
        const textContent = this.reader.textContent.toLowerCase()
        this.reader.innerHTML = textContent
        const matches = textContent.matchAll(this._reformContentToMatchRegexConditions(content))
        this.reader.innerHTML = this._createHighlightedHTML(content, matches, textContent)
    }

    _reformContentToMatchRegexConditions(content) {
        let newContent = String(content).replaceAll('(', '\\(')
        newContent = String(newContent).replaceAll(')', '\\)')
        newContent = String(newContent).replaceAll('[', '\\[')
        newContent = String(newContent).replaceAll(']', '\\]')
        newContent = String(newContent).replaceAll('{', '\\{')
        newContent = String(newContent).replaceAll('}', '\\}')
        return newContent
    }

    _createHighlightedHTML(content, matches, textContent) {
        let newHTML = ""
        let index = 0
        matches.forEach(match => {
            console.log(match.index)
            newHTML += this._genHTML(content, match.index, index)
            index = match.index + content.length
        });
        console.log(index, textContent.length)
        const lastPartOfContent = this.reader.textContent.substring(index, textContent.length)
        const ending = this._generateEnding(lastPartOfContent)
        console.log(ending)
        newHTML += ending
        // console.log(newHTML)
        return newHTML
    }

    _generateEnding(content) {
        console.log(content)
        const lines = String(content).split('\n')
        let ending = ""
        lines.forEach((line) => {
            console.log(line.length)
            if (line === "")
                ending += `<br>`
            else ending += `<span style="font-size: 24px; min-height: 28.8px; white-space: pre;">${line}</span>`
        });
        return ending
    }

    _genHTML(content, matchIndex, index) {
        const beginning = `<span style="font-size: 24px; min-height: 28.8px; white-space: pre;">${this.reader.textContent.substring(index, matchIndex)}</span>`
        const replaceText = this.reader.textContent.substring(matchIndex, matchIndex + content.length)
        const reaplaceHTML = `<span id="${matchIndex}-${index}" name="highlighted" class="highlighted">${replaceText}</span>`
        this.foundElements.push(`${matchIndex}-${index}`)
        return `${beginning}${reaplaceHTML}`
    }

    _buildFoundElementsContainer() {
        const container = document.createElement('div')
        container.classList.add('found-elements')
        container.appendChild(this._buildInfoElement())
        container.appendChild(this._buildSwitch())
        return container
    }

    _buildInfoElement() {
        const info = document.createElement('p')
        info.setAttribute('id', 'info')
        info.classList.add('info')
        return info
    }

    _buildSwitch() {
        const switchContainer = document.createElement('div')
        switchContainer.setAttribute('id', 'position-switcher')
        switchContainer.classList.add('switch')
        switchContainer.classList.add('hidden')
        const goPrevious = this._buildButtonForAction("previous")
        const goNext = this._buildButtonForAction("next")
        switchContainer.appendChild(goPrevious)
        switchContainer.appendChild(goNext)
        return switchContainer
    }

    _buildButtonForAction(buttonAction) {
        const button = document.createElement('button')
        button.textContent = buttonAction == "previous" ? "<" : ">"
        button.classList.add('position-switching-button')
        button.addEventListener('click', () => {
            this._handleChangeInShownHighlightedElement(buttonAction)
        })
        return button
    }

    _handleChangeInShownHighlightedElement(buttonAction) {
        if (this.prevElement) this.prevElement.classList.remove('currently-selected')
        this._updatePositionBasedOnAction(buttonAction)
        const element = document.getElementById(this.foundElements[this.currentPosition])
        element.classList.add('currently-selected')
        this._updateScrollPosition(element)
        this._updateInfo()
        this.prevElement = element
    }

    _updateScrollPosition(element) {
        element.scrollIntoView()
        // ==> readerPosFromTop === currentHightlightedElement.highlighterElement.scrollTop
        const readerScrollFromTOp = element.parentElement.scrollTop
        document.getElementById('writer').scrollTop = readerScrollFromTOp
        document.getElementById('reader').scrollTop = readerScrollFromTOp
        document.getElementById('highlighter').scrollTop = readerScrollFromTOp
    }

    _updatePositionBasedOnAction(action) {
        if (action == "previous") this._updateCurrentPositionTowardsPrev()
        else this._updateCurrentPositionTowardsNext()
    }

    _updateCurrentPositionTowardsNext() {
        if (this.currentPosition == this.foundElements.length - 1) {
            this.currentPosition = 0;
        }
        else {
            this.currentPosition += 1;
        }
    }

    _updateCurrentPositionTowardsPrev() {
        if (this.currentPosition == 0) {
            this.currentPosition = this.foundElements.length - 1;
        }
        else {
            this.currentPosition -= 1;
        }
    }
}

customElements.define('custom-search', Search)
