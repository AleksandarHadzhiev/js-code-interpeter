export class CustomReplace extends HTMLElement {
    constructor() {
        super()
        this._buildReplaceContainer()
        this.textToReplaceWith = ""
        this.writer = document.getElementById('writer')
        this.search = document.getElementById('')
        this.classList.add('replace')
    }

    _buildReplaceContainer() {
        const replaceField = this._buildReplaceTextField()
        const actionsContainer = this._buildContainerForActions()
        this.appendChild(replaceField)
        this.appendChild(actionsContainer)
    }

    _buildReplaceTextField() {
        const replaceField = document.createElement('textarea')
        replaceField.classList.add('replace-text')
        replaceField.placeholder = "Replace with"
        replaceField.addEventListener('input', (event) => {
            this.textToReplaceWith = event.target.value
        })
        return replaceField
    }

    _buildContainerForActions() {
        const actionsContainer = document.createElement('div')
        actionsContainer.classList.add('found-elements')
        const replaceOne = this._buildButtonBasedOnAction('one')
        const replaceAll = this._buildButtonBasedOnAction('all')
        actionsContainer.appendChild(replaceOne)
        actionsContainer.appendChild(replaceAll)
        return actionsContainer
    }

    _buildButtonBasedOnAction(action) {
        const button = document.createElement('button')
        button.classList.add('position-switching-button')
        button.innerHTML = this._pickIconBasedOnAction(action)
        this._handleButtonAction(button, action)
        return button
    }

    _pickIconBasedOnAction(action) {
        return `${action}`
    }

    _handleButtonAction(button, action) {
        button.addEventListener('click', (event) => {
            const searchFieldValue = document.getElementById('search-field').value
            this._replaceBasedOnAction(action, searchFieldValue)
        })
    }

    _replaceBasedOnAction(action, searchFieldValue) {
        if (action == "all") this._replaceAll(searchFieldValue)
        else this._replaceOne(searchFieldValue)
    }

    _replaceOne(searchFieldValue) {
        this.writer.value = String(this.writer.value).replace(searchFieldValue, this.textToReplaceWith)
        this.writer.dispatchEvent(new Event('change'))
    }

    _replaceAll(searchFieldValue) {
        this.writer.value = this.writer.value.replaceAll(searchFieldValue, this.textToReplaceWith)
        this.writer.dispatchEvent(new Event('change'))
    }
}

customElements.define('custom-replace', CustomReplace)