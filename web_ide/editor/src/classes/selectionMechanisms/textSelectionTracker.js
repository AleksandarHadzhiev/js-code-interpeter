export default class TextSelectionTracker {
    constructor() {
        this.startingRange = null
        this.yMousePosition = 0
        this.isTextSelecting = false
        this.contentElement = document.getElementById('content')

        this.contentElement.addEventListener('mousedown', () => {
            this.isTextSelecting = true
        })

        window.addEventListener('mousemove', (event) => {
            if (this.isTextSelecting) {

            }
        })

        window.addEventListener('mouseup', () => {
            this.isTextSelecting = false
        })
    }
}