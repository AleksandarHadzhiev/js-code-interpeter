export default class CodeChangesHistoryHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     */
    constructor(textToWorkWith) {
        this.changes = new Map()
        this.currentChanges = 0
        this.textToWorkWith = textToWorkWith
        this.changes.set(this.currentChanges, this.textToWorkWith)
    }

    /**
     * 
     * @param {String} textToWorkWith 
     */
    insertChange(textToWorkWith) {
        const id = this.changes.size
        this.changes.set(id, textToWorkWith)
        this.currentChanges = id
    }

    /**
     * 
     * @returns {String}
     */
    goBack() {
        console.log(this.currentChanges)
        if (this.changes.size > 0) {
            if (this.currentChanges > 0)
                this.currentChanges -= 1
            const textToWorkWith = this.changes.get(this.currentChanges)
            return textToWorkWith
        }
        return this.textToWorkWith
    }

    /**
     * 
     * @returns {String}
     */
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