import LineBUilder from "./lineBuilder.js"
import CustomContentMarker from "./CustomMarkerBuilder.js"

const lineNumerationElement = document.getElementById('line-numeration')
const editorElement = document.getElementById('editor')
const contentElement = document.getElementById('content')

// This Prototype has to upgrade the content loading mechanism and allow text selection

// --> NEEDED FOR CONTENT LOADING
const listOfPossibleLinesToDisplay = [
    `function getName(age) { console.log("MEOW"); }`,
    "This is a long line to be displayed, and for that reason it will have a lot of text inside it."
]
const numberOfLines = 2000
const maximumVisibleLinesOnScreen = Math.round(contentElement.offsetHeight / 28.8);
let lastVisibleLine = maximumVisibleLinesOnScreen
let firstVisibleLine = 0
let indexOfLine = 0
editorElement.style = `height: ${numberOfLines * 28.8}px;`

class Line {

    constructor(index) {
        this.index = index
        this.content = this.getLineContent(index)
        this.numeration = this.getLineNumerationBasedOnIndexInLoop(index)
    }

    getLineContent(index) {
        this.updateIndexOfLineToMatchIndexFromPossibleLinesToDisplay(index)
        return listOfPossibleLinesToDisplay[indexOfLine]
    }

    getLineNumerationBasedOnIndexInLoop(index) {
        return String(index + 1)
    }

    updateIndexOfLineToMatchIndexFromPossibleLinesToDisplay(index) {
        if (index % 2 == 0) {
            indexOfLine = 0
        } else { indexOfLine = 1 }
    }
}

// <-- NEEDED FOR CONTENT LOADING

// --> NEEDED FOR TEXT SELECTION
let isSelectingText = false
let isScrolling = false
let startingPoint = null
let releasingPoint = null

/**
 * The class takes only the most important characteristics of the Range object, and stores them.
 */
class CustomRangeElement {
    /**
     * 
     * @param {Range} range 
     */
    constructor(range) {
        this.lineOfStartContainer = range.startContainer.parentElement.parentElement
        this.startContainer = range.startContainer.parentElement
        this.startOffset = range.startOffset
        this.startContainerOffset = this.startContainer.parentElement.offsetLeft
        this.offsetTopForStartingLine = this.lineOfStartContainer.offsetTop
        this.lineOfEndContainer = range.endContainer.parentElement.parentElement
        this.endContainer = range.endContainer.parentElement
        this.endContainerOffset = this.endContainer.parentElement.offsetLeft
        this.endOffset = range.endOffset
        this.offsetTopForEndingLine = this.lineOfEndContainer.offsetTop
    }
}



// <-- NEEDED FOR TEXT SELECTION
/**
 * Load lines if they are still within the number of total lines. Else do nothing.
 */
function loadLines() {
    if (lastVisibleLine <= numberOfLines)
        refreshVisibleLines()
}

/**
 * Clean up the no longer visible lines, then load the lines in the new visible boundaries.
 */
function refreshVisibleLines() {
    cleanUpLinesWhichAreNoLongerVisible()
    for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
        buildLineForIndexIfItDoesNotAlreadyExist(index)
    }
}

/**
 * Loops through the currently visible lines to check if they should be visible or not.
 */
function cleanUpLinesWhichAreNoLongerVisible() {
    const visibleLines = lineNumerationElement.childNodes
    visibleLines.forEach(visibleLine => {
        removeLineIfItIsOutsideOfBoundariesForVisibleLines(visibleLine)
    });
}

/**
 * 
 * @param {HTMLElement} visibleLine 
 * --
 * Removes the line if it is outsdie of the boundaries for visible lines on screen.
 */
function removeLineIfItIsOutsideOfBoundariesForVisibleLines(visibleLine) {
    const lineId = visibleLine.id
    const onlyTheNumber = String(lineId).replace('numeration-', '')
    const lineContent = document.getElementById(onlyTheNumber)
    if (Number(onlyTheNumber < firstVisibleLine) || Number(onlyTheNumber) > lastVisibleLine) {
        visibleLine.remove()
    }
    if (lineContent && Number(onlyTheNumber < firstVisibleLine) || Number(onlyTheNumber) > lastVisibleLine) lineContent.remove()
}
/**
 * 
 * @param {Number} index 
 * --
 * Buils a line element only if it does not currently exist - if it is not already visible on the screeen.
 */
