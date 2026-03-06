const MousePosition = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
    CENTRE: "centre"
}

const WindowSection = {
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTRE: "CENTRE",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}

const StartingPointVisibility = {
    VISIBLE: "VISIBLE",
    EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN: "EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN",
    LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN: "LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN"
}

export default class TextSelection {
    constructor() {
        this.startingRange = null
        this.endingRange = null
    }

    /**
     * 
     * @param {Range} range 
     */
    setStartingRange(range) {
        this.startingRange = range
    }

    setEndingRange(range) {
        this.endingRange = range
    }

    /**
     * 
     * @returns {null}
     */
    selectTextBetweenRanges() {
        return null
    }

    _defineSectionOfTextSelection() {

    }
}