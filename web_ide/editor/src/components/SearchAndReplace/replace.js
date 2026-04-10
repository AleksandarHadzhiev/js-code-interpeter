export default class CustomReplaceContainer {
    constructor() {
    }

    buildReplaceContainer() {
        const replaceContainer = document.createElement('div')
        replaceContainer.className = 'replace-container'
        replaceContainer.setAttribute('id', 'replace-container')
        const replaceField = this._buildReplaceTextField()
        replaceContainer.appendChild(replaceField)
        return replaceContainer
    }

    _buildReplaceTextField() {
        const replaceField = document.createElement('textarea')
        replaceField.classList.add('input-field')
        replaceField.setAttribute('id', 'replace-field')
        replaceField.setAttribute('placeholder', "Replace")
        return replaceField
    }
}
