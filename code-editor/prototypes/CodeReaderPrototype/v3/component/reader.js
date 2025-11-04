import FrontendRunner from "../frontend/frontendRunner.js";

class CustomReader extends HTMLElement {
    constructor() {
        super()
        this.writer = document.getElementById('writer')
        this.runner = new FrontendRunner(this)

        this.writer.addEventListener('input', (event) => {
            const content = String(event.target.value)
            const lines = content.split('\n')
            this.runner.changesTracker.defineTheNewFirstLineOfChange(event.target.selectionStart, event.target.value)
            this.runner.buildCodeForLines(lines)
        })

        this.writer.addEventListener('scroll', () => {
            this.scrollTop = this.writer.scrollTop
            this.scrollLeft = this.writer.scrollLeft
        })

        this.writer.addEventListener('selectionchange', (event) => {
            const startingIndex = event.target.selectionStart
            const endingIndex = event.target.selectionEnd
            this.runner.changesTracker.defineTheFirstLineOfChange(startingIndex, event.target.value)
            this.runner.changesTracker.defineTheLastLineOfChange(endingIndex, event.target.value)
        })
    }
}

customElements.define('custom-reader', CustomReader)
