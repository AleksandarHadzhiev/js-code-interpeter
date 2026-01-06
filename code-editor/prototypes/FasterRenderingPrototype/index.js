const contentElement = document.getElementById('content')
const editor = document.getElementById('editor')
let totalLines = 120
let startingLine = 0
let previousStartingLine = startingLine
let lines = Math.round(contentElement.offsetHeight / 28.8);
let lastVisibleLine = totalLines > startingLine + lines ? startingLine + lines : totalLines
let previousEndingLine = lastVisibleLine
let oldRange = null
let currentRange = null
let firstClicked = null
let firstSelection = null
let lastMarkedLine = null
let firstMarkedLine = null
let lastVisibleLineWhenClicked = null
let isSelectingRange = false
let offsetFromTop = 0
let isScrolling = false
contentElement.style = `height: ${Math.round(totalLines * 28.8)}px;`

let markedLines = new Map()
buildLines()

function buildACaret(range, lineId, clickedElement) {
    const line = document.getElementById(lineId)
    if (document.getElementById('caret')) document.getElementById('caret').remove()
    let offsetLeft = clickedElement.offsetLeft + getWidthOfSelectedText(range.endOffset, clickedElement)
    const caret = document.createElement('div')
    caret.setAttribute('id', 'caret')
    caret.classList.add('caret')
    caret.style = `
        top: ${line.style.top};
        left: ${offsetLeft}px;
    `
    return caret
}

function getWidthOfSelectedText(clickedCharacter, clickedElement) {
    const text = String(clickedElement.textContent).substring(0, clickedCharacter)
    const elementForDistance = document.createElement('div')
    elementForDistance.classList.add('caret')
    elementForDistance.textContent = text
    contentElement.appendChild(elementForDistance)
    const width = elementForDistance.offsetWidth
    elementForDistance.remove()
    return width
}

editor.addEventListener('scroll', () => {
    if (isSelectingRange) isScrolling = true
    startingLine = Math.round(editor.scrollTop / 28.8)
    lastVisibleLine = totalLines > startingLine + lines ? startingLine + lines : totalLines
    const visibleLines = contentElement.childNodes
    const previousFirstVisibleLine = visibleLines[0]
    const previousLastVisibleLine = visibleLines[visibleLines.length - 1]
    if (startingLine > Number(previousFirstVisibleLine.id)) {
        const difference = startingLine - Number(previousFirstVisibleLine.id)
        addElementsAfterPreviousLastVisibleLine(difference, Number(previousLastVisibleLine.id))
        removeElementsBeforeNewStartingLine(startingLine, Number(contentElement.childNodes[0].id))
    }
    else if (startingLine < Number(previousFirstVisibleLine.id)) {
        const difference = Number(previousFirstVisibleLine.id) - startingLine
        addElementsAfterNewStartingLine(startingLine, startingLine + difference)
        removeElementsAfterPreviousLastVisibleLine(lastVisibleLine, Number(previousLastVisibleLine.id))
    }
    if (firstClicked) {
        getMarkedTextOnScrolling()
        updateMarkerOnScrolling()
    }
})

function getMarkedTextOnScrolling() {
    const startingLine = _getStartingLine()
    const lastLine = _getLastLine()
    for (let index = startingLine; index < lastLine; index++) {
        addMarkedLineFoundAtIndex(index)
    }
}

function _getStartingLine() {
    let startingLine = Number(firstClicked.id) + 1
    const firstVisibleLine = Math.round(editor.scrollTop / 28.8)
    if (firstVisibleLine >= startingLine)
        startingLine = firstVisibleLine
    return startingLine
}

function _getLastLine() {
    let lastLine = 0
    if (isSelectingRange) lastLine = Number(oldRange.endContainer.parentElement.parentElement.id)
    else lastLine = Number(lastMarkedLine.id)
    const lastVisibleLine = Number(contentElement.lastChild.id)
    if (lastLine >= lastVisibleLine)
        lastLine = lastVisibleLine
    return lastLine
}

