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
        button.append(this._pickIconBasedOnAction(action))
        this._handleButtonAction(button, action)
        return button
    }

    _pickIconBasedOnAction(action) {
        let src = "./icons/replace_one_element.png"
        if (action == "all")
            src = "./icons/replace_multiple.png"
        const icon = document.createElement('img')
        icon.src = src
        icon.alt = 'Action to replace'
        icon.classList.add('icon')
        return icon
    }

    _handleButtonAction(button, action) {
        button.addEventListener('click', (event) => {
            const searchField = document.getElementById('search-field')
            const searchFieldValue = searchField.value
            this._replaceBasedOnAction(action, searchFieldValue)
            searchField.dispatchEvent(new Event('input'))
        })

        this._displayHelpinInfoOnHover(button, action)
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

    _displayHelpinInfoOnHover(button, action) {
        let node = null
        button.addEventListener('mouseenter', () => {
            if (action == "all") node = this._displayHelpinInfo("Replace all")
            else node = this._displayHelpinInfo("Replace first")
        })

        button.addEventListener('mouseleave', () => {
            node.remove()
        })
    }

    _displayHelpinInfo(text,) {
        const info = document.createElement('span')
        info.textContent = text
        info.classList.add('replace-info')
        this.append(info)
        return info
    }
}

customElements.define('custom-replace', CustomReplace)