import CaretBuilder from "./caretBuilder.js"

export default class LineSelector {
    /**
     * 
     * @param {MouseEvent} event 
     */
    constructor(event) {
        this.mouseEvent = event
    }

    selectLine() {
        const contentElement = document.getElementById('content')
        const targetElement = this.mouseEvent.currentTarget
        const topOffset = targetElement.offsetTop
        const selector = this._buildSelector()
        this._positionSelectorBasedonTarget(selector, topOffset)
        const caretBuilder = new CaretBuilder()
        caretBuilder.buildCaretForLineSelection(contentElement, topOffset)
        contentElement.prepend(selector)
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
     * @param {HTMLElement} selector 
     * @param {Number} topOffset
     */
    _positionSelectorBasedonTarget(selector, topOffset) {
        selector.style = `top: ${topOffset}px;`
    }
}