function addMarkedLineFoundAtIndex(index) {
    const line = document.getElementById(`${index}`)
    if (line) {
        const markedText = line.textContent
        addMarkedLineToLines(line, 0, markedText)
    }
}

function updateMarkerOnScrolling() {
    const idsOfMarkesLines = Array.from(markedLines.keys())
    let lastLine = 0
    if (isSelectingRange) lastLine = Number(oldRange.endContainer.parentElement.parentElement.id)
    else lastLine = Number(lastMarkedLine.id)
    const marker = document.getElementById('marker')
    idsOfMarkesLines.forEach((idOfMarkedLine) => {
        if (Number(idOfMarkedLine) >= Number(firstClicked.id) && Number(idOfMarkedLine) <= lastLine) {
            const idInDOMFormat = String(idOfMarkedLine)
            const lineWithText = document.getElementById(idInDOMFormat)
            const markerLine = document.getElementById(`marked-${idInDOMFormat}`)
            if (lineWithText == null && markerLine != null) {
                markerLine.remove()
            }
            else if (markerLine == null && lineWithText != null) {
                buildLineInMarker(markedLines.get(idOfMarkedLine), marker)
            }
        }
    })
}

function removeElementsBeforeNewStartingLine(startingLine, previousFirstVisibleLine) {
    for (let index = previousFirstVisibleLine; index < startingLine; index++) {
        const element = document.getElementById(`${index}`);
        element.remove()
    }
}

function addElementsAfterPreviousLastVisibleLine(difference, previousLastVisibleLine) {
    let lastLineToAdd = totalLines - 1
    if (previousLastVisibleLine + difference < totalLines)
        lastLineToAdd = previousLastVisibleLine + difference
    for (let index = previousLastVisibleLine + 1; index <= lastLineToAdd; index++) {
        const lineElement = buildALine(index)
        contentElement.appendChild(lineElement)
    }
}

function removeElementsAfterPreviousLastVisibleLine(currentLastVisbleLine, previousLastVisibleLine) {
    for (let index = currentLastVisbleLine + 1; index <= previousLastVisibleLine; index++) {
        const element = document.getElementById(`${index}`);
        element.remove()
    }
}

function addElementsAfterNewStartingLine(startingLine, lastLineToAdd) {
    if (startingLine >= 0)
        for (let index = lastLineToAdd; index >= startingLine; index--) {
            let lineElement = document.getElementById(`${index}`)
            if (lineElement == null) {
                lineElement = buildALine(index)
                contentElement.prepend(lineElement)
            }
        }
}

function buildLines() {
    contentElement.replaceChildren()
    for (let index = startingLine; index < lastVisibleLine; index++) {
        const lineElement = buildALine(index)
        contentElement.appendChild(lineElement)
    }
}

