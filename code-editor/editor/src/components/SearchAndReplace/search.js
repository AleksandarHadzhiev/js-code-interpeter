import Highlighter from "../../classes/highlighters/Highlighter.js"

export class Search extends HTMLElement {
    constructor() {
        super()
        this.foundElements = []
        this.currentPosition = 0
        this.prevElement = null
        this.writer = document.getElementById('writer')
        this._buildMainContainer()
        this.highlighter = new Highlighter()
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
            const triggerEvent = new Event('change')
            this.writer.dispatchEvent(triggerEvent)
            this._highlight(event)
        })
        return searchBar
    }

    _highlight(event) {
        this.prevElement = null
        const content = String(event.target.value)
        this.foundElements = this.highlighter.getHighlightedElementsAfterHighlightingContent(content)
        this._updateInfo(event)
    }

    _updateInfo(event) {
        const switcher = document.getElementById('position-switcher')
        const info = document.getElementById('info')
        if (event.target.value == "") this.foundElements = []
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
        if (this.prevElement) {
            this.prevElement.forEach(previousElement => {
                previousElement.classList.remove('currently-selected')
            });
        }
        this._updatePositionBasedOnAction(buttonAction)
        const elements = this.foundElements[this.currentPosition]
        elements.forEach((element, index) => {
            element.classList.add('currently-selected')
            if (index == 0) this._updateScrollPosition(element)
        });

        this._updateInfo()
        this.prevElement = elements
    }

    _updateScrollPosition(element) {
        element.scrollIntoView()
        // ==> readerPosFromTop === currentHightlightedElement.row.highlighter.editor.scrollTop
        const readerScrollFromTOp = element.parentElement.parentElement.parentElement.scrollTop
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
