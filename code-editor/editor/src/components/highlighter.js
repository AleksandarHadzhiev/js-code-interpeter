import ViewBuilder from "../classes/ViewBuilder.js"

class CusomHighlighter extends HTMLElement {
    constructor() {
        super()
        this.viewBuilder = new ViewBuilder(this)
        this.writer = document.getElementById('writer')
        this.writer.addEventListener('input', (event) => {
            this.replaceChildren()
            const lines = String(event.target.value).split('\n')
            lines.forEach(line => {
                const lineElement = document.createElement('div')
                lineElement.classList.add('line', 'content-format')
                lineElement.textContent = line
                this.appendChild(lineElement)
            });
        })

        this.writer.addEventListener('change', (event) => {
            const lines = String(event.target.value).split('\n')
            this.replaceChildren()
            lines.forEach(line => {
                const lineElement = document.createElement('div')
                lineElement.classList.add('line', 'content-format')
                lineElement.textContent = line
                this.appendChild(lineElement)
            });
        })

        this.writer.addEventListener('scroll', () => {
            this.scrollTop = this.writer.scrollTop
            this.scrollLeft = this.writer.scrollLeft
        })

    }
}

customElements.define('custom-highlighter', CusomHighlighter)