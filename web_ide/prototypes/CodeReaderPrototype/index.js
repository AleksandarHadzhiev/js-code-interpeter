const reader = document.getElementById('code')
const main = document.getElementById('reader-container')
const lineTracker = document.getElementById('lines-tracker')
const writer = document.getElementById('code-writer')
let elementToRedirectTo = null

const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch']
}

function getLines() {
    const lines = reader.textContent.split('\n')
    return lines.length
}

function updateLineTracker() {
    lineTracker.replaceChildren("")
    const numberOfLines = getLines()
    for (let number = 1; number <= numberOfLines; number++) {
        appointLineNumberToLine(number)
    }
}

function appointLineNumberToLine(number) {
    const lineNumber = buildLineNumber(number)
    lineTracker.appendChild(lineNumber)
}

function buildLineNumber(number) {
    const lineNumber = document.createElement('p')
    lineNumber.textContent = number
    lineNumber.classList.add('line-number')
    return lineNumber
}

function searchForWordInContent(word) {
    reader.childNodes.forEach(node => {
        const lowered = node.textContent.toLocaleLowerCase()
        node.innerHTML = lowered.replaceAll(word, highlighSpecificWord(word))
    });
}

function highlighSpecificWord(word) {
    return `<span style="background-color: lightblue;">${word}</span>`
}

function createAListOfWordsAsElementsInTheRow(lineContent) {
    const content = String(lineContent)
    const lines = content.split('\n')
    const words = goThroughEachLine(lines)
    // console.log(words)
    // console.log(lines)
    return words
}

function goThroughEachLine(lines) {
    let words = []
    lines.forEach((line, index) => {

        const characters = line.split('')
        words = buildWordsBasedOnCharacters(characters, words)
        if (lines.length > 1 && index < lines.length - 1) {
            words.push('\n')
        }
    });
    return words
}
// every word is part of scope
// easy ways to identify scopes are if there is a certain word on the line
// there are times when it can't identify scope based on words
// when that happens, how to identify?
// by default everything is part of the file scope
// how to keep track of scope to add to?
// - there should be a current scope to add to - which starts with the default scope - file
// - that scope should be updated whenever a new scope is detected - how is a new scope detected?
// - the scopes should be stored somewhere with all the data they have inside them.
// - so a scope should keep track of when it starts and when it ends
// - how does it know where it starts
// - how does it know where it ends
// - can a check on a line be good enough? what if the scope itself is initialized on a new line without much information 
// - a scope should have a dynamic indentation - based on how nested it is - how will the dynamic indentation work? empty spaces? paddings? margins?
// - how to handle scopes which don't start where a function of block was initialized?
// - how to handle scopes which don't have a clear starting point?
// - how to handle scopes which don't have a clear ending point?
// what happens when there are multiple scopes of the same type?


function buildWordsBasedOnCharacters(characters, words) {
    let word = ''
    characters.forEach((character) => {
        if (character === " " || keywords.sentencePointers.includes(character)) {
            words.push(word)
            word = ""
            words.push(character)
        }
        else if (character === "(" || character === ")" || character === "{" || character === "}") {
            words.push(word)
            word = ""
            words.push(character)
        }
        else if (character === '\n') {
            words.push(word)
            word = ""
            words.push(character)
        }
        else word += character
    })
    words.push(word)
    return words
}

function highlightKeywordsForElementWithContent(content) {
    const words = createAListOfWordsAsElementsInTheRow(content)
    let scopeToAddTo = reader
    reader.replaceChildren('')
    words.forEach((word, index) => {
        const scopeElement = buildElementOfScope(word, index)
        scopeToAddTo.appendChild(scopeElement)
    })
}

function buildElementOfScope(word, index) {
    if (keywords.scopeInitingWords.includes(word))
        return buildSpanElementWithSpecifiedColor("purple", word, index)
    else if (keywords.variableInitWords.includes(word))
        return buildSpanElementWithSpecifiedColor("purple", word, index)
    else if (keywords.mathematicOperations.includes(word))
        return buildSpanElementWithSpecifiedColor("gray", word, index)
    else if (keywords.sentencePointers.includes(word))
        return buildSpanElementWithSpecifiedColor("white", word, index)
    else if (word.startsWith(`"`) && word.endsWith(`"`) || word.startsWith(`'`) && word.endsWith(`'`))
        return buildSpanElementWithSpecifiedColor("green", word, index)
    else
        return buildSpanElementWithSpecifiedColor("rgb(54, 101, 255)", word, index)
}

function buildSpanElementWithSpecifiedColor(color, word, index) {
    const span = document.createElement('span')
    span.setAttribute('id', index)
    span.textContent = word
    span.style = `color: ${color}; `
    return span
}

function handleRedirectToForElementWithId(id) {
    const target = document.getElementById(id)
    handleRedirectToForElement(target)
}

function handleRedirectToForElement(target) {
    const nodes = reader.childNodes
    // console.log(target) // the element which is being searchedFor
    // console.log(nodes) // the possible elements where it could be
    nodes.forEach((node) => {
        if (node.nodeType != 3) {
            handleTheCheck(node, target)
        }
    })
    redirectToElement()
}

function handleTheCheck(node, target) {
    // console.log(node, target) // check if the searchedFor is the same as the possibility
    if (node.textContent == target.textContent && node.id != target.id && !node.id.includes('parent')) {
        elementToRedirectTo = node
    }
}


function redirectToElement() {
    // console.log(elementToRedirectTo)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(buildRange(elementToRedirectTo))
    elementToRedirectTo.scrollIntoView()
}

function buildRange(element) {
    const range = document.createRange()
    range.setStart(element.firstChild, 0)
    range.setEnd(element.firstChild, element.textContent.length)
    return range
}

function wordsToCombinedString(words) {
    let combinedString = ""
    words.forEach((word) => {
        combinedString += `${word} `
    })
    return combinedString
}


updateLineTracker()

window.addEventListener('keydown', (event) => {
    const pressedKey = event.key
    if (pressedKey === "Control")
        writer.style = `display: none; `;
})

document.addEventListener('keyup', (event) => {
    const pressedKey = event.key
    if (pressedKey === "Control")
        writer.style = `
    position: absolute;
    top: 5 %;
    left: 5 %;
    font - size: 20px;
    border: none;
    outline: none;
    background - color: transparent;
    color: transparent;
    caret - color: gray;
    width: 95 %;
    height: 90 %;
    overflow: auto;
    `

})

writer.addEventListener('input', (event) => {
    const content = event.target.value
    highlightKeywordsForElementWithContent(content)
    updateLineTracker()
})

// writer.addEventListener('keydown', (event) => {
//     if (event.ctrlKey && event.key === "f") {
//         searchForWordInContent("o")
//     }
// })

writer.addEventListener('scroll', (event) => {
    main.scrollTop = writer.scrollTop
    main.scrollLeft = writer.scrollLeft
})

reader.addEventListener('click', (event) => {
    console.log("CLICKED")
    handleRedirectToForElementWithId(event.target.id)
    console.log(`TEXT: ${event.target.textContent} `)
})
