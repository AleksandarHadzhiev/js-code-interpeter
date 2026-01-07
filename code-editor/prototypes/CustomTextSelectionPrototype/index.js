import LineBUilder from "./lineBuilder.js"

const lineNumerationElement = document.getElementById('line-numeration')
const editorElement = document.getElementById('editor')
const contentElement = document.getElementById('content')

// This Prototype has to upgrade the content loading mechanism and allow text selection

// --> NEEDED FOR CONTENT LOADING
const listOfPossibleLinesToDisplay = [
    `function getName(age) { console.log("MEOW"); }`,
    "This is a short line",
    "This is a long line to be displayed, and for that reason it will have a lot of text inside it."
]
const lastIndexOfPossibleLinesToDisplay = listOfPossibleLinesToDisplay.length - 1
const numberOfLines = 2000
const maximumVisibleLinesOnScreen = Math.round(contentElement.offsetHeight / 28.8);
let lastVisibleLine = maximumVisibleLinesOnScreen
let firstVisibleLine = 0
let indexOfLine = 0
editorElement.style = `height: ${numberOfLines * 28.8}px;`

class Line {

    constructor(index) {
        this.index = index
        this.content = this.getLineContent()
        this.numeration = this.getLineNumerationBasedOnIndexInLoop(index)
    }

    getLineContent() {
        this.updateIndexOfLineToMatchIndexFromPossibleLinesToDisplay()
        return listOfPossibleLinesToDisplay[indexOfLine]
    }

    getLineNumerationBasedOnIndexInLoop(index) {
        return String(index + 1)
    }

    updateIndexOfLineToMatchIndexFromPossibleLinesToDisplay() {
        if (indexOfLine == lastIndexOfPossibleLinesToDisplay) {
            indexOfLine = 0
        }
        else indexOfLine += 1
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
        this.buildMarkerIfstartingPointAndreleasingPointAreOnTheSameLine()
    }

    /**
     * Build the marker only if the startingPoint and Releasing point are on the same line
     */
    buildMarkerIfstartingPointAndreleasingPointAreOnTheSameLine() {
        const isTheSameStartingLine = this.startingPoint.lineOfStartContainer == this.releasingPoint.lineOfStartContainer
        const isTheSameEndingLine = this.startingPoint.lineOfEndContainer == this.releasingPoint.lineOfEndContainer
        const isTheSameLine = isTheSameEndingLine && isTheSameStartingLine
        if (isTheSameLine) {
            console.log("MARKER IS ON THE SAME LINE")
            const coordinates = this._getCoordinatesOfTheLine()
            this._buildLineInMarkerForCoordinates(coordinates)
        }
        else {
            console.log("FALSE")
        }
    }

    _getCoordinatesOfTheLine() {
        let startingPosition = null
        let endingPosition = null
        let leftOffset = 0
        let widthOfSelectedText = 0
        if (this.startingPoint.startContainer.offsetLeft <= this.releasingPoint.startContainer.offsetLeft) {
            startingPosition = this.startingPoint
            endingPosition = this.releasingPoint
        }
        else {
            startingPosition = this.releasingPoint
            endingPosition = this.startingPoint
        }
        leftOffset = this._getLeftOffsetForStartingPosition(startingPosition)
        widthOfSelectedText = this._getWidthOfMarkedLine(leftOffset, endingPosition)
        return new StartingPositionOfLine(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
    }

    /**
     * Calculates the full left offset of the position, by taking its initial left offset and adding the additonal pixels from the unmarked text.
     * @param {CustomRangeElement} position 
     * @returns The full left offset.
     */
    _getLeftOffsetForStartingPosition(position) {
        let offsetLeft = position.startContainer.offsetLeft
        const spanText = String(position.startContainer.textContent)
        const neededText = spanText.substring(0, position.startOffset)
        const leftOffsetFromUnmarkedText = this._calculateLeft(neededText)
        offsetLeft += leftOffsetFromUnmarkedText
        return offsetLeft
    }

    /**
     * Calculates the full left offset of the position, by taking its initial left offset and adding the additonal pixels from the unmarked text.
     * @param {CustomRangeElement} position 
     * @returns The full left offset.
    */
    _getLeftOffsetForEndingPosition(position) {
        let offsetLeft = position.endContainer.offsetLeft
        const spanText = String(position.endContainer.textContent)
        const neededText = spanText.substring(0, position.endOffset)
        const leftOffsetFromUnmarkedText = this._calculateLeft(neededText)
        offsetLeft += leftOffsetFromUnmarkedText
        return offsetLeft
    }
    /**
     * The function calculates the additional left offset by creating a span element from where 
     * to fetch its width, so that it is the exact width which the text takes and removes the element
     * so that there is no element polution to the DOM.
     * @param {String} text 
     * @returns The width of the element, which is used as additional left offset.
     */
    _calculateLeft(text) {
        const element = document.createElement('span')
        element.textContent = text
        element.classList.add('line-content-marker')
        editorElement.prepend(element)
        const width = element.offsetWidth
        element.remove()
        return width
    }

    /**
     * Calculate the width of the selected text.
     * @param {Number} offsetLeft 
     * @param {CustomRangeElement} endingPosition  
     * @returns The width of selected text as a number
    */
    _getWidthOfMarkedLine(offsetLeft, endingPosition) {
        const offsetLeftOfendingPosition = this._getLeftOffsetForEndingPosition(endingPosition)
        let widthOfSelectedText = offsetLeftOfendingPosition - offsetLeft
        return widthOfSelectedText
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
        const customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        customMarker.buildMarker()
    }

}