class HintsPublisher {
    constructor(hintSubsriber) {
        this.hintSubsriber = hintSubsriber
        this.hints = new Map()
    }

    notifySubsribersForNewHint(hint) {
        // notify that a hint was added
        this.hints.set(this.hints.size, hint)
        this.hintSubsriber.update()
    }

    notifySubscribersForChangeOfSettingsInAHint() {
        // notify subscribers that a hint settings was changed
        this.changeSettingsForAHintAndAddToTheListAgain()
        this.hintSubsriber.update()
    }

    changeSettingsForAHintAndAddToTheListAgain() {

    }
}