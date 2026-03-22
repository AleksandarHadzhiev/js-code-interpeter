const bar = document.getElementById('bar')
const scrollbar = document.getElementById('scrollbar')
const scrollbleArea = document.getElementById('scrollable-area')
const loader = document.getElementById('loader')
const viewElement = document.getElementById('view')
const scrollableElement = document.getElementById('scrollable')
const lines = 400
const scrollbarHeight = scrollbar.offsetHeight
const maxVisibleLinesOnScreen = Math.ceil(viewElement.offsetHeight / 25)
const loaderheight = (400 + maxVisibleLinesOnScreen - 1) * 25
loader.style.height = `${loaderheight}px`

const linesElement = document.getElementById('lines')
let barIsSelected = false


let firstLine = 0
let lastLine = firstLine + maxVisibleLinesOnScreen
let previousLastLine = lastLine
let offset = 0
const scrollingPowerInPixelsForEdge = 149.99999284744297
const scrollingPowerInPixelsForChrome = 100
viewElement.addEventListener('wheel', (event) => {
    event.preventDefault()
    const scrollingPower = calculateScrollingPowerForDeltaY(event.deltaY)
    const offsetTop = scrollingPower * 150
    scrollBasedOnScrollingPower(scrollingPower, offsetTop)
    updateContentBasedOnScreen()
    previousLastLine = lastLine
})

/**
 * 
 * @param {Number} deltaY 
 */
function calculateScrollingPowerForDeltaY(deltaY) {
    if (deltaY % scrollingPowerInPixelsForEdge == 0) {
        return deltaY / scrollingPowerInPixelsForEdge
    }
    else if (deltaY % scrollingPowerInPixelsForChrome == 0) {
        return deltaY / scrollingPowerInPixelsForChrome
    }
}

function scrollBasedOnScrollingPower(scrollingPower, offsetTop) {
    if (scrollingPower > 0) {
        scrollDown(offsetTop, scrollingPower)
    }
    else if (scrollingPower < 0) {
        scrollUp(offsetTop, scrollingPower)
    }
}

function scrollDown(offsetTop, scrollingPower) {
    offset = offset + offsetTop >= loader.offsetHeight - scrollbarHeight ? loader.offsetHeight - scrollbarHeight : offset += offsetTop
    const offsetTopForBar = calculateOffetTopForBarBasedOnScrollingPower(scrollingPower)
    const currentTopOffsetForBar = bar.offsetTop
    const newTopOffsetForBar = currentTopOffsetForBar + offsetTopForBar <= scrollbarHeight - 25 ? currentTopOffsetForBar + offsetTopForBar : scrollbarHeight - 25
    bar.style = `top: ${newTopOffsetForBar}px;`
}

function scrollUp(offsetTop, scrollingPower) {
    offset = offset + offsetTop <= 0 ? 0 : offset += offsetTop
    const offsetTopForBar = calculateOffetTopForBarBasedOnScrollingPower(scrollingPower)
    const currentTopOffsetForBar = bar.offsetTop
    const newTopOffsetForBar = currentTopOffsetForBar + offsetTopForBar >= 0 ? currentTopOffsetForBar + offsetTopForBar : 0
    bar.style = `top: ${newTopOffsetForBar}px;`
}

function calculateOffetTopForBarBasedOnScrollingPower(scrollingPower) {
    const offsetTop = scrollingPower * 150
    const percentage = (offsetTop / loaderheight) * 100
    const offsetTopForBar = scrollbarHeight * (percentage / 100)
    return offsetTopForBar
}

function updateContentBasedOnScreen() {
    firstLine = Math.floor(offset / 25)
    lastLine = firstLine + maxVisibleLinesOnScreen
    reloadDisplayedLines()
    if (offset <= 0)
        loader.style = `height: ${loaderheight}px; top: -${0}px;`
    else {
        loader.style = `height: ${loaderheight}px; top: -${offset >= loader.offsetHeight - scrollbarHeight ? loader.offsetHeight - scrollbarHeight : offset}px; `
    }
}

