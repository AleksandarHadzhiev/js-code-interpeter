import LineBUilder from "./lineBuilder.js"
import CustomContentMarker from "./CustomMarkerBuilder.js"
import CaretBuilder from "./CaretBuilder.js"
import CustomRangeElement from "./CustomRangeElement.js"
import LineColoriser from "./ColoriseLines.js"

const lineNumerationElement = document.getElementById('line-numeration')
const editorElement = document.getElementById('editor')
const contentElement = document.getElementById('content')
// This Prototype has to upgrade the content loading mechanism and allow text selection

// --> NEEDED FOR CONTENT LOADING

const Operation = {
    ADD: "+",
    SUBSTRACT: "-"
}

const MousePosition = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
    CENTRE: "centre"
}

const WindowSection = {
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTRE: "CENTRE",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}

const StartingPointVisibility = {
    VISIBLE: "VISIBLE",
    EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN: "EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN",
    LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN: "LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN"
}

const MINIMAL_LINE_HEIGHT = 27.6
const NUMBER_OF_LINES = 2000
const OFFSET_TOP_FOR_MOUSE_ON_SCROLLING = 0
const OFFSET_LEFT_FOR_CONTENT_TO_BE_USABLE_ON_MOUSE_MOVE = 68



const listOfPossibleLinesToDisplay = [
    `function getName(age) { console.log("MEOW"); }`,
    "This is a long line to be displayed, and for that reason it will have a lot of text inside it."
]
const maximumVisibleLinesOnScreen = Math.round(contentElement.offsetHeight / MINIMAL_LINE_HEIGHT);
let lastVisibleLine = maximumVisibleLinesOnScreen
let firstVisibleLine = 0
let previousFirstVisibleLine = 0
let previousLastVisibleLine = 0
let indexOfLine = 0
let windowSectionScrollig = null
let customMarker = null
editorElement.style = `height: ${NUMBER_OF_LINES * MINIMAL_LINE_HEIGHT}px;`
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

// <-- NEEDED FOR TEXT SELECTION
/**
 * Load lines if they are still within the number of total lines. Else do nothing.
 */
function loadLines() {
    console.time('doSomething')
    // for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
    //     buildLineForIndexIfItDoesNotAlreadyExist(index)
    // }
    if (lastVisibleLine <= NUMBER_OF_LINES)
        refreshVisibleLines()
    console.timeEnd('doSomething')
}


function refresh() {
    const differenceBetweenNewAndPreviousFirstVisibleLine = firstVisibleLine - previousFirstVisibleLine
    console.log(`NUMBER OF DIFFERENT LINES: ${differenceBetweenNewAndPreviousFirstVisibleLine}`)
    if (differenceBetweenNewAndPreviousFirstVisibleLine > 0) {
        if (differenceBetweenNewAndPreviousFirstVisibleLine < maximumVisibleLinesOnScreen) {
            changeLines(differenceBetweenNewAndPreviousFirstVisibleLine, previousLastVisibleLine, previousFirstVisibleLine)
        }
        else {
            lineNumerationElement.replaceChildren([])
            contentElement.replaceChildren([])
            for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
                buildLineForIndexIfItDoesNotAlreadyExist(index)
            }
            // iterateThroughLineChanges(maximumVisibleLinesOnScreen, previousLastVisibleLine, previousFirstVisibleLine)
        }
    }
    else if (differenceBetweenNewAndPreviousFirstVisibleLine < 0) {
        if (differenceBetweenNewAndPreviousFirstVisibleLine * -1 < maximumVisibleLinesOnScreen) {
            changeLines(differenceBetweenNewAndPreviousFirstVisibleLine * -1, firstVisibleLine, lastVisibleLine)
        }
        else {
            lineNumerationElement.replaceChildren([])
            contentElement.replaceChildren([])
            for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
                buildLineForIndexIfItDoesNotAlreadyExist(index)
            }
            // iterateThroughLineChanges(maximumVisibleLinesOnScreen, firstVisibleLine, lastVisibleLine)
        }
    }
}


