export default class CodeChangesHistoryHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     */
    constructor(textToWorkWith) {
        this.changes = []
        this.currentChanges = 0
        this.textToWorkWith = textToWorkWith
        this.changes.push(textToWorkWith)
    }

    /**
     * 
     * @param {String} textToWorkWith 
     */
    insertChange(textToWorkWith) {
        const id = this.changes.size
        this.changes.push(textToWorkWith)
        this.currentChanges = id
    }

    /**
     * 
     * @returns {String}
     */
    goBack() {
        if (this.changes.length > 0) {
            if (this.currentChanges > 0)
                this.currentChanges -= 1
            const textToWorkWith = this.changes[this.currentChanges]
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
            const textToWorkWith = this.changes[this.currentChanges]
            return textToWorkWith
        }
        return this.textToWorkWith
    }

}