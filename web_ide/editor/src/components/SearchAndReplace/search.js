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
        searchContainer.appendChild(searchField)
        searchContainer.appendChild(info)
        searchContainer.appendChild(switchContainer)
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
}
