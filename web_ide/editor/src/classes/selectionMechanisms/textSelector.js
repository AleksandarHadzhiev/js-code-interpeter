import Highlighter from "./highlighter.js"
import { MousePosition, WindowSection } from "./enums.js"
import { StartingPoint } from "../dtos/caretDTOs.js"
import CaretBuilder from "./caretBuilder.js"
import MarkedPoint from "./MarkedPoint.js"
import ContentScrollingHandler from "../scrollingMechanisms/ContentScrollingHandler.js"
import TextFetcher from "./textFetcher.js"


export default class TextSelector { // rename to CodeSelector
    /**
     * 
     * @param {Number} offsetTopOfContentScreen 
     * @param {HTMLElement} contentElement 
     * @param {Number} lastTextLine
     */
    constructor(offsetTopOfContentScreen, contentElement, lastTextLine) {
        this.offsetTopOfContentScreen = offsetTopOfContentScreen
        this.windowSectionScrollig = null
        this.mousePosition = null
        this.highlighter = new Highlighter(contentElement)
        this.contentElement = contentElement
        this.loaderOffset = 0
        this.mouseXPosition = 0
        this.lastTextLine = lastTextLine
        this.selectedText = ""
        this.mouseXPosition = 0
        this.textFetcher = new TextFetcher(this.highlighter, this.contentElement)
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {String} text 
     */
    selectWholeText(firstVisibleLine, lastVisibleLine, text) {
        const lines = text.split('\n')
        this.highlighter.selectWholeText(firstVisibleLine, lastVisibleLine, lines)
    }

    /**
     * @param {String} fullText 
     */
    selectTextOnCopyCommand(fullText) { // not responsibility of the TextSelector to know the copy command
        const fetchedText = this.textFetcher.selectTextFromFullText(fullText)
        this.selectedText = fetchedText.text
        navigator.clipboard.writeText(this.selectedText)
        return fetchedText
    }

    /**
     * 
     * @param {StartingPoint} startingPoint 
     */
    setStartingPoint(startingPoint) {
        this.highlighter.setStartingPoint(startingPoint)
    }

    /**
     * 
     * @param {Range} range 
     */
    setEndingRange(range) {
        this.highlighter.setEndingRangeBasedOnRange(range)
    }

    /**
     * 
     * @param {Number} pageYMousePosition 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {String} mousePosition 
     * @param {MouseEvent} event 
     */
    selectText(pageYMousePosition, firstVisibleLine, lastVisibleLine, mousePosition, event) {
        this.mouseXPosition = event.pageX
        this.mousePosition = mousePosition
        console.log(pageYMousePosition, this.loaderOffset, this.offsetTopOfContentScreen)
        const mouseYPositionBasedOnPage = pageYMousePosition + this.loaderOffset - this.offsetTopOfContentScreen
        console.log(mouseYPositionBasedOnPage)
        this._highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    _highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        if (this.mousePosition == MousePosition.RIGHT) {
            this.highlighter.highlightForRightScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.LEFT) {
            this.highlighter.highlightForLeftScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.TOP) {
            this.highlighter.highlightForTopScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.BOTTOM) {
            this.highlighter.highlightForBottomScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, this.lastTextLine)
        }
        else if (this.mousePosition == MousePosition.CENTRE) {
            this.highlighter.highlightForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, this.xForMouseInEditor)
        }
    }
}