function changeLines(NumberOfLinesToChange, lineToAdd, lineToRemove) {
    // console.log(NumberOfLinesToChange)
    // console.log(lineToAdd, lineToRemove)
    for (let index = NumberOfLinesToChange; index >= 0; index--) {
        // console.log(index)
        const newLineBasedOnLastVisibleLine = lineToAdd + index
        const previousLine = lineToRemove + index
        // console.log(previousLine)
        // console.log(newLineBasedOnLastVisibleLine)
        const line = new Line(newLineBasedOnLastVisibleLine)
        rebuildNumerationForIndexWithLine(previousLine, line)
        rebuildContentElementAtIndexWithLine(previousLine, line)
        // buildLineForIndexIfItDoesNotAlreadyExist(newLineBasedOnLastVisibleLine)
        // removeLinesWhichAreNoLongerVisible(previousLine)
    }
}

/**
 * 
 * @param {Number} index 
 * @param {Line} line 
 */
function rebuildNumerationForIndexWithLine(index, line) {
    const numeration = document.getElementById(`numeration-${index}`)
    if (numeration) {
        numeration.setAttribute('id', `numeration-${line.index}`)
        numeration.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
        numeration.textContent = line.numeration
    }
}

/**
 * 
 * @param {Number} index 
 * @param {Line} line 
 */
function rebuildContentElementAtIndexWithLine(index, line) {
    const lineContent = document.getElementById(String(index))
    if (lineContent) {
        lineContent.setAttribute('id', `${line.index}`)
        lineContent.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
        // const builder = new LineBUilder(line.content)
        // const innerHTML = builder.buildWordsForLine()
        // lineContent.innerHTML = innerHTML
    }
}

window.addEventListener('load', () => {
    console.log("HERE")
})

/**
 * Clean up the no longer visible lines, then load the lines in the new visible boundaries.
 */
function refreshVisibleLines() {
    cleanUpLinesWhichAreNoLongerVisible()
    for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
        buildLineForIndexIfItDoesNotAlreadyExist(index)
    }
}

function reloadLines() {
    const differenceBetweenNewAndPreviousFirstVisibleLine = firstVisibleLine - previousFirstVisibleLine
    if (differenceBetweenNewAndPreviousFirstVisibleLine > 0) {
        if (differenceBetweenNewAndPreviousFirstVisibleLine < maximumVisibleLinesOnScreen) {
            iterateThroughLineChanges(differenceBetweenNewAndPreviousFirstVisibleLine, previousLastVisibleLine, previousFirstVisibleLine)
        }
        else {
            iterateThroughLineChanges(maximumVisibleLinesOnScreen, previousLastVisibleLine, previousFirstVisibleLine)
        }
    }
    else if (differenceBetweenNewAndPreviousFirstVisibleLine < 0) {
        if (differenceBetweenNewAndPreviousFirstVisibleLine * -1 < maximumVisibleLinesOnScreen) {
            iterateThroughLineChanges(differenceBetweenNewAndPreviousFirstVisibleLine * -1, firstVisibleLine, lastVisibleLine)
        }
        else {
            iterateThroughLineChanges(maximumVisibleLinesOnScreen, firstVisibleLine, lastVisibleLine)
        }
    }
}


function iterateThroughLineChanges(NumberOfLinesToChange, lineToAdd, lineToRemove) {
    for (let index = 0; index < NumberOfLinesToChange; index++) {
        const newLineBasedOnLastVisibleLine = lineToAdd + index
        const previousLine = lineToRemove + index
        buildLineForIndexIfItDoesNotAlreadyExist(newLineBasedOnLastVisibleLine)
        removeLinesWhichAreNoLongerVisible(previousLine)
    }
}

