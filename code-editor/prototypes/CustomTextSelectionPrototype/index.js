import LineBUilder from "./lineBuilder.js"
import SingleLineSelector from "./SingleLineSelector.js"

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


/**
 * Represents the starting position of line in top and left coordinates and the width of the line.
 */
class StartingPositionOfLine {
    /**
     * 
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} width
     */
    constructor(left, top, width) {
        this.left = left
        this.top = top
        this.width = width
    }
}

/**
 * The class makes use of the CustomRangeElement class and based on the first selection of the user - the point where the user started selecting text
 * and the last selection of the user - the point where the user stopped selecting and released the mouse
 * a marker - highlighter - will be created.
 */
class CustomContentMarker {
    /**
     * 
     * @param {CustomRangeElement} startingPoint 
     * @param {CustomRangeElement} releasingPoint 
     */
    constructor(startingPoint, releasingPoint) {
        this.startingPoint = startingPoint
        this.releasingPoint = releasingPoint
    }

    /**
     * Buids marker based on the first and last selections of the user.
     */
    buildMarker() {
        if (this._checkIfTextSelectionIsOneLine()) {
            console.log("MARKER IS ON THE SAME LINE")
            this._buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine()
        }
        else {
            console.log("FALSE")
            // this._buildMarkerIfStartingPointAndReleasingPointAreOnDifferentLines()
        }
    }

    /**
     * Build the marker only if the startingPoint and Releasing point are on the same line
     */
    _buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine() {
        const singleLineSelector = new SingleLineSelector(this.startingPoint, this.releasingPoint)
        const coordinates = singleLineSelector.getCoordinatesForSingleLineSelection()
        this._buildLineInMarkerForCoordinates(coordinates)
    }

    /**
     * 
     * @returns True if the selected content is on the same line. False if its on multiple lines.
     */
    _checkIfTextSelectionIsOneLine() {
        const isTheSameStartingLine = this.startingPoint.lineOfStartContainer == this.releasingPoint.lineOfStartContainer
        const isTheSameEndingLine = this.startingPoint.lineOfEndContainer == this.releasingPoint.lineOfEndContainer
        const isTheSameLine = isTheSameEndingLine && isTheSameStartingLine
        return isTheSameLine
    }

    /**
     * Creates a line and appends it to the marker.
     * @param {StartingPositionOfLine} coordinates 
     */
    _buildLineInMarkerForCoordinates(coordinates) {
        const marker = document.getElementById('marker')
        const lineInMarker = document.createElement('div')
        lineInMarker.style = `
            position: absolute;
            top: ${coordinates.top}px;
            left: ${coordinates.left}px;
            width: ${coordinates.width}px;
            background-color: green;
            height: 28.8px;
            color: transparent;
        `
        marker.append(lineInMarker)
    }

    /**
     * The function handles the selection of text containing multiple lines.
     */
    _buildMarkerIfStartingPointAndReleasingPointAreOnDifferentLines() {
        /**
         * The current code can select text on one line, multiple lines and multiple lines with scrolling which keeps the this.startingPoint.lineOfStartContainer,
         * still visible on the screen - aka the line from where the text selection begins.
         * 
         * The question is how to simplify it so that i can remove repetitive code - checks, and logic.
         */
        let startingSelection = this.releasingPoint
        let releasingSelection = this.startingPoint
        let startingLineToFullyColorise = Number(this.releasingPoint.lineOfStartContainer.id) + 1
        let lastLineToFullyColorise = Number(this.startingPoint.lineOfStartContainer.id)
        if (this._checkIfSelectionIsTurningRightForMultilineSelection()) {
            console.log("TURNING RIGHT")
            startingSelection = this.startingPoint
            releasingSelection = this.releasingPoint
            startingLineToFullyColorise = Number(this.startingPoint.lineOfStartContainer.id) + 1
            lastLineToFullyColorise = Number(this.releasingPoint.lineOfEndContainer.id)
        }
        // ALREADY WRONG AS IT ADDS TOO MUCH CHECKING -> MAKING THE CODE HARD TO MAINTAIN
        else if (Number(this.releasingPoint.lineOfStartContainer.id) >
            Number(this.releasingPoint.lineOfEndContainer.id)) {
            startingLineToFullyColorise = Number(this.releasingPoint.lineOfEndContainer.id) + 1
        }
        // COLORISE FIRST LINE IS UNDER QUESTION FOR STABILITY WHEN SELECTING LEFT TO RIGHT
        this._coloriseFirstLine(startingSelection)
        this._coloriseLinesInBetween(startingLineToFullyColorise, lastLineToFullyColorise)
        this._coloriseLastLine(releasingSelection)
    }

    /**
     * @returns True if direction is left to right and False if direction is right to left.
     */
    _checkIfSelectionIsTurningRightForMultilineSelection() {
        const startingLineId = Number(this.startingPoint.lineOfStartContainer.id)
        const releaseLineId = Number(this.releasingPoint.lineOfStartContainer.id) <=
            Number(this.releasingPoint.lineOfEndContainer.id) ?
            Number(this.releasingPoint.lineOfStartContainer.id) :
            Number(this.releasingPoint.lineOfEndContainer.id)
        if (startingLineId <= releaseLineId) return true
        return false
    }

