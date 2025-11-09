class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.mapOfFoundElements = new Map()
        this.currentPosition = 0
        this.prevElement = null
        this.reader = document.getElementById('highlighter')
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
        const searchBar = document.createElement('textarea')
        searchBar.classList.add('search-bar')
        searchBar.placeholder = "Search for..."
        searchBar.addEventListener('input', (event) => {
            this.currentPosition = 0
            const content = String(event.target.value)
            const highlightedElements = document.getElementsByName('highlighted')
            while (highlightedElements.length > 0) {
                highlightedElements[0].replaceWith(highlightedElements[0].innerHTML)
                this.foundElements = []
                this.prevElement = null
            }
            if (content.trim() != "")
                this._searchForContentInsideReader(content.toLowerCase())
            this._updateInfo()
        })
        return searchBar
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
        let newHTML = ""
        let index = 0
        let oldHTML = this.reader.innerHTML
        matches.forEach(match => {
            newHTML += this._genHTML(content, match.index, index)
            index = match.index + content.length
        });
        const lastPartOfContent = this.reader.textContent.substring(index, textContent.length)
        newHTML += lastPartOfContent
        console.log(newHTML)
        this.reader.innerHTML = newHTML
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

    _genHTML(content, matchIndex, index) {
        const beginning = this.reader.textContent.substring(index, matchIndex)
        const replaceText = this.reader.textContent.substring(matchIndex, matchIndex + content.length)
        const reaplaceHTML = `<span style="background-color: lightyellow; font-size: 24px; min-height:28.8px; white-space: pre;">${replaceText}</span>`
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
            if (this.prevElement) this.prevElement.classList.remove('currently-selected')
            this._updatePositionBasedOnAction(buttonAction)
            const element = document.getElementById(this.foundElements[this.currentPosition])
            element.classList.add('currently-selected')
            element.scrollIntoView()
            // ==> readerPosFromTop === currentHightlightedElement.wordElement.lineElement.readerElement.scrollTop
            const readerScrollFromTOp = element.parentElement.parentElement.parentElement.scrollTop
            document.getElementById('writer').scrollTop = readerScrollFromTOp
            this._updateInfo()
            this.prevElement = element
        })
        return button
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