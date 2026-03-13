const lines = document.getElementById('lines')
const container = document.getElementById('writer-container')
const writer = document.getElementById('writer')
const reader = document.getElementById('reader-container')
const preview = document.getElementById('preview')
const lineHeight = 28.8
let currentLines = 0
let firstLineOfChange = 0
let lastLineOfChange = 0
let newFirstLine = 0

writer.addEventListener('input', (event) => {
    updateContent(event)
    preview.innerHTML = reader.innerHTML
})

function updateContent(event) {
    const content = event.target.value;
    newFirstLine = getLineForIndexInText(event.target.selectionStart, content)
    const contentAsLines = String(content).split('\n')
    if (currentLines == 0)
        buildLines(contentAsLines)
    else {
        updateContentWhenThereIsAlreadyOldContent(contentAsLines)
    }
    buildLineNumbers(contentAsLines)
    currentLines = contentAsLines.length
}


function buildLines(lines) {
    reader.replaceChildren()
    goThroughEachLine(lines)
}

function goThroughEachLine(lines) {
    for (let index = 0; index < lines.length; index++) {
        const content = lines[index];
        if (content != undefined)
            buildLine(content, index)
    }
}

function buildLine(content, index) {
    let line = reader.childNodes[index]
    if (line) line.innerHTML = turnLineIntoWords(content)
    else {
        line = constructLine(content)
        reader.appendChild(line)
    }
}


function constructLine(content) {
    const line = document.createElement('div')
    line.innerHTML = turnLineIntoWords(content)
    line.style = `
    display: flex;
    fled-direction:row;
    width: fit-content;
    height: fit-content;
    `
    return line
}

function turnLineIntoWords(content) {
    const words = splitLineIntoWords(content)
    let innerHTML = ``
    if (words.length == 1 && words[0] == "")
        innerHTML = `<span style="font-sieze: 24px">&nbsp;</span>`
    else {
        words.forEach(content => {
            if (content == " ") {
                innerHTML += `<span style="font-sieze: 24px">&nbsp;</span>`
            }
            else if (content == '\t') {
                innerHTML += `<span style="font-sieze: 24px">&emsp;</span>`
            }
            else {
                innerHTML += `<span style="font-sieze: 24px;">${content}</span>`
            }
        });
    }
    return innerHTML
}

