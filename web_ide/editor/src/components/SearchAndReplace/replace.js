class CustomReplaceContainer extends HTMLElement {
    constructor() {
        super()
        const container = this._buildReplaceContainer()
        this.appendChild(container)
    }

    _buildReplaceContainer() {
        const replaceContainer = document.createElement('div')
        replaceContainer.classList.add('hidden')
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

customElements.define('custom-replace-container', CustomReplaceContainer)