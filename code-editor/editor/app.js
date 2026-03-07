import BarHandler from "./src/classes/scrollingMechanisms/BarHandler.js"
import LoaderHandler from "./src/classes/scrollingMechanisms/LoaderHandler.js"
import OffsetCalculator from "./src/classes/scrollingMechanisms/OffsetCalculator.js"
import LinesLoader from "./src/classes/scrollingMechanisms/LinesLoader.js"
import TextSelection from "./src/classes/selectionMechanisms/textSelection.js"

const mainContainer = document.getElementById('container')
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

const lines = 2000
const lineHeightInPixels = 28.8
const maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)

const loaderHeight = (lines + maxVisibleLinesOnScreen - 1) * lineHeightInPixels
loaderElement.style.height = `${loaderHeight}px`

let barIsSelected = false
let isTextSelecting = false

let startingRange = null
let endingRange = null
const textSelection = new TextSelection(scrollbarTopOffset, lineNumerationElement.scrollWidth, scrollbarHeight, loaderElement.scrollWidth, contentElement)


const barHandler = new BarHandler(scrollbarHeight, barHeight, barElement)
const loaderHandler = new LoaderHandler(loaderHeight, scrollbarHeight, loaderElement)
const offsetCalculator = new OffsetCalculator()
const linesLoader = new LinesLoader(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement, contentElement)

linesLoader.loadLines()

window.addEventListener('wheel', (event) => {
    event.preventDefault()
    const offsetTop = offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
    loaderHandler.scrollWithOffset(offsetTop)
    const percentage = loaderHandler.getPercentageOfScroll()
    barHandler.scrollBasedOnPercentage(percentage)
    linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
    const newHeight = scrollbarHeight + (loaderHandler.topOffset)
    textSelection.updateHeightOfElementBasedOnVisibleLinesOnTheScreen(newHeight)
    textSelection.setLoaderOffset(loaderHandler.topOffset)
})

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
        const newHeight = scrollbarHeight + (loaderHandler.topOffset)
        textSelection.updateHeightOfElementBasedOnVisibleLinesOnTheScreen(newHeight)
        textSelection.setLoaderOffset(loaderHandler.topOffset)
    }
})

window.addEventListener('mouseup', (event) => {
    if (barIsSelected) barIsSelected = false
    scrollbarAreaElement.style.pointerEvents = "none"
    isTextSelecting = false
    startingRange = null
})

lineContentElement.addEventListener('mousedown', (event) => {
    isTextSelecting = true
})

window.addEventListener('mousemove', (event) => {
    if (isTextSelecting) {
        buildMarker()
        const range = document.getSelection().getRangeAt(0)
        if (startingRange == null) {
            startingRange = range
            textSelection.setStartingRange(startingRange)
        }
        else {
            endingRange = range
            textSelection.setEndingRange(endingRange)
            const selection = textSelection.selectTextBetweenRanges(event, linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
        }
    }
})

function buildMarker() {
    let markerElement = document.getElementById('marker')
    if (markerElement) marker.remove()
    markerElement = document.createElement('div')
    markerElement.classList.add('marker')
    markerElement.setAttribute('id', 'marker')
    contentElement.prepend(markerElement)
}