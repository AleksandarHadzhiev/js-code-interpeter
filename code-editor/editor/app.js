import LineNumberationTracker from "./src/classes/lineNumerationTracker.js"

const writer = document.getElementById('writer')
const editorContainer = document.getElementById('editor-container')
const search = document.getElementById('search')
const highlighter = document.getElementById('highlighter')

// Start from line 1 when the app boots up
new LineNumberationTracker().buildLineNumbers([])


writer.addEventListener('input', (event) => {
    const lines = String(event.target.value).split('\n')
    new LineNumberationTracker().buildLineNumbers(lines)
})

writer.addEventListener('scroll', (event) => {
    editorContainer.scrollTop = event.target.scrollTop
    editorContainer.scrollLeft = event.target.scrollLeft
})

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == "f" || event.key == "F") {
        event.preventDefault()
        if (search.classList.contains('invisible')) {
            search.classList.replace('invisible', 'search')
            highlighter.classList.replace('invisible', 'highlighter')
        }
        else {
            search.classList.replace('search', 'invisible')
            highlighter.classList.replace('highlighter', 'invisible')
        }
    }
})