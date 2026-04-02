import { BarVerticalHandler, BarHorizontalHandler } from "./src/classes/scrollingMechanisms/BarHandler.js"
import LoaderHandler from "./src/classes/scrollingMechanisms/LoaderHandler.js"
import OffsetCalculator from "./src/classes/scrollingMechanisms/OffsetCalculator.js"
import LinesLoader from "./src/classes/scrollingMechanisms/LinesLoader.js"
import TextSelection from "./src/classes/selectionMechanisms/textSelection.js"
import TextSelectionScrolling from "./src/classes/scrollingMechanisms/textSelectionScrolling.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "./src/classes/calculators/caretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "./src/classes/dtos/caretDTOs.js"
import CaretMover from "./src/classes/caretMover.js"
import ScrollOnCaretMovement from "./src/classes/scrollingMechanisms/scrollOnCaretMovement.js"
import { MousePosition } from "./src/classes/selectionMechanisms/enums.js"


const mainContainer = document.getElementById('container')
const menuContainer = document.getElementById('menu')
const navigationElement = document.getElementById('navigation')
const loaderElement = document.getElementById('loader')


const scrollbarElementVertical = document.getElementById('scrollbar-vertical')
const scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
const barVerticalElement = document.getElementById('bar-vertical')

const scrollbarElementHorizontal = document.getElementById('scrollbar-horizontal')
const scrollbarAreaElementHorizontal = document.getElementById('scrollable-area-horizontal')
const barHorizontalElement = document.getElementById('bar-horizontal')

const lineNumerationElement = document.getElementById('line-numeration')
const lineContentElement = document.getElementById('line-content')
const contentElement = document.getElementById('content')

const scrollbarVerticalHeight = scrollbarElementVertical.offsetHeight
const scrollbarVerticalTopOffset = navigationElement.offsetHeight
const barVerticalHeight = barVerticalElement.offsetHeight



let intervalId = null
const lineNumerationWidth = lineNumerationElement.scrollWidth
const menuWidth = menuContainer.offsetWidth
let contentElementOffsetLeft = menuWidth + lineNumerationWidth

// the horizontal scrollbar elements and their sizes - unsure which sizes for now..
const barHorizontalWidth = barHorizontalElement.offsetWidth
const scrollbarHorizontalLeftOffset = menuWidth + lineNumerationWidth
const scrollbarWidth = scrollbarElementHorizontal.offsetWidth

const lines = 2000
const lineHeightInPixels = 28.8
const maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)

const loaderHeight = (lines + maxVisibleLinesOnScreen - 1) * lineHeightInPixels
loaderElement.style.height = `${loaderHeight}px`

let barVerticalIsSelected = false
let barHorizontalIsSelected = false
let isTextSelecting = false
let startingRange = null


const textSelection = new TextSelection(scrollbarVerticalTopOffset, lineNumerationWidth, scrollbarVerticalHeight, loaderElement.offsetWidth, contentElement, contentElementOffsetLeft, lines)
const barVerticalHandler = new BarVerticalHandler(scrollbarVerticalHeight, barVerticalHeight, barVerticalElement)
const barHorizontalHandler = new BarHorizontalHandler(scrollbarWidth, barHorizontalWidth, barHorizontalElement)
const loaderHandler = new LoaderHandler(loaderHeight, scrollbarVerticalHeight, loaderElement)
const offsetCalculator = new OffsetCalculator()
const linesLoader = new LinesLoader(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement, contentElement)
const textSelectionScrolling = new TextSelectionScrolling(barVerticalHandler, loaderHandler, linesLoader)
const scrollOncaretMovement = new ScrollOnCaretMovement(loaderHandler, barVerticalHandler, linesLoader)
const caretMover = new CaretMover(scrollOncaretMovement, contentElement, lineNumerationElement)

linesLoader.loadLines()

