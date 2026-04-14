export default class CodeChangesHistoryHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     */
    constructor(textToWorkWith) {
        this.changes = new Map()
        this.currentChanges = 0
        this.textToWorkWith = textToWorkWith
    }

    /**
     * 
     * @param {String} textToWorkWith 
     */
    insertChange(textToWorkWith) {
        const id = this.changes.size
        this.changes.set(id, textToWorkWith)
        this.currentChanges = 0
    }

    goBack() {
        if (this.changes.size > 0) {
            if (this.currentChanges > 0)
                this.currentChanges -= 1
            const textToWorkWith = this.changes.get(this.currentChanges)
            return textToWorkWith
        }
        return this.textToWorkWith
    }

    goForward() {
        if (this.changes.size > 0) {
            if (this.currentChanges < this.changes.size - 1)
                this.currentChanges += 1
            const textToWorkWith = this.changes.get(this.currentChanges)
            return textToWorkWith
        }
        return this.textToWorkWith
    }

}