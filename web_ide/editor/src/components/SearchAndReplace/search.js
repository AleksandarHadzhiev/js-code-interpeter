export default class CustomSearchContainer {
    constructor() {
    }

    buildSearchContainer() {
        const searchContainer = document.createElement('div')
        searchContainer.setAttribute('id', 'search-container')
        searchContainer.className = 'search-container'
        const searchField = this._buildSearchTextField()
        const info = this._buildInfo()
        const switchContainer = this._buildSwitchContainer()
        const closeContainer = this._buildCloseContainer()
        searchContainer.appendChild(searchField)
        searchContainer.appendChild(info)
        searchContainer.appendChild(switchContainer)
        searchContainer.appendChild(closeContainer)
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

    _buildSwitchContainer() {
        const container = document.createElement('div')
        container.className = 'switch-container'
        const goUp = this._buildGoUp()
        const goDown = this._buildGoDown()
        container.appendChild(goUp)
        container.appendChild(goDown)
        return container
    }

    _buildGoUp() {
        const goUpButton = document.createElement('button')
        goUpButton.setAttribute('id', 'go-up')
        goUpButton.className = 'switch-button'
        goUpButton.textContent = "<"
        return goUpButton
    }

    _buildGoDown() {
        const goDownButton = document.createElement('button')
        goDownButton.setAttribute('id', 'go-down')
        goDownButton.className = 'switch-button'
        goDownButton.textContent = ">"
        return goDownButton
    }

    _buildCloseContainer() {
        const container = document.createElement('div')
        container.className = "close-container"
        const closeSearchAndReplace = this._buildCloseSearchAndReplace()
        const searchInSelection = this._buildSearchForTextInSelection()
        container.appendChild(searchInSelection)
        container.appendChild(closeSearchAndReplace)
        return container
    }

    _buildCloseSearchAndReplace() {
        const closeSearchAndReplace = document.createElement('button')
        closeSearchAndReplace.textContent = "X"
        closeSearchAndReplace.classList = 'switch-button'
        closeSearchAndReplace.setAttribute('id', 'close-search-replace')
        return closeSearchAndReplace
    }

    _buildSearchForTextInSelection() {
        const searchInSelection = document.createElement('button')
        searchInSelection.setAttribute('id', 'search-in-selection')
        searchInSelection.classList = 'switch-button'
        searchInSelection.textContent = 'S'
        return searchInSelection
    }
}
