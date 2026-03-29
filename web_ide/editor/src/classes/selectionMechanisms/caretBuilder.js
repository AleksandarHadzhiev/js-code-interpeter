import calculateWidthForText from "../calculators/widthOfTextCalculator.js"
import MarkedPoint from "./MarkedPoint.js"
import { MousePosition } from "./enums.js"

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

    /**
     * @param {HTMLElement} contentElement 
     * @param {MarkedPoint} point 
     * @param {String} mousePosition 
     * @param {Number} mouseXPosition
    */
    buildCaretForTextSelection(contentElement, point, mousePosition, mouseXPosition) {
        const lineNumeration = document.getElementById('line-numeration')
        const lineNumerationWidth = lineNumeration.offsetWidth
        let caretElement = document.getElementById('caret')
        if (caretElement == null) {
            caretElement = document.createElement('div')
            caretElement.classList.add('caret')
            caretElement.setAttribute('id', 'caret')
        }
        let left = point.left == 0 ? point.width : point.left
        if (mousePosition == MousePosition.TOP)
            left = point.left == 0 && point.width == 0 ? point.width : point.left
        else if (mousePosition == MousePosition.LEFT)
            left = point.left == 0 && point.width == 0 ? point.width : point.left
        else if (mousePosition == MousePosition.CENTRE) {
            const pointLeft = point.left
            const pointWidth = point.width
            const distanceBetweenPointLeftAndMousePosition = mouseXPosition > pointLeft ? mouseXPosition - pointLeft : pointLeft - mouseXPosition
            const distanceBetweenPointWidthAndMousePosition = mouseXPosition > pointWidth ? mouseXPosition - pointWidth : pointWidth - mouseXPosition
            if (distanceBetweenPointLeftAndMousePosition < distanceBetweenPointWidthAndMousePosition) {
                left = pointLeft
            }
            else if (distanceBetweenPointLeftAndMousePosition > distanceBetweenPointWidthAndMousePosition) {
                left = pointWidth
            }
        }
        caretElement.style = `top: ${point.top}px; left: ${left + lineNumerationWidth}px;`
        contentElement.prepend(caretElement)
    }
}