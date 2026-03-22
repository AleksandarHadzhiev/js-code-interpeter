import LineNumberTracker from "./frontend/LineNumberTracker.js";

const writer = document.getElementById('writer');
const writerContainer = document.getElementById('writer-container');

const tracker = new LineNumberTracker()

writer.addEventListener('input', async (event) => {
    const content = event.target.value
    const lines = String(content).split('\n')
    tracker.buildLineNumbers(lines)
})


writer.addEventListener('scroll', () => {
    writerContainer.scrollTop = writer.scrollTop
})