function reloadDisplayedLines() {
    if (lastLine > previousLastLine)
        refreshlinesOnScrollingDown()
    else
        refreshLinesOnScrollingUp()
}

function refreshlinesOnScrollingDown() {
    loadLinesOnScrollingDown()
    cleanLinesOnScrollingDown()
}

function loadLinesOnScrollingDown() {
    const startingLine = lastLine <= 400 + maxVisibleLinesOnScreen - 1 ? lastLine : 400 + maxVisibleLinesOnScreen - 1
    for (let index = startingLine; index >= previousLastLine; index--) {
        if (document.getElementById(String(index)) == null && index <= 400) {
            const element = buildLine(index);
            linesElement.appendChild(element)
        }
    }
}

function cleanLinesOnScrollingDown() {
    for (let index = 0; index < firstLine; index++) {
        const element = document.getElementById(String(index));
        if (element)
            element.remove()
    }
}

function refreshLinesOnScrollingUp() {
    loadLinesOnScrollingUp()
    cleanLinesOnScrollingUp()
}

function loadLinesOnScrollingUp() {
    const startingLine = firstLine >= 0 ? firstLine : 0
    for (let index = startingLine; index < lastLine; index++) {
        if (document.getElementById(String(index)) == null && index <= 400) {
            const element = buildLine(index);
            linesElement.appendChild(element)
        }
    }
}

function cleanLinesOnScrollingUp() {
    for (let index = lastLine; index <= 400; index++) {
        const element = document.getElementById(String(index));
        if (element)
            element.remove()
    }
}


function buildLines() {
    for (let index = firstLine; index < lastLine; index++) {
        const element = buildLine(index);
        linesElement.appendChild(element)
    }
}

/**
 * 
 * @param {Number} index 
 */
function buildLine(index) {
    const lineElement = document.createElement('div')
    lineElement.classList.add('line')
    lineElement.style = `top: ${index * 25}px;`
    lineElement.setAttribute('id', String(index))
    return lineElement
}

buildLines()

bar.addEventListener('mousedown', (event) => {
    console.log('clicked')
    barIsSelected = true
})

scrollbleArea.addEventListener('mousemove', (event) => {
    if (barIsSelected) {
        const offsetTop = calculateOffsetTopForMouseEvent(event)
        calculateOffsetBasedOnOffsetTop(offsetTop)
        updateContentOnScreenBasedOnOffsetTop(offsetTop)
        previousLastLine = lastLine
    }
})

/**
 * 
 * @param {MouseEvent} event 
 */
function calculateOffsetTopForMouseEvent(event) {
    const distanceBetweenMouseAndTopPointOfScrollableElement = event.clientY - scrollableElement.offsetTop
    const maxOffset = scrollbarHeight - bar.offsetHeight
    const offsetTop = distanceBetweenMouseAndTopPointOfScrollableElement <= maxOffset ? distanceBetweenMouseAndTopPointOfScrollableElement : maxOffset
    return offsetTop
}

/**
 * 
 * @param {Number} offsetTop 
 */
function calculateOffsetBasedOnOffsetTop(offsetTop) {
    const percentage = (offsetTop / scrollbarHeight) * 100
    const offsetTopForContent = (loader.offsetHeight) * (percentage / 100)
    offset = offsetTopForContent >= loader.offsetHeight - scrollbarHeight ? loader.offsetHeight - scrollbarHeight : offsetTopForContent
}

/**
 * 
 * @param {Number} offsetTop 
 */
function updateContentOnScreenBasedOnOffsetTop(offsetTop) {
    bar.style = `top: ${offsetTop}px;`
    firstLine = Math.floor(offset / 25)
    lastLine = firstLine + maxVisibleLinesOnScreen
    reloadDisplayedLines()
    loader.style = `height: ${loaderheight}px; top: -${offset}px; `
}

window.addEventListener('mouseup', (event) => {
    if (barIsSelected) barIsSelected = false
})
