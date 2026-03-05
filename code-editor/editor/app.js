import LineBUilder from "./src/classes/LineBuilder.js"

const inputProvider = document.getElementById('input-provider')
const linesElement = document.getElementById('lines')
const contentElement = document.getElementById('content')

let fullText = ""
let startingLine = 0
let lastVisibleLine = 0

window.addEventListener('resize', () => {
    const lines = fullText.split('\n')
    findStartingLineAndLastVisibleLineForLines(lines)
    updateLines()
    updateContent(lines)
    updateInputProvider(lines)
})

inputProvider.addEventListener('input', (event) => {
    const newContent = event.target.value;
    fullText += newContent;
    const lines = fullText.split('\n')
    findStartingLineAndLastVisibleLineForLines(lines)
    updateLines()
    updateContent(lines)
    inputProvider.value = ""
    updateInputProvider(lines)
})

function updateInputProvider(lines) {
    _applyWidthAndHeightInputProvider(lines)
    let linesForTextarea = []
    for (let index = startingLine; index < lastVisibleLine; index++) {
        const textContent = lines[index]
        linesForTextarea.push(textContent)
    }
    inputProvider.value = linesForTextarea.join('\n')
}

function updateLines() {
    loadLinesBetweenFirstAndLastVisible()
}

function loadLinesBetweenFirstAndLastVisible() {
    linesElement.replaceChildren()
    for (let index = startingLine; index < lastVisibleLine; index++) {
        buildLineNumberForIndex(index)
    }
}

function buildLineNumberForIndex(index) {
    const lineNumberElement = document.createElement('div')
    lineNumberElement.textContent = index + 1
    lineNumberElement.classList.add('line')
    linesElement.appendChild(lineNumberElement)
}

function updateContent(lines) {
    loadContentFromLinesBetweenFirstVisibleLineAndLastVisibleLine(lines)
}

function loadContentFromLinesBetweenFirstVisibleLineAndLastVisibleLine(lines) {
    _applyWidthAndHeight(lines)
    contentElement.replaceChildren()
    const container = document.createElement('div')
    container.style = `width: 100%; height: fit-content; position: sticky; top:0%; left:0%;`
    for (let index = startingLine; index < lastVisibleLine; index++) {
        const lineElement = buildLineWithContent(lines, index)
        container.append(lineElement)
    }
    contentElement.append(container)
}

function buildLineWithContent(lines, index) {
    const content = lines[index]
    const builder = new LineBUilder(content)
    const lineElement = builder.buildLine()
    lineElement.setAttribute('id', `${index}`)
    return lineElement
}

function _applyWidthAndHeight(lines) {
    const totalHeight = (lines.length * 28.8)
    const widthOfLongestLine = (fullText.split('\n').sort((a, b) => b.length - a.length)[0].length * 20) + 35;
    const widthOfElement = contentElement.offsetWidth
    const width = widthOfElement > widthOfLongestLine ? widthOfElement : widthOfLongestLine
    contentElement.style = `
        height: ${totalHeight}px; 
        min-width: ${width}px;
        `
}

function _applyWidthAndHeightInputProvider(lines) {
    const widthOfLongestLine = (fullText.split('\n').sort((a, b) => b.length - a.length)[0].length * 20) + 35;
    const widthOfElement = contentElement.offsetWidth
    const width = widthOfElement > widthOfLongestLine ? widthOfElement : widthOfLongestLine
    inputProvider.style = `
        margin-top: ${parent.scrollTop}px;
        min-width: ${width}px;
        `
}

const parent = contentElement.parentElement

parent.addEventListener('scroll', () => {
    // loadEmptyLine()
    const lines = fullText.split('\n')
    findStartingLineAndLastVisibleLineForLines(lines)
    updateLines()
    updateContentOnScroll(lines)
    updateInputProvider(lines)
})

parent.addEventListener('scroll', () => {
    const lines = fullText.split('\n')
    findStartingLineAndLastVisibleLineForLines(lines)
    updateLines()
})

function updateContentOnScroll(lines) {
    contentElement.replaceChildren()
    const container = document.createElement('div')
    container.style = `width: 100%; height: fit-content; position: sticky; top:0%; left:0%;`
    for (let index = startingLine; index < lastVisibleLine; index++) {
        const lineElement = buildLineWithContent(lines, index)
        container.append(lineElement)
    }
    contentElement.append(container)
}

function findStartingLineAndLastVisibleLineForLines(lines) {
    const totalLines = lines.length
    const parent = linesElement.parentElement
    startingLine = Math.round(parent.scrollTop / 28.8)
    const maxLinesOnPage = Math.round(parent.clientHeight / 28.8)
    lastVisibleLine = totalLines < startingLine + maxLinesOnPage ? totalLines : startingLine + maxLinesOnPage
}
