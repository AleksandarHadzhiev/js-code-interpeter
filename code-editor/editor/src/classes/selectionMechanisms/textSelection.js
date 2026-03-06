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