import BarHandler from "./src/classes/scrollingMechanisms/BarHandler.js"
import LoaderHandler from "./src/classes/scrollingMechanisms/LoaderHandler.js"
import OffsetCalculator from "./src/classes/scrollingMechanisms/OffsetCalculator.js"
import LinesLoader from "./src/classes/scrollingMechanisms/LinesLoader.js"
import TextSelection from "./src/classes/selectionMechanisms/textSelection.js"
import TextSelectionScrolling from "./src/classes/scrollingMechanisms/textSelectionScrolling.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "./src/classes/calculators/caretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "./src/classes/dtos/caretDTOs.js"

const mainContainer = document.getElementById('container')
const menuContainer = document.getElementById('menu')
const navigationElement = document.getElementById('navigation')
const loaderElement = document.getElementById('loader')
const scrollbarElement = document.getElementById('scrollbar')
const scrollbarAreaElement = document.getElementById('scrollable-area')
const barElement = document.getElementById('bar')
const lineNumerationElement = document.getElementById('line-numeration')
const lineContentElement = document.getElementById('line-content')
const contentElement = document.getElementById('content')

const scrollbarHeight = scrollbarElement.offsetHeight
const scrollbarTopOffset = navigationElement.offsetHeight
const barHeight = barElement.offsetHeight

const contentElementOffsetLeft = menuContainer.offsetWidth + lineNumerationElement.scrollWidth


const lines = 2000
const lineHeightInPixels = 28.8
const maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)

const loaderHeight = (lines + maxVisibleLinesOnScreen - 1) * lineHeightInPixels
loaderElement.style.height = `${loaderHeight}px`

let barIsSelected = false
let isTextSelecting = false

let startingRange = null

const textSelection = new TextSelection(scrollbarTopOffset, lineNumerationElement.scrollWidth, scrollbarHeight, loaderElement.scrollWidth, contentElement, contentElementOffsetLeft, lines)
const barHandler = new BarHandler(scrollbarHeight, barHeight, barElement)
const loaderHandler = new LoaderHandler(loaderHeight, scrollbarHeight, loaderElement)
const offsetCalculator = new OffsetCalculator()
const linesLoader = new LinesLoader(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement, contentElement)
const textSelectionScrolling = new TextSelectionScrolling(barHandler, loaderHandler, linesLoader)

linesLoader.loadLines()

window.addEventListener('wheel', (event) => {
    event.preventDefault()
    const offsetTop = offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
    loaderHandler.scrollWithOffset(offsetTop)
    const percentage = loaderHandler.getPercentageOfScroll()
    barHandler.scrollBasedOnPercentage(percentage)
    linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
    textSelection.setLoaderOffset(loaderHandler.topOffset)
    displayHighlightIfThereIsSelectedText()
})

function displayHighlightIfThereIsSelectedText() {
    const markerElement = document.getElementById('marker')
    if (markerElement) {
        textSelection.display(linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
    }
}

barElement.addEventListener('mousedown', (event) => {
    barIsSelected = true
    scrollbarAreaElement.style.pointerEvents = "all"
})

scrollbarAreaElement.addEventListener('mousemove', (event) => {
    if (barIsSelected) {
        barHandler.scrollWithOffset(event.clientY - scrollbarTopOffset)
        const percentage = barHandler.getPercentageOfScroll()
        loaderHandler.scrollWithPercentage(percentage)
        linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
        textSelection.setLoaderOffset(loaderHandler.topOffset)
        displayHighlightIfThereIsSelectedText()
    }
})

window.addEventListener('mouseup', (event) => {
    if (barIsSelected) barIsSelected = false
    scrollbarAreaElement.style.pointerEvents = "none"
    if (isTextSelecting) scrollbarElement.style.pointerEvents = "all"
    isTextSelecting = false
    startingRange = null
})

lineContentElement.addEventListener('mousedown', (event) => {
    isTextSelecting = true
    scrollbarElement.style.pointerEvents = "none"
})

window.addEventListener('mousemove', (event) => {
    if (isTextSelecting) {
        buildMarker()
        const range = document.getSelection().getRangeAt(0)
        if (startingRange == null) {
            startingRange = range
            const leftOffsetDTO = new CaretLeftOffsetDTO(range.endContainer.parentElement, range.endContainer.parentElement.offsetLeft, range.endOffset)
            const offset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, contentElement)
            const id = range.startContainer.parentElement.parentElement.id
            const topOffset = range.startContainer.parentElement.parentElement.offsetTop
            startingRange = {
                lineId: Number(id),
                topOffset: topOffset,
                leftOffset: offset,
                fullText: range.startContainer.parentElement.parentElement.textContent
            }
            textSelection.setStartingPoint(startingRange)
        }
        else {
            textSelection.setEndingRange(range)
            const mousePosition = textSelection.selectTextBetweenRanges(event, linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
            textSelectionScrolling.scrollOnMousePosition(mousePosition)
            textSelection.setLoaderOffset(loaderHandler.topOffset)
        }
    }
})

function buildMarker() {
    removeExistingHighlighter()
    const newMarker = document.createElement('div')
    newMarker.classList.add('marker')
    newMarker.setAttribute('id', 'marker')
    contentElement.prepend(newMarker)
}

mainContainer.addEventListener('mousedown', (event) => {
    removeExistingHighlighter()
})

function removeExistingHighlighter() {
    const markerElement = document.getElementById('marker')
    if (markerElement) markerElement.remove()
}