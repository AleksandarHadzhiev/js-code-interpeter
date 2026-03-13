import BarHandler from "./classes/BarHandler.js"
import LoaderHandler from "./classes/LoaderHandler.js"
import OffsetCalculator from "./classes/OffsetCalculator.js"
import LinesLoader from "./classes/LinesLoader.js"

const mainContainer = document.getElementById('container')
const loaderElement = document.getElementById('loader')
const scrollbarElement = document.getElementById('scrollbar')
const scrollbarAreaElement = document.getElementById('scrollable-area')
const barElement = document.getElementById('bar')
const lineNumerationElement = document.getElementById('line-numeration')
const lineContentElement = document.getElementById('line-content')

const scrollbarHeight = scrollbarElement.offsetHeight
const barHeight = barElement.offsetHeight

const lines = 2000
const lineHeightInPixels = 28.8
const maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)

const loaderHeight = (lines + maxVisibleLinesOnScreen - 1) * lineHeightInPixels
loaderElement.style.height = `${loaderHeight}px`

let barIsSelected = false


const barHandler = new BarHandler(scrollbarHeight, barHeight, barElement)
const loaderHandler = new LoaderHandler(loaderHeight, scrollbarHeight, loaderElement)
const offsetCalculator = new OffsetCalculator()
const linesLoader = new LinesLoader(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement)

linesLoader.loadLines()


window.addEventListener('wheel', (event) => {
    event.preventDefault()
    const offsetTop = offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
    loaderHandler.scrollWithOffset(offsetTop)
    const percentage = loaderHandler.getPercentageOfScroll()
    barHandler.scrollBasedOnPercentage(percentage)
    linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
})

barElement.addEventListener('mousedown', (event) => {
    barIsSelected = true
})

scrollbarAreaElement.addEventListener('mousemove', (event) => {
    if (barIsSelected) {
        barHandler.scrollWithOffset(event.clientY)
        const percentage = barHandler.getPercentageOfScroll()
        loaderHandler.scrollWithPercentage(percentage)
        linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
    }
})

window.addEventListener('mouseup', (event) => {
    if (barIsSelected) barIsSelected = false
})
