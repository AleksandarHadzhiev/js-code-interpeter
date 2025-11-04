import ViewBuilder from "../classes/ViewBuilder.js"

export default class CustomPreview extends HTMLElement {
    constructor() {
        super()
        this.viewBuilder = new ViewBuilder(this)
        this.writer = document.getElementById('writer')

        this.writer.addEventListener('input', (event) => {
            const content = String(event.target.value)
            const lines = content.split('\n')
            this.viewBuilder.changesTracker.defineTheNewFirstLineOfChange(event.target.selectionStart, event.target.value)
            this.viewBuilder.buildCodeForLines(lines)
        })

        this.writer.addEventListener('selectionchange', (event) => {
            const startingIndex = event.target.selectionStart
            const endingIndex = event.target.selectionEnd
            this.viewBuilder.changesTracker.defineTheFirstLineOfChange(startingIndex, event.target.value)
            this.viewBuilder.changesTracker.defineTheLastLineOfChange(endingIndex, event.target.value)
        })
    }
}

customElements.define('custom-preview', CustomPreview)