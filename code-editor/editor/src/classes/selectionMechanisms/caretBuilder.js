import calculateWidthForText from "../calculators/widthOfTextCalculator.js"

export default class CaretBuilder {
    constructor() {
    }

    /**
     * 
     * @param {HTMLElement} contentElement 
     * @param {Number} topOffset 
     */
    buildCaretForLineSelection(contentElement, topOffset) {
        let caretElement = document.getElementById('caret')
        if (caretElement == null) {
            caretElement = document.createElement('div')
            caretElement.classList.add('caret')
            caretElement.setAttribute('id', 'caret')
        }
        const left = this._calculateLeftOffsetOfCaret(contentElement)
        caretElement.style = `top: ${topOffset}px; left: ${left}px;`
        contentElement.prepend(caretElement)
    }


    _calculateLeftOffsetOfCaret(contentElement) {
        const lineNumeration = document.getElementById('line-numeration')
        const lineNumerationWidth = lineNumeration.offsetWidth
        const range = document.getSelection().getRangeAt(0)
        const selectedElement = range.endContainer.parentElement
        const textOfSelectedElement = selectedElement.textContent
        const selectedText = textOfSelectedElement.substring(0, range.endOffset)
        const widthofSelectedText = calculateWidthForText(contentElement, selectedText)
        const offsetOfSelectedElement = selectedElement.offsetLeft
        const totalWidth = widthofSelectedText + offsetOfSelectedElement + lineNumerationWidth
        return totalWidth;
    }
}