function buildALine(index) {
    const lineElement = document.createElement('div')
    lineElement.setAttribute('id', `${index}`)
    lineElement.classList.add('line')
    let inner = `<span>Hi</span><span> </span><span>I'm</span><span> </span><span>Aleksandar Hadzhiev</span>`
    if (index == 3 || index == 5 || index == 7)
        inner = `<span>Hi</span><span> </span><span>I'm</span><span> </span><span>Aleksandar Hadzhiev</span><span>Hi</span><span> </span><span>I'm</span><span>Hi</span><span> </span><span>I'm</span><span>Hi</span><span> </span><span>I'm</span>`
    lineElement.innerHTML = inner
    lineElement.style = `
    top: ${index * 28.8}px;
    `
    lineElement.addEventListener('mouseup', () => {
        const selection = document.getSelection()
        const range = selection.getRangeAt(0)
        oldRange = range
        lastMarkedLine = oldRange.endContainer.parentElement.parentElement
        isSelectingRange = false
        isScrolling = false
        firstSelection = null
    })
    lineElement.addEventListener('mousedown', (event) => {
        firstClicked = event.currentTarget
        lastVisibleLineWhenClicked = contentElement.childNodes[contentElement.childNodes.length - 1]
        markedLines.clear()
    })
    lineElement.addEventListener('mousemove', (event) => {
        if (isSelectingRange) {
            const selection = document.getSelection()
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                oldRange = range
                if (firstSelection == null && isScrolling == false) {
                    firstSelection = { container: range.startContainer, offset: range.startOffset, left: range.startContainer.parentElement.offsetLeft }
                }
                firstMarkedLine = Number(range.startContainer.parentElement.parentElement.id)
                getMarkedText()
                const multilineMarker = createMultiLineMarker()
                buildMarkerFromLines(multilineMarker, event)
                cleanFakelyMakredElements()
                editor.prepend(multilineMarker)
            }
            offsetFromTop = editor.scrollTop
        }
        isSelectingRange = true
    })
    return lineElement
}

function cleanFakelyMakredElements() {
    const firstVisibleLine = Math.round(editor.scrollTop / 28.8)
    if (firstVisibleLine <= firstMarkedLine) {
        for (let index = firstVisibleLine; index < firstMarkedLine; index++) {
            const markedLine = document.getElementById(`marked-${index}`)
            if (markedLine) markedLine.remove()
        }
    }

}

function getMarkedText() {
    if (firstClicked) {
        if (oldRange.commonAncestorContainer.id === 'content') {
            const fragment = oldRange.cloneContents()
            const markedLinesFromFragment = fragment.childNodes
            const span = oldRange.startContainer.parentElement
            const linesInRange = defineBoundariesForLinesInRange()
            let offsetLeft = span.offsetLeft + getWidthOfSelectedText(oldRange.startOffset, span)
            markedLinesFromFragment.forEach(markedLine => {
                if (Number(markedLine.id) <= linesInRange.last && Number(markedLine.id) >= linesInRange.first) {
                    let markedText = markedLine.textContent
                    addMarkedLineToLines(markedLine, offsetLeft, markedText)
                    offsetLeft = 0
                }
            });
        }
        else {
            const span = oldRange.startContainer.parentElement
            const line = span.parentElement
            const markedText = oldRange.toString()
            const offsetLeft = span.offsetLeft + getWidthOfSelectedText(oldRange.startOffset, span)
            addMarkedLineToLines(line, offsetLeft, markedText)
        }
    }
}

function defineBoundariesForLinesInRange() {
    let idOfLastLineInRange = Number(oldRange.endContainer.parentElement.parentElement.id)
    let idOfFirstLineInRange = firstMarkedLine
    const firstClickedStillVisible = document.getElementById(firstClicked.id)
    if (firstMarkedLine > Number(firstClicked.id) && firstClickedStillVisible) {
        idOfFirstLineInRange = Number(firstClicked.id)
        idOfLastLineInRange = firstMarkedLine
    }
    else if (firstMarkedLine < Number(firstClicked.id) && firstClickedStillVisible) {
        idOfFirstLineInRange = firstMarkedLine
        idOfLastLineInRange = Number(firstClicked.id)
    }
    return {
        first: idOfFirstLineInRange,
        last: idOfLastLineInRange
    }
}

function addMarkedLineToLines(markedLine, offsetLeft, markedText) {
    const width = calculateLeft(markedText)
    const line = {
        line: markedLine,
        offsetLeft: offsetLeft,
        width: width,
        id: markedLine.id,
        top: markedLine.style.top
    }
    markedLines.set(markedLine.id, line)
}

