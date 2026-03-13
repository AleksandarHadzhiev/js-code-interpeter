import HintTypes from "./HintTypes.js"

export default class Hint {
    constructor(message, type, row, id) {
        this.message = message
        this.type = type
        this.row = row
        this.id = id
        this.isToBeDisplayed = true;
    }

    switchDisplaySettings() {
        if (this.type !== new HintTypes().ERROR)
            this.isToBeDisplayed = !this.isToBeDisplayed
    }

    changeDisplaySettingsToMode(mode) {
        if (this.type !== new HintTypes().ERROR)
            this.isToBeDisplayed = mode
    }
}