function removeLinesWhichAreNoLongerVisible(index) {
    const lineNumeration = document.getElementById(`numeration-${index}`)
    const contentElement = document.getElementById(String(index))
    const lineExists = lineNumeration != null
    const isInBetweenVisibleLines = index < firstVisibleLine || index > lastVisibleLine
    if (isInBetweenVisibleLines && lineExists == true) {
        lineNumeration.remove()
        contentElement.remove()
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
    if (lineNumeration == null && index < NUMBER_OF_LINES) {
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
    lineNumeration.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
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
    lineElement.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
    handleMouseMovement(lineElement)
    lineElement.scrollIntoView()
    // console.log(lineElement)
    return lineElement
}

/**
 * 
 * @param {Number} idAsNumber 
 * @param {HTMLElement} lineElement
 * @param {Number} distance
 */
function rebuildLine(idAsNumber, lineElement, distance) {
    // console.log(`FIRST VISIBLE LINE: ${firstVisibleLine} and LAST VISIBLE LINE: ${lastVisibleLine}`)
    // console.log(distance)
    const newId = lastVisibleLine - distance
    console.log(`NEW ID FOR LINE: ${newId}`)
    const line = new Line(newId)
    const lineNumeration = document.getElementById(`numeration-${idAsNumber}`)
    updateNumeration(lineNumeration, line)
    updateContent(line, lineElement)

}

/**
 * 
 * @param {HTMLElement} lineNumeration 
 * @param {Line} line 
 */
function updateNumeration(lineNumeration, line) {
    // console.log(lineNumeration)
    lineNumeration.setAttribute('id', `numeration-${line.index}`)
    lineNumeration.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
    lineNumeration.textContent = line.numeration
    // console.log(lineNumeration)
}

/**
 * 
 * @param {Line} line 
 * @param {HTMLElement} lineElement 
 */
function updateContent(line, lineElement) {
    // console.log(lineElement)
    const builder = new LineBUilder(line.content)
    lineElement.innerHTML = builder.buildWordsForLine()
    lineElement.setAttribute('id', String(line.index))
    lineElement.style = `top:${line.index * MINIMAL_LINE_HEIGHT}px;`
    // console.log(lineElement
}

/**
 * 
 * @param {HTMLElement} lineElement 
 */
function handleMouseMovement(lineElement) {
    lineElement.addEventListener('selectstart', (event) => {
        isSelectingText = true
    })
    lineElement.addEventListener('mouseup', (event) => {
        isSelectingText = false
        const range = document.getSelection().getRangeAt(0)
        const caretBuilder = new CaretBuilder(range)
        const caret = caretBuilder.buildCaretBasedOnMousePosition(event)
        contentElement.prepend(caret)
        startingPoint = null
        releasingPoint = null
        isScrolling = false
    })
    lineElement.addEventListener('rebuild', (event) => {
        // console.log(firstVisibleLine)
        const prevFirVis = event.detail.previousFirstVisibleLine
        const prevLasVis = event.detail.previousLastVisibleLine
        const idAsNumber = Number(lineElement.id)
        const distance = firstVisibleLine - prevFirVis
        // console.log(`DISTANCE: ${firstVisibleLine - prevFirVis}`)
        // console.log(`LINE_ID: ${idAsNumber} && NEW LINE_ID: ${firstVisibleLine + idAsNumber}`)
        if (distance > 0 && lastVisibleLine < NUMBER_OF_LINES) {
            console.log(idAsNumber, firstVisibleLine)
            if (idAsNumber < firstVisibleLine) {
                console.log("EXECUTE")
                rebuildLine(idAsNumber, lineElement, distance)
            }
        }
        else if (distance < 0) {
            if (idAsNumber > lastVisibleLine) {
                rebuildLine(idAsNumber, lineElement, distance * -1)
            }
        }
    })
    lineElement.addEventListener('mousemove', (event) => {
        if (isSelectingText) {
            selectText(event)
        }
    })
    lineElement.addEventListener('mousedown', (event) => {
        let marker = document.getElementById('marker')
        if (marker) marker.remove()
        startingPoint = null
        releasingPoint = null
        isSelectingText = false
        isScrolling = false
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
/**
 * Handle the selection of text.
 * @param {MouseEvent} event 
 */
function selectText(event) {
    windowSectionScrollig = WindowSection.CENTRE
    buildMarker()
    const range = document.getSelection().getRangeAt(0)
    if (startingPoint == null) {
        const offsetLeft = range.startContainer.parentElement.offsetLeft
        startingPoint = new CustomRangeElement(range)
        startingPoint.startContainerOffset = offsetLeft
        startingPoint.offsetTopForStartingLine = range.startContainer.parentElement.parentElement.offsetTop
        startingPoint.offsetTopForEndingLine = range.endContainer.parentElement.parentElement.offsetTop
    }
    else {
        releasingPoint = new CustomRangeElement(range)
        customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        customMarker.build(event, firstVisibleLine, lastVisibleLine)
        releasingPoint = null
    }
}

window.addEventListener('mousemove', (event) => {
    if (isSelectingText) {
        highlightTest(event)
    }
    // the mouseEvent contains pageX
    // the pageX is the only element 
    // which is of constant good use for the mouse position
    // the editorElement.scrollWidth is the other good property which 
    // could be used in developing the algorithm

    // need a refactoring for the line loading code, because majority of it is unstable
    // leading to errors which are not constant when i try to retrigger them.
    // const mouseEvent = event
    // const mousePositionForY = mouseEvent.pageY
    // if (isSelectingText && event.pageX != 0 && event.pageX >= editorElement.scrollWidth) {
    //     console.log(event.pageX)
    //     console.log(editorElement.scrollWidth)
    //     isScrollingOnTheRight = true
    //     console.log("IT WAS IN THE RIGHT")
    // }
    // else if (isSelectingText && event.pageX != 0 && event.pageX < editorElement.scrollWidth) {
    //     console.log(event.pageX)
    //     console.log(editorElement.scrollWidth)
    //     isScrollingOnTheRight = false
    //     console.log("IT LEFT THE RIGHT")
    // }
    // if (isSelectingText && isScrollingOnTheRight == false && event.pageX < OFFSET_LEFT_FOR_CONTENT_TO_BE_USABLE_ON_MOUSE_MOVE && mousePositionForY > OFFSET_TOP_FOR_MOUSE_ON_SCROLLING) {
    //     console.log("SCROLLING FROM THE LEFT")
    //     const idOfLineBasedOnMouseY = calculateLineBasedOnMousePositionForY(mousePositionForY)
    //     const line = document.getElementById(String(idOfLineBasedOnMouseY))
    //     isScrollingOnTheRight = false
    //     if (line) {
    //         buildMarker()
    //         const range = new Range()
    //         let lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
    //         if (startingPoint.lineOfStartContainer.id < idOfLineBasedOnMouseY) {
    //             range.setEnd(lastVisibleLineElement.firstChild.firstChild, 0)
    //             range.setStart(line.firstChild.firstChild, 0)
    //         }
    //         else {
    //             range.setEnd(lastVisibleLineElement.firstChild.firstChild, 0)
    //             range.setStart(line.lastChild.firstChild, 0)
    //         }
    //         _buildTextSelectionBasedOnEventAndRange(event, range)
    //     }
    // }
    // else if (isSelectingText && isScrollingOnTheRight == false && event.pageX < OFFSET_LEFT_FOR_CONTENT_TO_BE_USABLE_ON_MOUSE_MOVE && mousePositionForY <= OFFSET_TOP_FOR_MOUSE_ON_SCROLLING) {
    //     console.log("SCROLLING FROM THE LEFT")
    //     buildMarker()
    //     let range = new Range()
    //     let lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
    //     let firstVisibleLineElement = getElementForVisibleLineAndOperationToExecute(firstVisibleLine, Operation.ADD)
    //     range = _defineRangeForFirstVisibleAndLastVisibleLineElements(firstVisibleLineElement, lastVisibleLineElement, range)
    //     if (range) {
    //         _buildTextSelectionBasedOnEventAndRange(event, range)
    //     }
    // }
    // else if (isSelectingText && event.layerX == event.pageX && isScrollingOnTheRight) {
    //     console.log(mousePositionForY)
    //     isScrollingOnTheRight = true
    //     if (mousePositionForY <= OFFSET_TOP_FOR_MOUSE_ON_SCROLLING) {
    //         console.log("SCROLLING UP")
    //         buildMarker()
    //         let range = new Range()
    //         let lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
    //         let firstVisibleLineElement = getElementForVisibleLineAndOperationToExecute(firstVisibleLine, Operation.ADD)
    //         range = _defineRangeForFirstVisibleAndLastVisibleLineElementsForRightSide(firstVisibleLineElement, lastVisibleLineElement, range)
    //         if (range) {
    //             _buildTextSelectionBasedOnEventAndRange(event, range)
    //         }
    //     }
    //     else {
    //         console.log("SCROLLING DOWN")
    //         const idOfLineBasedOnMouseY = calculateLineBasedOnMousePositionForY(mousePositionForY)
    //         let firstVisibleLineElement = getElementForVisibleLineAndOperationToExecute(firstVisibleLine, Operation.ADD)
    //         const line = document.getElementById(String(idOfLineBasedOnMouseY))
    //         console.log(line)
    //         if (line) {
    //             buildMarker()
    //             const range = new Range()
    //             let lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
    //             if (startingPoint.lineOfStartContainer.id < idOfLineBasedOnMouseY) {
    //                 range.setEnd(lastVisibleLineElement.firstChild.firstChild, 0)
    //                 const nextLine = document.getElementById(String(idOfLineBasedOnMouseY + 1))
    //                 if (nextLine) range.setStart(nextLine.firstChild.firstChild, 0)
    //                 else range.setStart(lastVisibleLineElement.lastChild.firstChild, 0)
    //             }
    //             else {
    //                 range.setEnd(lastVisibleLineElement.firstChild.firstChild, 0)
    //                 const previousLine = document.getElementById(String(idOfLineBasedOnMouseY + 1))
    //                 if (previousLine) range.setStart(previousLine.firstChild.firstChild, 0)
    //                 else range.setStart(firstVisibleLineElement.lastChild.firstChild, 0)
    //             }
    //             _buildTextSelectionBasedOnEventAndRange(event, range)
    //         }
    //     }
    // }
})

/**
 * 
 * @param {Number} visibleLine 
 * @param {String} operation
 * @returns {HTMLElement} the element corresponding to the visible line
 */
function getElementForVisibleLineAndOperationToExecute(visibleLine, operation) {
    let elementForVisibleLine = document.getElementById(String(visibleLine))
    while (elementForVisibleLine == null) {
        visibleLine = operation == Operation.ADD ? visibleLine + 1 : visibleLine - 1
        elementForVisibleLine = document.getElementById(String(visibleLine))
    }
    return elementForVisibleLine
}

function _buildTextSelectionBasedOnEventAndRange(event, range) {
    releasingPoint = new CustomRangeElement(range)
    // customMarker = new CustomContentMarker(startingPoint, releasingPoint)
    // customMarker.buildForSpecialCase(event, firstVisibleLine, lastVisibleLine)
    // releasingPoint = null
}

/**
 * Check the position of the starting point based on the first and last visible line and define coordinates to the provided range.
 * @param {HTMLElement} firstVisibleLineElement 
 * @param {HTMLElement} lastVisibleLineElement 
 * @param {Range} range 
 * @returns null or range with defiend starting and ending line
 */
function _defineRangeForFirstVisibleAndLastVisibleLineElements(firstVisibleLineElement, lastVisibleLineElement, range) {
    const contetElementLastAddedChildId = Number(contentElement.lastChild.id)
    if (Number(startingPoint.lineOfStartContainer.id) < lastVisibleLine) {
        if (contetElementLastAddedChildId == firstVisibleLine || contetElementLastAddedChildId - firstVisibleLine < 7 || firstVisibleLine == 0) {
            if (startingPoint.lineOfStartContainer.id >= firstVisibleLine) {
                range.setEnd(firstVisibleLineElement.lastChild.firstChild, 0)
                range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
            }
            else range = null
        }
        else {
            range.setEnd(firstVisibleLineElement.lastChild.firstChild, 0)
            range.setStart(lastVisibleLineElement.lastChild.firstChild, 0)
        }
    }
    else {
        if (contetElementLastAddedChildId == lastVisibleLine || lastVisibleLine - contetElementLastAddedChildId < 7) {
            range.setEnd(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
            range.setStart(lastVisibleLineElement.firstChild.firstChild, 0)
        }
        else {
            range.setEnd(firstVisibleLineElement.lastChild.firstChild, 0)
            range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        }
    }
    return range
}

/**
 * Check the position of the starting point based on the first and last visible line and define coordinates to the provided range.
 * @param {HTMLElement} firstVisibleLineElement 
 * @param {HTMLElement} lastVisibleLineElement 
 * @param {Range} range 
 * @returns null or range with defiend starting and ending line
 */
function _defineRangeForFirstVisibleAndLastVisibleLineElementsForRightSide(firstVisibleLineElement, lastVisibleLineElement, range) {
    // This functions will be reused later on in the acutal integration of right scrolling or left scrolling
    const contetElementLastAddedChildId = Number(contentElement.lastChild.id)
    if (Number(startingPoint.lineOfStartContainer.id) < lastVisibleLine) {
        if (contetElementLastAddedChildId == firstVisibleLine || contetElementLastAddedChildId - firstVisibleLine < 7 || firstVisibleLine == 0) {
            if (startingPoint.lineOfStartContainer.id >= firstVisibleLine) {
                range.setEnd(firstVisibleLineElement.lastChild.firstChild, 0)
                range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
            }
            else range = null
        }
        else {
            range.setStart(lastVisibleLineElement.firstChild.firstChild, 0)
            range.setEnd(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
        }
    }
    else {
        if (contetElementLastAddedChildId == lastVisibleLine || lastVisibleLine - contetElementLastAddedChildId < 7) {
            range.setEnd(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
            range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        }
        else {
            range.setEnd(firstVisibleLineElement.lastChild.firstChild, 0)
            range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        }
    }
    return range
}

/**
 * 
 * @param {Number} mousePositionForY 
 */
function calculateLineBasedOnMousePositionForY(mousePositionForY) {
    let idOfLineBasedOnMouseY = Math.floor(mousePositionForY / MINIMAL_LINE_HEIGHT)
    if (idOfLineBasedOnMouseY <= firstVisibleLine) {
        idOfLineBasedOnMouseY = firstVisibleLine
    }
    else if (idOfLineBasedOnMouseY >= lastVisibleLine) {
        if (idOfLineBasedOnMouseY >= NUMBER_OF_LINES) {
            idOfLineBasedOnMouseY = NUMBER_OF_LINES - 1
        }
        else idOfLineBasedOnMouseY = lastVisibleLine
    }
    return idOfLineBasedOnMouseY
}

// function debounce(func, delay) {
//     let timeout;
//     return function (...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => {
//             func.apply(this, args);
//         }, delay)
//     }
// }

// function throttle(fn, delay) {
//     let isThr = false;

//     return function (...args) {
//         if (!isThr) {
//             fn.apply(this, args);
//             isThr = true;

//             setTimeout(() => {
//                 isThr = false;
//             }, delay);
//         }
//     };
// }

// function onScroll() {
//     if (isSelectingText) isScrolling = true
//     // const element = document.getElementById(String(previousFirstVisibleLine))
//     // element.scrollTo()
//     // element.scrollTo({
//     //     top: 100,
//     //     left: 100,
//     //     behavior: "smooth",
//     // });
//     firstVisibleLine = Math.round(document.documentElement.scrollTop / MINIMAL_LINE_HEIGHT)
//     lastVisibleLine = firstVisibleLine + maximumVisibleLinesOnScreen - 1
//     console.log(`FIRST VISIBLE LINE: ${firstVisibleLine} and LAST VISIBLE LINE: ${lastVisibleLine}`)
//     const children = contentElement.childNodes
//     const rebuildEvent = new CustomEvent('rebuild', {
//         detail: {
//             previousFirstVisibleLine: previousFirstVisibleLine,
//             previousLastVisibleLine: previousLastVisibleLine
//         }
//     })
//     children.forEach(child => {
//         child.dispatchEvent(rebuildEvent)
//     });

//     // loadLines()
//     // reloadLines()
//     // refresh()
//     const mouseEvent = new MouseEvent('mousemove')
//     window.dispatchEvent(mouseEvent)
//     let marker = document.getElementById('marker')
//     if (marker && isSelectingText == false) {
//         customMarker.display(firstVisibleLine, lastVisibleLine)
//     }
//     previousFirstVisibleLine = firstVisibleLine
//     previousLastVisibleLine = lastVisibleLine
// }

// const process = throttle(onScroll, 100)



function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
function saveInput() {
    console.log('Saving data');
}
const processChange = debounce(() => saveInput());
window.addEventListener('scroll', processChange)

window.addEventListener('mouseup', (event) => {
    if (isSelectingText) isSelectingText = false
})

/**
 * 
 * @param {MouseEvent} event 
 */
function highlightTest(event) {
    buildMarker()
    const mousePosition = findMousePosition(event)

    if (mousePosition == MousePosition.RIGHT) {

    }
    else if (mousePosition == MousePosition.LEFT) {
        if (event.pageY != 0) {
            const range = buildForLeft(event)
            releasingPoint = new CustomRangeElement(range)
            customMarker = new CustomContentMarker(startingPoint, releasingPoint)
            customMarker.buildForLeftSection(firstVisibleLine, lastVisibleLine)
        }


    }
    else if (mousePosition == MousePosition.TOP) {
        const range = buildRangeForTop(event)
        releasingPoint = new CustomRangeElement(range)
        customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        customMarker.buildForTopSection(firstVisibleLine, lastVisibleLine)
    }
    else if (mousePosition == MousePosition.BOTTOM) {
        // customMarker.buildForAllLines(firstVisibleLine, lastVisibleLine)
        const range = buildRangeForBottom(event)
        releasingPoint = new CustomRangeElement(range)
        customMarker = new CustomContentMarker(startingPoint, releasingPoint)
        customMarker.buildForBottomSection(firstVisibleLine, lastVisibleLine)
    }
    // the highlight of centre seems to be stable from previous interaction with the code.
    // else if (mousePosition == MousePosition.CENTRE) {
    // selectText(event)
    // }
}

/**
 * 
 * @param {MouseEvent} event 
 * @returns 
 */
function buildForLeft(event) {
    const y = event.pageY
    let rowBasedOnMouseYPosition = Math.floor(y / 27.6)
    let lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
    while (lineElementBasedOnMouuse == null) {
        if (rowBasedOnMouseYPosition > lastVisibleLine) {
            rowBasedOnMouseYPosition - 1
        }
        else if (rowBasedOnMouseYPosition < firstVisibleLine) {
            rowBasedOnMouseYPosition + 1
        }
        lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
    }
    const startingPointLineVisibility = getStartingPointLinePositionBasedOnVisibleLines()
    const firstVisibleLineElement = document.getElementById(String(firstVisibleLine))
    const lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
    const range = new Range()
    if (startingPointLineVisibility == StartingPointVisibility.VISIBLE) {
        const startingLine = Number(startingPoint.lineOfStartContainer.id)
        if (startingLine > rowBasedOnMouseYPosition) {
            range.setStart(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
            range.setEnd(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
        }
        else {
            range.setStart(lineElementBasedOnMouuse.firstChild.firstChild, 0)
            range.setEnd(lineElementBasedOnMouuse.firstChild.firstChild, 0)
        }
    }
    else if (startingPointLineVisibility == StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN) {
        range.setStart(firstVisibleLineElement.lastChild.firstChild, firstVisibleLineElement.lastChild.firstChild.textContent.length)
        range.setEnd(lineElementBasedOnMouuse.firstChild.firstChild, 0)
    }
    else if (startingPointLineVisibility == StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN) {
        range.setEnd(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
        range.setStart(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
    }
    return range
}

/**
 * 
 * @param {MouseEvent} event 
 * @returns {String} the position of the mouse
 */
function findMousePosition(event) {
    const widhtOfLineNumerationElement = lineNumerationElement.scrollWidth
    const totalWidthOfScreen = contentElement.scrollWidth + widhtOfLineNumerationElement
    const heightOfElementBasedOnVisibleLinesOnTheScreen = contentElement.scrollHeight
    const firstVisibleLineOnTheScreen = document.getElementById(String(firstVisibleLine))
    const topOffsetOfTheFirstVisibleLineOnTheScreen = firstVisibleLineOnTheScreen.offsetTop
    const mouseYPositionBasedOnPage = event.pageY
    const mouseXPositionBasedOnPage = event.pageX
    // INCORRECT CHECK
    // The left and right section can be triggered although it is either top or bottom scrolling
    // thats why they are commented out for now.
    // the goal is to make top and bottom text selection work
    // before working on the rest.
    if (mouseYPositionBasedOnPage == 0 && windowSectionScrollig == WindowSection.BOTTOM) {
        return MousePosition.BOTTOM
    }
    else if (mouseYPositionBasedOnPage == 0 && windowSectionScrollig == WindowSection.TOP) {
        return MousePosition.TOP
    }
    else if (mouseYPositionBasedOnPage > heightOfElementBasedOnVisibleLinesOnTheScreen) {
        windowSectionScrollig = WindowSection.BOTTOM
        return MousePosition.BOTTOM
    }
    else if (mouseYPositionBasedOnPage < topOffsetOfTheFirstVisibleLineOnTheScreen && mouseYPositionBasedOnPage != 0) {
        windowSectionScrollig = WindowSection.TOP
        return MousePosition.TOP
    }
    // LEFT AND RIGHT CONFIGURATION NEED FIXING
    else if (mouseXPositionBasedOnPage < widhtOfLineNumerationElement) {
        windowSectionScrollig = WindowSection.LEFT
        return MousePosition.LEFT
    }
    else if (mouseXPositionBasedOnPage > totalWidthOfScreen) {
        windowSectionScrollig = WindowSection.RIGHT
        return MousePosition.RIGHT
    }
    windowSectionScrollig = WindowSection.CENTRE
    return MousePosition.CENTRE
}

/**
 * 
 * @return {Range}  
 */
function buildRangeForBottom() {
    const startingPointLineVisibility = getStartingPointLinePositionBasedOnVisibleLines()
    const firstVisibleLineElement = document.getElementById(String(firstVisibleLine))
    const lastVisibleLineElement = getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)

    const range = new Range()
    if (startingPointLineVisibility == StartingPointVisibility.VISIBLE) {
        range.setStart(lastVisibleLineElement.firstChild.firstChild, 0)
        range.setEnd(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
    }
    else if (startingPointLineVisibility == StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN) {
        range.setStart(firstVisibleLineElement.lastChild.firstChild, firstVisibleLineElement.lastChild.firstChild.textContent.length)
        range.setEnd(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
    }
    else if (startingPointLineVisibility == StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN) {
        range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        range.setEnd(firstVisibleLineElement.firstChild.firstChild, 0)
    }
    return range
}

/**
 * @param {MouseEvent} event 
 * @returns {Range}
 */
function buildRangeForTop(event) {
    const startingPointLineVisibility = getStartingPointLinePositionBasedOnVisibleLines()
    const firstVisibleLineElement = document.getElementById(String(firstVisibleLine))
    const lastVisibleLineElement = document.getElementById(String(lastVisibleLine))

    const range = new Range()
    if (startingPointLineVisibility == StartingPointVisibility.VISIBLE) {
        range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        range.setEnd(firstVisibleLineElement.lastChild.firstChild, firstVisibleLineElement.lastChild.firstChild.textContent.length)
    }
    else if (startingPointLineVisibility == StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN) {
        range.setStart(firstVisibleLineElement.firstChild.firstChild, 0)
        range.setEnd(firstVisibleLineElement.firstChild.firstChild, 0)
    }
    else if (startingPointLineVisibility == StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN) {
        range.setStart(firstVisibleLineElement.lastChild.firstChild, firstVisibleLineElement.lastChild.firstChild.textContent.length)
        range.setStart(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
    }
    return range
}


// Possibly the only good function in the code
/**
 * 
 * @returns {String} One of three options: VISIBLE, EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN or LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN
 */
function getStartingPointLinePositionBasedOnVisibleLines() {
    const lineOfStartingPoint = startingPoint.lineOfStartContainer
    const idOfLineOfStartingPoint = lineOfStartingPoint.id

    if (idOfLineOfStartingPoint >= firstVisibleLine && idOfLineOfStartingPoint < lastVisibleLine) {
        return StartingPointVisibility.VISIBLE
    }
    else if (idOfLineOfStartingPoint < firstVisibleLine) {
        return StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN
    }
    else if (idOfLineOfStartingPoint >= lastVisibleLine) {
        return StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN
    }
    else {
        alert("THIS IS A BUG")
    }
}
