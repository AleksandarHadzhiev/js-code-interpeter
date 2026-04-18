import SizeChangesHandler from "./sizesUpdateMechanisms/sizeChangesHandler.js"
import TextSelection from "./selectionMechanisms/textSelection.js"
import ContentScrollingHandler from "./scrollingMechanisms/ContentScrollingHandler.js"
import { CaretLeftOffsetDTO } from "./dtos/caretDTOs.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "./calculators/caretLeftOffsetCalculator.js"
import { BarHorizontalHandler, BarVerticalHandler } from "./scrollingMechanisms/BarHandler.js"
import { MousePosition } from "./selectionMechanisms/enums.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import TextSelectionScrolling from "./scrollingMechanisms/textSelectionScrolling.js"
import LinesLoader from "./scrollingMechanisms/LinesLoader.js"

export default class CaretTracker {
    /**
     * 
     * @param {HTMLElement} contentElement 
     * @param {Number} minLineHeight
     * @param {Number} maxLines
     * @param {LinesLoader} linesLoader   
     */
    constructor(contentElement, minLineHeight, maxLines, linesLoader) {
        this.pageYMousePosition = 0
        this.linesLoader = linesLoader
        this.intervalHorizontalId = 0
        this.intervalVerticalId = 0
        this.startingRange = null
        this.isTextSelecting = false
        this.navigation = document.getElementById('navigation')
        this.placer = document.getElementById('caret-placer')
        this.contentElement = contentElement
        this.lineContentElement = document.getElementById('line-content')
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.horizontalScrollbar = document.getElementById('scrollbar-horizontal')
        this.horizontalBar = document.getElementById('bar-horizontal')
        this.verticalScrollbar = document.getElementById('scrollbar-vertical')
        this.verticalBar = document.getElementById('bar-vertical')
        this.sizeChangesHandler = new SizeChangesHandler(minLineHeight, maxLines)
        this.contentLeftOffset = this.sizeChangesHandler.defaultLeftOffsetForContent
        this.contentScrollingHandler = new ContentScrollingHandler(
            this.lineContentElement.scrollWidth, this.contentLeftOffset,
            this.lineNumerationElement.offsetWidth, this.verticalScrollbar.offsetWidth,
            this.lineContentElement
        )
        this.textSelector = new TextSelection(
            this.navigation.offsetHeight,
            this.lineNumerationElement.offsetWidth,
            this.verticalScrollbar.offsetHeight,
            this.horizontalScrollbar.offsetWidth,
            this.contentElement,
            this.sizeChangesHandler.defaultLeftOffsetForContent,
            maxLines, this.contentScrollingHandler
        )

        this.barHorizontalHandler = new BarHorizontalHandler(
            this.horizontalScrollbar.offsetWidth,
            this.horizontalBar.offsetWidth,
            this.horizontalBar
        )

        this.barVerticalHandler = new BarVerticalHandler(
            this.verticalScrollbar.offsetHeight,
            this.verticalBar.offsetHeight,
            this.verticalBar
        )

        this.loaderHeight = 55

        this.loaderHandler = new LoaderHandler(
            this.loaderHeight, this.verticalScrollbar.offsetHeight,
            document.getElementById('loader')
        )

        this.textSelectionScrolling = new TextSelectionScrolling(
            this.barVerticalHandler,
            this.loaderHandler,
            this.linesLoader
        )

        this.sizeChangesHandler.addListener(this.textSelector)

        this.lineContentElement.addEventListener('mousedown', () => {
            this.isTextSelecting = true
        })

        window.addEventListener('mousemove', (event) => {
            if (this.isTextSelecting) {
                this.pageYMousePosition = event.pageY
                const range = document.getSelection().getRangeAt(0)
                if (this.startingRange == null)
                    this._buildStartingPoint(range)
                else {
                    this._selectText(range, event)
                }
            }
        })

        window.addEventListener('mouseup', () => {
            this.isTextSelecting = false
            this.startingRange = null
        })
    }

    _buildStartingPoint(range) {
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


    _selectText(range, event) {
        this.textSelector.setEndingRange(range)
        const mousePosition = this.textSelector.defineMousePosition(event)
        if (mousePosition == MousePosition.BOTTOM || mousePosition == MousePosition.TOP) {
            this._verticalAutoScroll(mousePosition)
        }
        else if (mousePosition == MousePosition.LEFT || mousePosition == MousePosition.RIGHT) {
            console.log("HERE")
            this._horizontalAutoScroll(mousePosition)
        }
        else {
            this._selectTextInCentreSection(mousePosition)
        }
    }

    _verticalAutoScroll(mousePosition) {
        clearInterval(this.intervalHorizontalId)
        this.intervalHorizontalId = null
        if (this.intervalVerticalId) return
        this.intervalVerticalId = setInterval(() => {
            this._buildMarker()
            this._scroll(mousePosition)
            if (this.loaderHandler.topOffset >= this.loaderHandler.maxTopOffset
                || this.loaderHandler.topOffset <= this.loaderHandler.minTopOffset) {
                clearInterval(this.intervalVerticalId)
                this.intervalVerticalId = null
            }
        }, 50)
    }

    _scroll(mousePosition) {
        this.textSelectionScrolling.scrollOnMousePosition(mousePosition)
        this.textSelector.selectText(this.pageYMousePosition, this.linesLoader.firstVisibleLine, this.linesLoader.lastVisibleLine)
        this.textSelector.setLoaderOffset(this.loaderHandler.topOffset)
    }

    _horizontalAutoScroll(mousePosition) {
        clearInterval(this.intervalVerticalId)
        this.intervalVerticalId = null
        if (this.intervalHorizontalId) return
        this.intervalHorizontalId = setInterval(() => {
            this._buildMarker()
            this._scrollHorizontallyOnTextSelection(mousePosition)
            if (this.contentScrollingHandler.leftOffset <= this.contentScrollingHandler.maxLeftOffset || this.contentScrollingHandler.leftOffset >= this.contentScrollingHandler.minLeftOffset) {
                clearInterval(this.intervalHorizontalId)
                this.intervalHorizontalId = null
            }
        }, 50)
    }

    _scrollHorizontallyOnTextSelection(mousePosition) {
        if (mousePosition == MousePosition.LEFT) {
            this.contentScrollingHandler.scrollWithOffset(-25)
            const percentage = this.contentScrollingHandler.getPerentageOfScroll()
            this.barHorizontalHandler.scrollBasedOnPercentage(percentage)
        }
        else if (mousePosition == MousePosition.RIGHT) {
            this.contentScrollingHandler.scrollWithOffset(25)
            const percentage = this.contentScrollingHandler.getPerentageOfScroll()
            this.barHorizontalHandler.scrollBasedOnPercentage(percentage)
        }
        console.log(this.linesLoader)
        this.textSelector.selectText(this.pageYMousePosition, this.linesLoader.firstVisibleLine, this.linesLoader.lastVisibleLine)
    }

    _selectTextInCentreSection(mousePosition) {
        this._buildMarker()
        this._scroll(mousePosition)
        clearInterval(this.intervalHorizontalId)
        this.intervalHorizontalId = null
        clearInterval(this.intervalVerticalId)
        this.intervalVerticalId = null
    }
}