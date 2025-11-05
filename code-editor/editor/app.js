import LineNumberationTracker from "./src/classes/lineNumerationTracker.js"

const writer = document.getElementById('writer')
const editorContainer = document.getElementById('editor-container')

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