import CaretBuilder from "./caretBuilder.js"

export default class LineSelector {
    /**
     * 
     * @param {MouseEvent} event 
     */
    constructor(event, contentElement) {
        this.mouseEvent = event
        this.contentElement = contentElement
    }

    selectLine() {
        const targetElement = this.mouseEvent.currentTarget
        const topOffset = targetElement.offsetTop
        const selector = this._buildSelector()
        this._positionSelectorBasedonTarget(selector, topOffset)
        const caretBuilder = new CaretBuilder()
        caretBuilder.buildCaretForLineSelection(topOffset)
        this.contentElement.prepend(selector)
    }

    _buildSelector() {
        let selector = document.getElementById('line-selector')
        if (selector == null) {
            selector = document.createElement('div')
            selector.classList.add('line-selector')
            selector.setAttribute('id', 'line-selector')
        }
        return selector
    }


    /**
     * @param {Number} lineId
     * @param {HTMLElement} contentElement
     */
    selectLineForClickOnEmptySpace(lineId, contentElement) {
        const caretBuilder = new CaretBuilder()
        const selector = this._buildSelector()
        this._positionSelectorBasedonTarget(selector, lineId * 28.8)
        caretBuilder.buildCaretForLineSelectionOnClickingEmptySpace(lineId, contentElement)
        this.contentElement.prepend(selector)
    }

    /**
     * @param {HTMLElement} selector 
     * @param {Number} topOffset
     */
    _positionSelectorBasedonTarget(selector, topOffset) {
        selector.style = `top: ${topOffset}px;`
    }
}