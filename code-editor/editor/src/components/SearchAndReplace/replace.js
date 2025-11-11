export class CustomReplace extends HTMLElement {
    constructor() {
        super()
        this._buildReplaceContainer()
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
            // this._highlightElements(event)
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
            console.log(action)
        })
    }
}

customElements.define('custom-replace', CustomReplace)