window.addEventListener('wheel', (event) => {
    event.preventDefault()
    const offsetTop = offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
    loaderHandler.scrollWithOffset(offsetTop)
    const percentage = loaderHandler.getPercentageOfScroll()
    barVerticalHandler.scrollBasedOnPercentage(percentage)
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

barVerticalElement.addEventListener('mousedown', (event) => {
    barVerticalIsSelected = true
    scrollbarAreaElementVertical.style.pointerEvents = "all"
})

barHorizontalElement.addEventListener('mousedown', (event) => {
    barHorizontalIsSelected = true
    scrollbarAreaElementHorizontal.style.pointerEvents = "all"
})

scrollbarAreaElementVertical.addEventListener('mousemove', (event) => {
    if (barVerticalIsSelected) {
        barVerticalHandler.scrollWithOffset(event.clientY - scrollbarVerticalTopOffset)
        const percentage = barVerticalHandler.getPercentageOfScroll()
        loaderHandler.scrollWithPercentage(percentage)
        linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
        textSelection.setLoaderOffset(loaderHandler.topOffset)
        displayHighlightIfThereIsSelectedText()
    }
})

scrollbarAreaElementHorizontal.addEventListener('mousemove', (event) => {
    if (barHorizontalIsSelected) {
        barHorizontalHandler.scrollWithOffset(event.clientX - scrollbarHorizontalLeftOffset)
    }
})

window.addEventListener('mouseup', (event) => {
    if (barVerticalIsSelected) barVerticalIsSelected = false
    if (barHorizontalIsSelected) barHorizontalIsSelected = false
    scrollbarAreaElementVertical.style.pointerEvents = "none"
    scrollbarAreaElementHorizontal.style.pointerEvents = "none"
    if (isTextSelecting) {
        scrollbarElementVertical.style.pointerEvents = "all"
        scrollbarElementHorizontal.style.pointerEvents = "all"
    }
    isTextSelecting = false
    startingRange = null
    caretMover.resetLeftOffsetForCaretMover()
    clearInterval(intervalId)
    intervalId = null
})

lineContentElement.addEventListener('mousedown', (event) => {
    isTextSelecting = true
    scrollbarElementVertical.style.pointerEvents = "none"
    scrollbarElementHorizontal.style.pointerEvents = "none"
})

window.addEventListener('mousemove', (event) => {
    if (isTextSelecting) {
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
            const mousePosition = textSelection.defineMousePosition(event)
            if (mousePosition == MousePosition.BOTTOM || mousePosition == MousePosition.TOP)
                autoScroll(event, mousePosition)
            else {
                buildMarker()
                scroll(event, mousePosition)
                clearInterval(intervalId)
                intervalId = null
            }
            // scroll(event, mousePosition)
            // Invalid code for Y -> it is meant for X
            // scrollOncaretMovement.updateOffset(loaderHandler.topOffset)
        }
    }
})

function autoScroll(event, mousePosition) {
    if (intervalId) return
    intervalId = setInterval(() => {
        buildMarker()
        scroll(event, mousePosition)
        if (loaderHandler.topOffset >= loaderHandler.maxTopOffset || loaderHandler.topOffset <= loaderHandler.minTopOffset) {
            clearInterval(intervalId)
            intervalId = null
        }
    }, 50)
}

function scroll(event, mousePosition) {
    textSelectionScrolling.scrollOnMousePosition(mousePosition)
    textSelection.selectText(event, linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
    textSelection.setLoaderOffset(loaderHandler.topOffset)
}

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

window.addEventListener('keydown', (event) => {
    const caret = document.getElementById('caret')
    if (caret) {
        const isScrollable = isCaretMovementScrollable(event)
        if (isScrollable)
            scrollOnScrollable()
        caretMover.moveCaretBasedOnKeybordKey(event, caret)
    }
})

function isCaretMovementScrollable(event) {
    if (event.key == "Control") return false
    const isUsingCtrl = event.ctrlKey
    const isArrowUp = event.key == "ArrowUp"
    const isArrowDown = event.key == "ArrowDown"
    const isCtrlUp = isUsingCtrl && isArrowUp
    const isCtrlDown = isUsingCtrl && isArrowDown
    const isScrollable = isCtrlDown == false && isCtrlUp == false
    return isScrollable
}

function scrollOnScrollable() {
    const caretTopOffset = caret.offsetTop
    const lineId = Math.round(caretTopOffset / lineHeightInPixels)
    if (lineId < linesLoader.firstVisibleLine || lineId > linesLoader.lastVisibleLine) {
        scrollForCaretMovementOnLineId(lineId, caretTopOffset)
    }
}

function scrollForCaretMovementOnLineId(lineId, caretTopOffset) {
    if (loaderHandler.topOffset > caretTopOffset) {
        scrollUp(lineId)
    }
    else {
        scrollDown(lineId)
    }
    updateElementsPositionsOnScreen()
}

function scrollUp(lineId) {
    const offsetForFirstVisibleLine = (lineId - 5) * lineHeightInPixels
    const offsetToScroll = loaderHandler.topOffset - offsetForFirstVisibleLine
    loaderHandler.scrollWithOffset(-offsetToScroll)
}

function scrollDown(lineId) {
    const offsetForLastVisibleLine = (lineId + 5) * lineHeightInPixels
    const offsetForFirstVisibleLine = offsetForLastVisibleLine - scrollbarVerticalHeight
    const offsetToScroll = offsetForFirstVisibleLine - loaderHandler.topOffset
    loaderHandler.scrollWithOffset(offsetToScroll)
}

function updateElementsPositionsOnScreen() {
    const percentage = loaderHandler.getPercentageOfScroll()
    barVerticalHandler.scrollBasedOnPercentage(percentage)
    linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
}

window.addEventListener('resize', () => {
    const newMaxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)
    const newLoaderHeight = (lines + newMaxVisibleLinesOnScreen - 1) * lineHeightInPixels
    loaderElement.style.height = `${newLoaderHeight}px`
    linesLoader.updateMaxVisibleLinesOnScreen(newMaxVisibleLinesOnScreen)
    linesLoader.resizeLines()
    const scrollbarVerticalHeight = scrollbarElementVertical.offsetHeight
    loaderHandler.updateHeights(newLoaderHeight, scrollbarVerticalHeight)
    barVerticalHandler.updateHeights(scrollbarVerticalHeight, barVerticalElement.offsetHeight)
    const newTotalWidthOfScreen = loaderElement.offsetWidth + lineNumerationWidth
    textSelection.updateWidths(newTotalWidthOfScreen, contentElementOffsetLeft)
})
