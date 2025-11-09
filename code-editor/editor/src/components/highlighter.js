class CusomHighlighter extends HTMLElement {
    constructor() {
        super()
        this.writer = document.getElementById('writer')
        this.writer.addEventListener('input', (event) => {
            const content = String(event.target.value)
            this.textContent = content
        })

        this.writer.addEventListener('scroll', () => {
            this.scrollTop = this.writer.scrollTop
            this.scrollLeft = this.writer.scrollLeft
        })

    }
}

customElements.define('custom-highlighter', CusomHighlighter)