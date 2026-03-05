const mainContainer = document.getElementById('container')
const loaderElement = document.getElementById('loader')
const scrollbarElement = document.getElementById('scrollbar')
const scrollbarAreaElement = document.getElementById('scrollable-area')
const barElement = document.getElementById('bar')

const scrollbarHeight = scrollbarElement.offsetHeight
const maxTopOffsetForBar = scrollbarHeight - barElement.offsetHeight
const minTopOffsetForBar = 0

const scrollingPowerInPixelsForEdge = 149.99999284744297
const scrollingPowerInPixelsForChrome = 100

const pixelsToScroll = 150

const lines = 2000
const lineHeightInPixels = 19
const maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)

const loaderHeight = (400 + maxVisibleLinesOnScreen - 1) * 25
loaderElement.style = `height: ${loaderHeight}px;`
let contentTopOffset = 0

let barIsSelected = false

window.addEventListener('wheel', (event) => {
    event.preventDefault()
    // console.log("USING WHEEL")
    const scrollingPower = calculateScrollingPowerForDeltaY(event.deltaY)
    const offsetTop = scrollingPower * pixelsToScroll
    scrollBasedOnScrollingPower(scrollingPower, offsetTop)

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
    contentTopOffset = contentTopOffset + offsetTop >= loaderElement.offsetHeight - scrollbarHeight ? loaderElement.offsetHeight - scrollbarHeight : contentTopOffset += offsetTop
    const offsetTopForBar = calculateOffetTopForBarBasedOnScrollingPower(scrollingPower)
    const currentTopOffsetForBar = bar.offsetTop
    const newTopOffsetForBar = currentTopOffsetForBar + offsetTopForBar <= maxTopOffsetForBar ? currentTopOffsetForBar + offsetTopForBar : maxTopOffsetForBar
    bar.style = `top: ${newTopOffsetForBar}px;`
}

function scrollUp(offsetTop, scrollingPower) {
    contentTopOffset = contentTopOffset + offsetTop <= 0 ? 0 : contentTopOffset += offsetTop
    const offsetTopForBar = calculateOffetTopForBarBasedOnScrollingPower(scrollingPower)
    const currentTopOffsetForBar = bar.offsetTop
    const newTopOffsetForBar = currentTopOffsetForBar + offsetTopForBar >= minTopOffsetForBar ? currentTopOffsetForBar + offsetTopForBar : minTopOffsetForBar
    bar.style = `top: ${newTopOffsetForBar}px;`
}

function calculateOffetTopForBarBasedOnScrollingPower(scrollingPower) {
    const offsetTop = scrollingPower * 150
    const percentage = (offsetTop / loaderHeight) * 100
    const offsetTopForBar = scrollbarHeight * (percentage / 100)
    return offsetTopForBar
}


barElement.addEventListener('mousedown', (event) => {
    barIsSelected = true
})

scrollbarAreaElement.addEventListener('mousemove', (event) => {
    if (barIsSelected) {
        const offsetTop = calculateOffsetTopForMouseEvent(event)
        calculateOffsetBasedOnOffsetTop(offsetTop)
        updateContentOnScreenBasedOnOffsetTop(offsetTop)
    }
})

/**
 * 
 * @param {MouseEvent} event 
 */
function calculateOffsetTopForMouseEvent(event) {
    const distanceBetweenMouseAndTopPointOfScrollableElement = event.clientY - scrollbarAreaElement.offsetTop
    const offsetTop = distanceBetweenMouseAndTopPointOfScrollableElement <= maxTopOffsetForBar ? distanceBetweenMouseAndTopPointOfScrollableElement : maxTopOffsetForBar
    return offsetTop
}

/**
 * 
 * @param {Number} offsetTop 
 */
function calculateOffsetBasedOnOffsetTop(offsetTop) {
    const percentage = (offsetTop / scrollbarHeight) * 100
    const offsetTopForContent = (loaderElement.offsetHeight) * (percentage / 100)
    contentTopOffset = offsetTopForContent >= loaderElement.offsetHeight - scrollbarHeight ? loaderElement.offsetHeight - scrollbarHeight : offsetTopForContent
}

/**
 * 
 * @param {Number} offsetTop 
 */
function updateContentOnScreenBasedOnOffsetTop(offsetTop) {
    bar.style = `top: ${offsetTop}px;`
}

window.addEventListener('mouseup', (event) => {
    if (barIsSelected) barIsSelected = false
})
