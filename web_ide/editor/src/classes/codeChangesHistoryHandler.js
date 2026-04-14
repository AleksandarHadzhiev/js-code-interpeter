export default class CodeChangesHistoryHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     */
    constructor(textToWorkWith) {
        this.changes = []
        this.currentChanges = 0
        this.textToWorkWith = textToWorkWith
        this.caret = document.getElementById('caret')
        const caretTop = this.caret.offsetTop
        const caretLeft = this.caret.offsetLeft
        const caretStyle = `top: ${caretTop}px; left: ${caretLeft}px;`
        this.changes.push({ "text": textToWorkWith, "style": caretStyle })
    }

    updateFirstPositionOfCaret() {
        if (this.changes.length == 1 && this.currentChanges == 0) {
            const caretTop = this.caret.offsetTop
            const caretLeft = this.caret.offsetLeft
            const caretStyle = `top: ${caretTop}px; left: ${caretLeft}px;`
            this.changes[0] = { "text": this.textToWorkWith, "style": caretStyle }
        }
    }

    /**
     * 
     * @param {String} textToWorkWith 
     */
    insertChange(textToWorkWith) {
        const id = this.changes.length
        const caretTop = this.caret.offsetTop
        const caretLeft = this.caret.offsetLeft
        const caretStyle = `top: ${caretTop}px; left: ${caretLeft}px;`
        if (id - 1 > this.currentChanges) {
            let changes = []
            if (this.currentChanges == 0)
                changes.push(this.changes[0])
            else
                changes = this.changes.slice(0, this.currentChanges)
            this.changes = changes
            this.changes.push({ "text": textToWorkWith, "style": caretStyle })
            this.currentChanges = this.changes.length - 1
        }
        else {
            this.changes.push({ "text": textToWorkWith, "style": caretStyle })
            this.currentChanges = id
        }
    }

    /**
     * 
     * @returns {String}
     */
    goBack() {
        if (this.changes.length > 0) {
            if (this.currentChanges > 0)
                this.currentChanges -= 1
            const textToWorkWith = this.changes[this.currentChanges].text
            this.caret.style = this.changes[this.currentChanges].style
            return textToWorkWith
        }
        return this.textToWorkWith
    }

    /**
     * 
     * @returns {String}
     */
    goForward() {
        if (this.changes.length > 0) {
            if (this.currentChanges < this.changes.length - 1)
                this.currentChanges += 1
            const textToWorkWith = this.changes[this.currentChanges].text
            this.caret.style = this.changes[this.currentChanges].style
            return textToWorkWith
        }
        return this.textToWorkWith
    }

}