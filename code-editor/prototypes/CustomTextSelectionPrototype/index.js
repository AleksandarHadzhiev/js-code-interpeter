import LineBUilder from "./lineBuilder.js"
import CustomContentMarker from "./CustomMarkerBuilder.js"
import NewAlgorithm from "./NewAlgorithm.js"

const lineNumerationElement = document.getElementById('line-numeration')
const editorElement = document.getElementById('editor')
const contentElement = document.getElementById('content')
let algorithm = null
// This Prototype has to upgrade the content loading mechanism and allow text selection

// --> NEEDED FOR CONTENT LOADING
const listOfPossibleLinesToDisplay = [
    `function getName(age) { console.log("MEOW"); }`,
    "This is a long line to be displayed, and for that reason it will have a lot of text inside it."
]
const numberOfLines = 2000
const maximumVisibleLinesOnScreen = Math.round(contentElement.offsetHeight / 27.6);
let lastVisibleLine = maximumVisibleLinesOnScreen
let firstVisibleLine = 0
let indexOfLine = 0
let customMarker = null
editorElement.style = `height: ${numberOfLines * 27.6}px;`

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
    lineNumeration.style = `top:${line.index * 27.6}px;`
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
    lineElement.style = `top:${line.index * 27.6}px;`
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
            selectText(event)
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
    firstVisibleLine = Math.round(document.documentElement.scrollTop / 27.6)
    lastVisibleLine = firstVisibleLine + maximumVisibleLinesOnScreen - 1
    loadLines()
    let marker = document.getElementById('marker')
    if (marker && isSelectingText == false) {

        customMarker.displayMarker(firstVisibleLine, lastVisibleLine)
        algorithm.displayMarker(firstVisibleLine, lastVisibleLine)
    }
})

/**
 * Handle the selection of text.
 * @param {MouseEvent} event 
 */
function selectText(event) {
    buildMarker()
    const selection = document.getSelection()
    console.log(selection)
    const range = document.getSelection().getRangeAt(0)
    console.log(range)
    if (startingPoint == null) {
        const offsetLeft = range.startContainer.parentElement.offsetLeft
        startingPoint = new CustomRangeElement(range)
        startingPoint.startContainerOffset = offsetLeft
        startingPoint.offsetTopForStartingLine = range.startContainer.parentElement.parentElement.offsetTop
        startingPoint.offsetTopForEndingLine = range.endContainer.parentElement.parentElement.offsetTop
    }
    else {
        releasingPoint = new CustomRangeElement(range)
        releasingPoint.endContainerOffset = range.endContainer.parentElement.offsetLeft
        releasingPoint.startContainerOffset = range.startContainer.parentElement.offsetLeft
        releasingPoint.offsetTopForStartingLine = range.startContainer.parentElement.parentElement.offsetTop
        releasingPoint.offsetTopForEndingLine = range.endContainer.parentElement.parentElement.offsetTop
        customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        algorithm = new NewAlgorithm(startingPoint, releasingPoint)
        // if (isScrolling) {
        //     customMarker.buildMarkerWithScrolling(event, firstVisibleLine, lastVisibleLine)
        // }
        // else customMarker.buildMarkerWithoutScrolling()
        customMarker.build(event, firstVisibleLine, lastVisibleLine)
        releasingPoint = null
    }

}