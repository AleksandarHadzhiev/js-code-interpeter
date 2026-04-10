export default class CustomReplaceContainer {
    constructor() {
    }

    buildReplaceContainer() {
        const replaceContainer = document.createElement('div')
        replaceContainer.className = 'replace-container'
        replaceContainer.setAttribute('id', 'replace-container')
        const replaceField = this._buildReplaceTextField()
        const replaceActionsContainer = this._replaceOperationsContainer()
        replaceContainer.appendChild(replaceField)
        replaceContainer.appendChild(replaceActionsContainer)
        return replaceContainer
    }

    _buildReplaceTextField() {
        const replaceField = document.createElement('textarea')
        replaceField.classList.add('input-field')
        replaceField.setAttribute('id', 'replace-field')
        replaceField.setAttribute('placeholder', "Replace")
        return replaceField
    }

    _replaceOperationsContainer() {
        const container = document.createElement('div')
        container.classList.add('replace-actions-container')
        const replaceOne = this._replaceOne()
        const replaceAll = this._replaceAll()
        container.appendChild(replaceOne)
        container.appendChild(replaceAll)
        return container
    }

    _replaceOne() {
        const replaceOne = document.createElement('button')
        replaceOne.setAttribute('id', 'replace-one')
        replaceOne.className = "replace-button"
        replaceOne.textContent = "1"
        return replaceOne
    }

    _replaceAll() {
        const replaceAll = document.createElement('button')
        replaceAll.setAttribute('id', 'replace-all')
        replaceAll.className = "replace-button"
        replaceAll.textContent = "All"
        return replaceAll
    }
}
