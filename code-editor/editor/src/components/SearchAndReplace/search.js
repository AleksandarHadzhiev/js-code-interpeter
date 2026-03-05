import Highlighter from "../../classes/highlighters/Highlighter.js"
import HighlightLineBuilder from "../../classes/highlighters/HighlightLineBuilder.js"

export class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.currentPosition = 0
        this.prevElement = null
        this.content = ""
        this.setAttribute('id', 'search-component')
        this.writer = document.getElementById('writer')
        this._buildMainContainer()
        this.highlighter = new Highlighter()
        this.nodes = document.getElementById('highlighter').childNodes
        this.index = 0
        this.indexOf = 0
        this.epmtyLines = 0
        this.indexOfEmptyLine = 0
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
            this.prevElement = null
            this.currentPosition = 0
            if (event.target.value != "" && event.target.value.split('\n').length > 1) {
                const triggerEvent = new Event('change')
                this.writer.dispatchEvent(triggerEvent)
            }
            this._highlight(event)
        })
        return searchBar
    }

    _highlight(event) {
        this.prevElement = null
        this.content = String(event.target.value)
        this.foundElements = this.highlighter.getHighlightedElementsAfterHighlightingContent(this.content)
        this._updateInfo()
    }

    _updateInfo() {
        console.log(this.foundElements)
        const switcher = document.getElementById('position-switcher')
        const info = document.getElementById('info')
        if (this.content == "") this.foundElements = []
        if (this.foundElements.length > 0) {
            switcher.classList.remove('hidden')
            info.textContent = `${this.currentPosition + 1} : ${this.foundElements.length}`;
        }
        else info.textContent = `No results`;
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
        if (this.content.split('\n').length == 1) {
            this._handleSwitchOnSingleLineSearch(buttonAction)
        }
        else {
            this._handleSwitchOnMultiLineSearch(buttonAction)
        }
    }

    _handleSwitchOnSingleLineSearch(buttonAction) {
        this.foundElements = document.getElementsByName('highlighted')
        if (this.prevElement) {
            this.prevElement.classList.remove('currently-selected')
        }
        this._updatePositionBasedOnAction(buttonAction)
        const element = this.foundElements[this.currentPosition]
        element.classList.add('currently-selected')
        this._updateScrollPosition(element)
        this._updateInfo()
        this.prevElement = element
    }

    _handleSwitchOnMultiLineSearch(buttonAction) {
        if (this.prevElement) {
            this.prevElement.forEach(previousElement => {
                previousElement.classList.remove('currently-selected')
            });
        }
        this._updatePositionBasedOnAction(buttonAction)
        const elements = this.foundElements[this.currentPosition]
        elements.forEach((element, index) => {
            element.classList.add('currently-selected')
            console.log(element)
            if (index == 0) this._updateScrollPosition(element)
        });

        this._updateInfo()
        this.prevElement = elements
    }

    _updateScrollPosition(element) {
        element.scrollIntoView()
        const readerScrollFromTop = document.getElementById("editor-container").scrollTop
        const readerScrollFromLeft = document.getElementById("editor-container").scrollLeft
        document.getElementById('writer').scrollTop = readerScrollFromTop
        document.getElementById('reader').scrollTop = readerScrollFromTop
        document.getElementById('highlighter').scrollTop = readerScrollFromTop
        document.getElementById('writer').scrollLeft = readerScrollFromLeft
        document.getElementById('reader').scrollLeft = readerScrollFromLeft
        document.getElementById('highlighter').scrollLeft = readerScrollFromLeft
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
