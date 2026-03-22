import HintsForRowTracker from "./HintsForRowTracker.js"

export default class HintTracker {
    constructor() {
        this.caughtProblems = new Map()
    }

    addHint(hint) {
        let hintsForId = this.caughtProblems.get(hint.id) === undefined ? new HintsForRowTracker() : this.caughtProblems.get(hint.id)
        hintsForId = hintsForId.addHint(hint)
        this.caughtProblems.set(hint.id, hintsForId)
    }

    removeHintsForLineWithInted(index) {
        const id = `hint-${index}`;
        if (this.caughtProblems.get(id) !== undefined)
            this.caughtProblems.delete(id)
    }

    switchDisplaySettingsForHintAtIndex(hint, index) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintAtSpecifiedIndex(index)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    switchDisplaySettingsForHintWithMessage(hint, message) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintMatchingSpecifiedMessage(message)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    switchDisplaySettingsForHintWithMessageToSpecificMode(hint, message, mode) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintMatchingSpecifiedMessageToSpecificMode(message, mode)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    clean() {
        this.caughtProblems = new Map()
    }
}