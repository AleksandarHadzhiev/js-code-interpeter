import MousePositionDefiner from "./mousePositionDefiner.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import TextSelector from "./selectionMechanisms/textSelector.js";
import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import { CaretLeftOffsetDTO } from "./dtos/caretDTOs.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./calculators/caretLeftOffsetCalculator.js";

export default class TextHighlighter {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     * @param {Number} offsetTop
     * @param {HTMLElement} contentElement  
     * @param {Number} lineNumerationWidth 
     * @param {Number} defaultMenuWidth 
     * @param {HTMLElement} screen
     * @param {Number} screenHeight
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     * @param {ScreenResizerObserver} screenResizerObserver 
     */
    constructor(linesLoader, offsetTop, contentElement, lineNumerationWidth, defaultMenuWidth, screen, screenHeight, resizeDraggerObserver, screenResizerObserver) {
        this.placer = document.getElementById('caret-placer')
        this.linesLoader = linesLoader
        this.contentElement = contentElement
        this.mousePositionDefiner = new MousePositionDefiner(lineNumerationWidth, defaultMenuWidth, screen, screenHeight)
        this.textSelector = new TextSelector(offsetTop, this.contentElement, linesLoader.maxLines)
        this.mouseYPosition = 0
        this.startingRange = null
        this.endingRange = null
        resizeDraggerObserver.addResizeListener(this.mousePositionDefiner)
        screenResizerObserver.addScreenResizeListener(this.mousePositionDefiner)
    }

    cleanRanges() {
        this.startingRange = null
        this.endingRange = null
    }

    /**
     * @param {MouseEvent} event 
     */
    highlightText(event) {
        this._buildMarker()
        this.mouseYPosition = event.pageY
        const range = document.getSelection().getRangeAt(0)
        if (this.startingRange == null) {
            this._buildStartingRange(range)
        }
        else {
            this._selectText(range, event)
        }
    }

    /**
     * 
     * @param {Range} range 
     */
    _buildStartingRange(range) {
        this.startingRange = range
        const leftOffsetDTO = new CaretLeftOffsetDTO(range.endContainer.parentElement, range.endContainer.parentElement.offsetLeft, range.endOffset)
        const offset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, this.contentElement)
        const id = range.startContainer.parentElement.parentElement.id
        const topOffset = range.startContainer.parentElement.parentElement.offsetTop
        this.startingRange = {
            lineId: Number(id),
            topOffset: topOffset,
            leftOffset: offset,
            fullText: range.startContainer.parentElement.parentElement.textContent
        }
        this.textSelector.setStartingPoint(this.startingRange)
    }

    _buildMarker() {
        this._removeExistingHighlighter()
        const newMarker = document.createElement('div')
        newMarker.classList.add('marker')
        newMarker.setAttribute('id', 'marker')
        this.placer.prepend(newMarker)
    }

    _removeExistingHighlighter() {
        const markerElement = document.getElementById('marker')
        if (markerElement)
            markerElement.remove()
    }

    /**
     * 
     * @param {Range} range 
     * @param {Event} event 
     */
    _selectText(range, event) {
        this.endingRange = range
        this.textSelector.setEndingRange(range)
        const mousePosition = this.mousePositionDefiner.defineMousePosition(event)
        this.textSelector.selectText(
            this.mouseYPosition,
            this.linesLoader.firstVisibleLine,
            this.linesLoader.lastVisibleLine,
            mousePosition,
            event)
    }
}