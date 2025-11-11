class CustomReplace extends HTMLElement {
    constructor() {
        super()
        const container = this._buildReplaceContainer()
        this.appendChild(container)
    }

    _buildReplaceContainer() {
        const container = document.createElement('div')
        const replaceField = this._buildReplaceContainer()
        const actionsContainer = this._buildContainerForActions()
        container.appendChild(replaceField)
        return container
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
        const replaceOne = this._buildButtonBasedOnAction('one')
        const replaceAll = this._buildButtonBasedOnAction('all')
        actionsContainer.appendChild(replaceOne)
        actionsContainer.appendChild(replaceAll)
        return actionsContainer
    }

    _buildButtonBasedOnAction(action) {
        const button = document.createElement('button')
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