function buildMarkerFromLines(multilineMarker, event) {
    if (document.getElementById('marker')) document.getElementById('marker').remove()
    let idOfLastLineInRange = defineIfOfLastLineInRange()
    if (isScrolling && firstMarkedLine == Number(firstClicked.id)) {
        const spanFromSelection = firstSelection.container.parentElement
        const spanFromRange = oldRange.startContainer.parentElement
        let width = 0
        let offsetLeft = 0
        let startIndex = firstSelection.offset
        let endIndex = oldRange.startOffset
        let left = firstSelection.left
        if (spanFromRange.offsetLeft == firstSelection.left) {
            if (endIndex < firstSelection.offset) {
                startIndex = endIndex
                endIndex = firstSelection.offset
            }
            offsetLeft = left + getWidthOfSelectedText(startIndex, spanFromSelection)
            let markedText = spanFromSelection.textContent.substring(startIndex, endIndex)
            width = calculateLeft(markedText)
        }
        else {
            if (firstSelection.left > spanFromRange.offsetLeft) {
                left = spanFromRange.offsetLeft
                offsetLeft = left + getWidthOfSelectedText(oldRange.startOffset, spanFromRange)
                const offsetOfLastIndex = firstSelection.left + getWidthOfSelectedText(firstSelection.offset, spanFromSelection)
                width = offsetOfLastIndex - offsetLeft
            }
            else {
                offsetLeft = left + getWidthOfSelectedText(firstSelection.offset, spanFromSelection)
                const offsetOfLastIndex = spanFromRange.offsetLeft + getWidthOfSelectedText(oldRange.startOffset, spanFromRange)
                width = offsetOfLastIndex - offsetLeft
            }
        }
        const marker = document.createElement('div')
        marker.setAttribute('id', `marked-${spanFromSelection.parentElement.id}`)
        marker.style = `
        position: absolute;
        background-color: lightblue;
        left: ${offsetLeft}px;
        top: ${spanFromSelection.parentElement.style.top};
        opacity:0.5;
        width: ${width}px;
        height: 28.8px;
    `
        multilineMarker.appendChild(marker)
    }
    else {
        markedLines.forEach((markedLine) => {
            const line = document.getElementById(`${markedLine.id}`)
            if (line) {
                let startingLine = Number(firstClicked.id)
                if (startingLine > firstMarkedLine) {
                    startingLine = firstMarkedLine
                }
                const lineId = Number(line.id)
                if (isScrolling) {
                    if (event.currentTarget && Number(event.currentTarget.id) == Number(firstSelection.container.parentElement.parentElement.id)) specialCaseFirstLine(markedLine, multilineMarker)
                    else if (lineId == startingLine) {
                        if (startingLine == firstMarkedLine)
                            buildLineInMarker(markedLine, multilineMarker)
                        else buildFirstLine(markedLine, multilineMarker)
                    }
                    else if (event.currentTarget && Number(event.currentTarget.id) == Number(markedLine.id)) coloriseLastLine(markedLine, multilineMarker)
                    else if (lineId == idOfLastLineInRange) specialCase(markedLine, multilineMarker)
                    else if (lineId < idOfLastLineInRange && lineId > startingLine) makeCalculationsForColoring(markedLine, multilineMarker)
                }
                else {
                    if (lineId >= startingLine && lineId <= idOfLastLineInRange) buildLineInMarker(markedLine, multilineMarker)
                }
            }
        })
    }
}

function defineIfOfLastLineInRange() {
    let idOfLastLineInRange = Number(oldRange.endContainer.parentElement.parentElement.id)
    const firstClickedStillVisible = document.getElementById(firstClicked.id)
    if (firstMarkedLine > Number(firstClicked.id) && firstClickedStillVisible) {
        idOfLastLineInRange = firstMarkedLine
    }
    else if (firstMarkedLine < Number(firstClicked.id) && firstClickedStillVisible) {
        idOfLastLineInRange = Number(firstClicked.id)
    }
    return idOfLastLineInRange
}