function buildLineForIndexIfItDoesNotAlreadyExist(index) {
    const lineNumeration = document.getElementById(`numeration-${index}`)
    if (lineNumeration == null && index < numberOfLines) {
        buildLineForIndex(index)
    }
}

/**
 * 
 * @param {Number} index 
 * --
 * Display visible line on the screen for index.
 */
function buildLineForIndex(index) {
    const line = new Line(index)
    addNumerationElementToSection(line)
    addLineContentToContent(line)
}

/**
 * 
 * @param {Line} line 
 * --
 * Appends a line numeration element to the line numeration section
 */
function addNumerationElementToSection(line) {
    const lineNumeration = buildLineNumerationElementForLine(line)
    lineNumerationElement.appendChild(lineNumeration)
}

/**
 * 
 * @param {Line} line 
 * --
 * Creates a <span></span> element, which displyas the number of the line.
 * 
 */
function buildLineNumerationElementForLine(line) {
    const lineNumeration = document.createElement('span')
    lineNumeration.classList.add('numeration')
    lineNumeration.setAttribute('id', `numeration-${line.index}`)
    lineNumeration.style = `top:${line.index * 28.8}px;`
    lineNumeration.textContent = line.numeration
    return lineNumeration
}

/**
 * 
 * @param {Line} line 
 * --
 * Appends a line content element to the content section.
 */
function addLineContentToContent(line) {
    const lineContent = buildLineWithContent(line)
    contentElement.appendChild(lineContent)
}

/**
 * 
 * @param {Line} line 
 * -- 
 * Build the content of the line as a div element.
 */
function buildLineWithContent(line) {
    const builder = new LineBUilder(line.content)
    const lineElement = builder.buildLine()
    lineElement.setAttribute('id', String(line.index))
    lineElement.style = `top:${line.index * 28.8}px;`
    handleMouseMovement(lineElement)
    return lineElement
}

/**
 * 
 * @param {HTMLElement} lineElement 
 */
function handleMouseMovement(lineElement) {
    // no matter what is being done the selection gets lost once you start scrolling, even if the selection is based on the editor and not the line
    lineElement.addEventListener('mousedown', (event) => {
        isSelectingText = true
    })
    lineElement.addEventListener('mouseup', (event) => {
        isSelectingText = false
        startingPoint = null
        releasingPoint = null
        isScrolling = false
    })
    lineElement.addEventListener('mousemove', (event) => {
        if (isSelectingText) {
            selectText(firstVisibleLine, event)
        }
    })
}

loadLines()

/**
 * The function creates the elemen containing the selected text
 */
function buildMarker() {
    let marker = document.getElementById('marker')
    if (marker) marker.remove()
    marker = document.createElement('div')
    marker.setAttribute('id', 'marker')
    marker.classList.add('marker')
    editorElement.prepend(marker)
}

document.addEventListener('scroll', () => {
    if (isSelectingText) isScrolling = true
    firstVisibleLine = Math.round(document.documentElement.scrollTop / 28.8)
    lastVisibleLine = firstVisibleLine + maximumVisibleLinesOnScreen
    loadLines()

})

/**
 * Handle the selection of text.
 * @param {Number} firstVisibleLine 
 * @param {Event} event 
 */
function selectText(firstVisibleLine, event) {
    buildMarker()
    const range = document.getSelection().getRangeAt(0)
    if (startingPoint == null) {
        startingPoint = new CustomRangeElement(range)
    }
    else {
        releasingPoint = new CustomRangeElement(range)
        let customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        if (isScrolling) {
            customMarker.buildMarkerWithScrolling(event, firstVisibleLine)
        }
        customMarker.buildMarkerWithoutScrolling()

        customMarker = null
        releasingPoint = null
    }

}