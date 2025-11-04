import FrontendRunner from "./frontend/frontendRunner.js";
import LineNumberTracker from "./frontend/LineNumberTracker.js";

const writer = document.getElementById('writer');
const writerContainer = document.getElementById('writer-container');
const preview = document.getElementById('preview')

const runner = new FrontendRunner()
const tracker = new LineNumberTracker()

writer.addEventListener('input', (event) => {
    const lines = splitTargetContentIntoLines(event.target)
    runner.changesTracker.defineTheNewFirstLineOfChange(event.target.selectionStart, event.target.value)
    runner.buildCodeForLines(lines)
    tracker.buildLineNumbers(lines)
    // loadPreview()
})



function splitTargetContentIntoLines(target) {
    const content = target.value;
    return String(content).split('\n')
}

writer.addEventListener('scroll', () => {
    writerContainer.scrollTop = writer.scrollTop
    reader.scrollLeft = writer.scrollLeft
    reader.scrollTop = writer.scrollTop
})

writer.addEventListener('selectionchange', (event) => {
    const startingIndex = event.target.selectionStart
    const endingIndex = event.target.selectionEnd
    runner.changesTracker.defineTheFirstLineOfChange(startingIndex, event.target.value)
    runner.changesTracker.defineTheLastLineOfChange(endingIndex, event.target.value)
})