function buildFirstLine(markedLine, multilineMarker) {
    let left = firstSelection.left
    const spanText = firstSelection.container.parentElement.textContent.substring(0, firstSelection.offset)
    let widthOfSpanText = calculateLeft(spanText)
    left += widthOfSpanText
    const text = firstSelection.container.parentElement.parentElement.textContent
    let width = calculateLeft(text)
    width -= left
    buildMarkedLineWithLeftOffset(markedLine, multilineMarker, left, width)
}

function specialCaseFirstLine(markedLine, multilineMarker) {
    let left = firstSelection.left
    const unmarkedText = firstSelection.container.parentElement.parentElement.textContent
    let width = calculateLeft(unmarkedText)
    width -= left
    buildMarkedLineWithLeftOffset(markedLine, multilineMarker, left, width)
}

function buildMarkedLineWithLeftOffset(markedLine, multilineMarker, left, width) {
    const marker = document.createElement('div')
    marker.setAttribute('id', `marked-${markedLine.id}`)
    marker.style = `
        position: absolute;
        background-color: lightblue;
        left: ${left}px;
        top: ${markedLine.top};
        opacity:0.5;
        width: ${width}px;
        height: 28.8px;
    `
    multilineMarker.appendChild(marker)
}

function specialCase(markedLine, multilineMarker) {
    let widthFromLeft = firstSelection.left
    const unmarkedText = firstSelection.container.parentElement.parentElement.textContent.substring(0, firstSelection.offset + 1)
    let width = calculateLeft(unmarkedText)
    width += widthFromLeft
    buildMarkedLineWithNoLeftOffset(markedLine, multilineMarker, width)
}

function buildMarkedLineWithNoLeftOffset(markedLine, multilineMarker, width) {
    const marker = document.createElement('div')
    marker.setAttribute('id', `marked-${markedLine.id}`)
    marker.style = `
        position: absolute;
        background-color: lightblue;
        left: 0px;
        top: ${markedLine.top};
        opacity:0.5;
        width: ${width}px;
        height: 28.8px;
    `
    multilineMarker.appendChild(marker)
}

function coloriseLastLine(markedLine, multilineMarker) {
    let width = markedLine.width
    if (document.getElementById(firstClicked.id)) {
        let widthFromLeft = oldRange.startContainer.parentElement.offsetLeft
        const unmarkedText = oldRange.startContainer.textContent.substring(0, oldRange.startOffset)
        width = calculateLeft(unmarkedText)
        width += widthFromLeft
    }
    buildMarkedLineWithNoLeftOffset(markedLine, multilineMarker, width)
}

function makeCalculationsForColoring(markedLine, multilineMarker) {
    const line = document.getElementById(markedLine.id)
    const text = line.textContent
    const width = calculateLeft(text)
    buildMarkedLineWithNoLeftOffset(markedLine, multilineMarker, width)
}

function buildLineInMarker(markedLine, multilineMarker) {
    const marker = document.createElement('div')
    marker.setAttribute('id', `marked-${markedLine.id}`)
    marker.style = `
        position: absolute;
        background-color: lightblue;
        left: ${markedLine.offsetLeft}px;
        top: ${markedLine.top};
        opacity:0.5;
        width: ${markedLine.width}px;
        height: 28.8px;
    `
    multilineMarker.appendChild(marker)
}

function createMultiLineMarker() {
    if (document.getElementById('marker')) document.getElementById('marker').remove()
    const multilineMarker = document.createElement('div')
    multilineMarker.setAttribute('id', 'marker')
    multilineMarker.style =
        `
        position: absolute;
        top: 0px;
        left: 0px;
        height: fit-content;
        width: fit-content;
    `
    editor.prepend(multilineMarker)
    return multilineMarker
}

function calculateLeft(textBefore) {
    const element = document.createElement('span')
    element.textContent = textBefore
    element.style = `
        font-size: 24px;
        white-space: pre;
    `
    editor.prepend(element)
    const width = element.offsetWidth
    element.remove()
    return width
}
