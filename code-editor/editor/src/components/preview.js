export default class CustomPreview extends HTMLElement {
    constructor() {
        super()
        this.writer = document.getElementById('writer')

        this.writer.addEventListener('input', (event) => {
            this.innerHTML = event.target.value
        })
    }
}

customElements.define('custom-preview', CustomPreview)