function splitLineIntoWords(content) {
    const regex = /`|\b\w+\b|[.\s |;|,|=|<|(|)|[|]|\{|\}|\;|\:|\>|\?|\!|"|']+|\W{1}/g;
    const splits = _splitContentUsingRegex(content, regex)
    return splits
}

function _splitContentUsingRegex(content, regex) {
    let splits = ['']
    if (content.trim() != "")
        splits = String(content).match(regex)
    return splits
}

function updateContentWhenThereIsAlreadyOldContent(contentAsLines) {
    const differenceInSize = contentAsLines.length - currentLines
    if (differenceInSize === 0) {
        updateWhenChangeIsOnTheSameLine(contentAsLines)
    }
    else if (differenceInSize < 0) {
        updateWhenNewContentIsWithLessLines(differenceInSize, contentAsLines)
    }
    else if (differenceInSize > 0) {
        updateWhenContentIsWithMoreLines(contentAsLines, differenceInSize)
    }
}

function updateWhenChangeIsOnTheSameLine(contentAsLines) {
    if (firstLineOfChange == lastLineOfChange) edgeCaseForChangeAfterRemovingEmptyLiens(contentAsLines)
    else updateLinesAt(firstLineOfChange - 1, lastLineOfChange - 1, contentAsLines)
}

function edgeCaseForChangeAfterRemovingEmptyLiens(contentAsLines) {
    if (firstLineOfChange != newFirstLine) {
        reader.childNodes[newFirstLine - 1].innerHTML = turnLineIntoWords(contentAsLines[newFirstLine - 1])
    }
    else reader.childNodes[firstLineOfChange - 1].innerHTML = turnLineIntoWords(contentAsLines[firstLineOfChange - 1])
}

function updateLinesAt(firstLineOfChange, lastLineOfChange, lines) {
    for (let index = firstLineOfChange; index <= lastLineOfChange; index++) {
        const element = lines[index];
        if (element !== undefined)
            buildLine(element, index)
    }
}


function updateWhenNewContentIsWithLessLines(differenceInSize, contentAsLines) {
    differenceInSize = differenceInSize * -1.
    console.log(firstLineOfChange, newFirstLine, lastLineOfChange, contentAsLines.length)
    bringToSmaeSize(differenceInSize, firstLineOfChange)
    console.log(lastLineOfChange - 1 > contentAsLines.length)
    if (lastLineOfChange - 1 > contentAsLines.length) updateLinesAt(firstLineOfChange - 1, contentAsLines.length, contentAsLines)
    else updateLinesAt(newFirstLine - 1, lastLineOfChange - 1, contentAsLines)
}

function bringToSmaeSize(differenceInSize, firstLineOfChange) {
    let lineToRemove = firstLineOfChange - 1
    if (newFirstLine != firstLineOfChange)
        lineToRemove = newFirstLine
    let difference = differenceInSize
    while (difference > 0) {
        reader.childNodes[newFirstLine].remove()
        difference--;
    }
}

function updateWhenContentIsWithMoreLines(contentAsLines, differenceInSize) {
    console.log(firstLineOfChange == currentLines)
    console.log(differenceInSize == 1)
    console.log(firstLineOfChange == 1 && lastLineOfChange == currentLines)
    console.log(firstLineOfChange == lastLineOfChange && lastLineOfChange <= currentLines)
    console.log(firstLineOfChange < lastLineOfChange && lastLineOfChange <= currentLines)
    if (firstLineOfChange == currentLines) { // INSERTION OF LINES AT THE VERY END
        updateLinesAt(firstLineOfChange - 1, contentAsLines.length - 1, contentAsLines)
    }
    else if (differenceInSize == 1) {
        const indexOfPreviousLine = newFirstLine - 2 // - 2 because we talk about indexes not number of lines
        const contentOfPreviousLine = contentAsLines[indexOfPreviousLine]
        buildLine(contentOfPreviousLine, indexOfPreviousLine)
        const indexOfline = newFirstLine - 1
        const content = contentAsLines[indexOfline]
        const line = constructLine(content)
        const child = reader.childNodes[indexOfline]
        reader.insertBefore(line, child)
    }
    else if (firstLineOfChange == 1 && lastLineOfChange == currentLines) { // INSERTION WITH COMPLETE CHNAGE OF CODEBASE
        reader.replaceChildren()
        buildLines(contentAsLines)
    }
    else if (firstLineOfChange == lastLineOfChange && lastLineOfChange <= currentLines) {
        updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, contentAsLines)
    }
    else if (firstLineOfChange < lastLineOfChange && lastLineOfChange <= currentLines) {
        updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, contentAsLines)
    }

}

function updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, contentAsLines) {
    for (let index = firstLineOfChange - 1; index < firstLineOfChange + differenceInSize; index++) {
        const content = contentAsLines[index];
        if (index == lastLineOfChange - 1) { buildLine(content, index) }
        else {
            const lineElement = constructLine(content)
            const child = reader.childNodes[index]
            reader.insertBefore(lineElement, child)
        }
    }
}

function updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, contentAsLines) {
    for (let index = firstLineOfChange - 1; index <= lastLineOfChange - 1 + differenceInSize; index++) {
        const content = contentAsLines[index];
        if (index >= lastLineOfChange) {
            const lineElement = constructLine(content)
            const child = reader.childNodes[index]
            reader.insertBefore(lineElement, child)
        }
        else buildLine(content, index)
    }
}

function buildLineNumbers(contentAsLines) {
    lines.replaceChildren()
    contentAsLines.forEach((content, index) => {
        buildLineNumber(index)
    });
}

function buildLineNumber(index) {
    const lineNumber = document.createElement('p')
    lineNumber.textContent = index + 1;
    lines.appendChild(lineNumber)
}

writer.addEventListener('scroll', (event) => {
    container.scrollTop = writer.scrollTop
    reader.scrollLeft = writer.scrollLeft
    reader.scrollTop = writer.scrollTop
})

writer.addEventListener('selectionchange', (event) => {
    startingIndex = event.target.selectionStart
    endingIndex = event.target.selectionEnd
    firstLineOfChange = getLineForIndexInText(startingIndex, event.target.value)
    lastLineOfChange = getLineForIndexInText(endingIndex, event.target.value)
})

function getLineForIndexInText(index, content) {
    const substringed = String(content).substring(0, index);
    const line = substringed.split('\n').length
    return line
}



