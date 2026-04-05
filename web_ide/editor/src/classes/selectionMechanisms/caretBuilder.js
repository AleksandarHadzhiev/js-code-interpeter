import calculateWidthForText from "../calculators/widthOfTextCalculator.js"
import MarkedPoint from "./MarkedPoint.js"
import { MousePosition } from "./enums.js"

export default class CaretBuilder {
    constructor() {
        this.caretPlacer = document.getElementById('caret-placer')
        this.lineContentElement = document.getElementById('line-content')
    }

    /**
     * @param {Number} lineId
     * @param {HTMLElement} contentElement
     */
    buildCaretForLineSelectionOnClickingEmptySpace(lineId, contentElement) {
        const caretElement = this._buildCaret()
        const lineElement = document.getElementById(String(lineId))
        const left = calculateWidthForText(contentElement, lineElement.textContent)
        caretElement.style = `top: ${lineId * 28.8}px; left: ${left}px;`
        this.caretPlacer.prepend(caretElement)
    }

    /**
     *  
     * @param {Number} topOffset 
     */
    buildCaretForLineSelection(topOffset) {
        const caretElement = this._buildCaret()
        const left = this._calculateLeftOffsetOfCaret()
        caretElement.style = `top: ${topOffset}px; left: ${left}px;`
        this.caretPlacer.prepend(caretElement)
    }

    _calculateLeftOffsetOfCaret() {
        const range = document.getSelection().getRangeAt(0)
        const selectedElement = range.endContainer.parentElement
        const textOfSelectedElement = selectedElement.textContent
        const selectedText = textOfSelectedElement.substring(0, range.endOffset)
        const widthofSelectedText = calculateWidthForText(this.lineContentElement, selectedText)
        const offsetOfSelectedElement = selectedElement.offsetLeft
        const totalWidth = widthofSelectedText + offsetOfSelectedElement
        return totalWidth;
    }

    /** 
     * @param {MarkedPoint} point 
     * @param {String} mousePosition 
     * @param {Number} mouseXPosition
    */
    buildCaretForTextSelection(point, mousePosition, mouseXPosition) {
        const caretElement = this._buildCaret()
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
        caretElement.style = `top: ${point.top}px; left: ${left}px;`
        this.caretPlacer.prepend(caretElement)
    }

    _buildCaret() {
        let caretElement = document.getElementById('caret')
        if (caretElement == null) {
            caretElement = document.createElement('div')
            caretElement.classList.add('caret')
            caretElement.setAttribute('id', 'caret')
        }
        return caretElement
    }
}