    /**
     * @param {CustomRangeElement} startingSelection 
     */
    _coloriseFirstLine(startingSelection) {
        const coordinates = this._findTheCoordiantesForTheFirstLine(startingSelection)
        this._buildLineInMarkerForCoordinates(coordinates)
    }

    /**
     * @param {CustomRangeElement} startingSelection 
     * @returns the coordinates of the first line in which there is text selection
     */
    _findTheCoordiantesForTheFirstLine(startingSelection) {
        let leftOffset = this._getLeftOffsetForStartingPosition(startingSelection)
        let width = this._calculateWidthToSelectForSelectionBasedOnLeftOffset(leftOffset, startingSelection)
        let topOffset = startingSelection.lineOfStartContainer.offsetTop
        if (Number(this.releasingPoint.lineOfStartContainer.id) >
            Number(this.releasingPoint.lineOfEndContainer.id)) {
            leftOffset = this._getLeftOffsetForEndingPosition(startingSelection)
            width = this._getWidthOfSelectedTextForEndContainer(startingSelection, leftOffset)
            topOffset = startingSelection.lineOfEndContainer.offsetTop
        }
        const coordinates = new StartingPositionOfLine(leftOffset, topOffset, width)
        return coordinates
    }

    /**
     * @param {CustomRangeElement} position 
     * @param {Number} offsetLeft
     * @returns The width of the selected text for the ending container of a CustomRangeElementProvided
     */
    _getWidthOfSelectedTextForEndContainer(position, offsetLeft) {
        const lineText = position.lineOfEndContainer.textContent
        const widthOfFullText = this._calculateLeft(lineText)
        return widthOfFullText - offsetLeft
    }
    /**
     * 
     * @param {Number} leftOffset 
     * @param {CustomRangeElement} startingSelection
     * @returns The width of the text the select
     */
    _calculateWidthToSelectForSelectionBasedOnLeftOffset(leftOffset, startingSelection) {
        const line = startingSelection.lineOfStartContainer
        const text = String(line.textContent)
        const fullWidth = this._calculateLeft(text)
        return fullWidth - leftOffset
    }

    /**
    * @param {CustomRangeElement} endingSelection 
    */
    _coloriseLastLine(endingSelection) {
        const coordinates = this._findTheCoordiantesForTheLastLine(endingSelection)
        this._buildLineInMarkerForCoordinates(coordinates)
    }

    /**
   * @param {CustomRangeElement} endingSelection 
   * @returns the coordinates of the first line in which there is text selection
   */
    _findTheCoordiantesForTheLastLine(endingSelection) {
        const width = this._getLeftOffsetForEndingPosition(endingSelection) // the leftOffset is the width
        const topOffset = endingSelection.lineOfEndContainer.offsetTop
        const coordinates = new StartingPositionOfLine(0, topOffset, width)
        return coordinates
    }

    /**
     * @param {Number} indexOfFirstLineToFullyColorise
     * @param {Number} indexOfLastLineToFullyColorise
     */
    _coloriseLinesInBetween(indexOfFirstLineToFullyColorise, indexOfLastLineToFullyColorise) {
        if (indexOfLastLineToFullyColorise - indexOfFirstLineToFullyColorise > 0) {
            for (let index = indexOfFirstLineToFullyColorise; index < indexOfLastLineToFullyColorise; index++) {
                const lineElement = document.getElementById(String(index));
                const width = this._calculateLeft(lineElement.textContent)
                const topOffset = lineElement.offsetTop
                const leftOffset = 0
                const coordinates = new StartingPositionOfLine(leftOffset, topOffset, width)
                this._buildLineInMarkerForCoordinates(coordinates)
            }
        }
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
    return lineElement
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
    firstVisibleLine = Math.round(document.documentElement.scrollTop / 28.8)
    lastVisibleLine = firstVisibleLine + maximumVisibleLinesOnScreen
    loadLines()
})


// no matter what is being done the selection gets lost once you start scrolling, even if the selection is based on the editor and not the line
editorElement.addEventListener('mousedown', (event) => {
    isSelectingText = true
})
editorElement.addEventListener('mouseup', (event) => {
    isSelectingText = false
    startingPoint = null
    releasingPoint = null
})
editorElement.addEventListener('mousemove', (event) => {
    if (isSelectingText) {
        selectText()
    }
})


/**
 * Handle the selection of text.
 */
function selectText() {
    buildMarker()
    const range = document.getSelection().getRangeAt(0)
    if (startingPoint == null) {
        startingPoint = new CustomRangeElement(range)
    }
    else {
        releasingPoint = new CustomRangeElement(range)
        let customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        customMarker.buildMarker()
        customMarker = null
        releasingPoint = null
    }

}