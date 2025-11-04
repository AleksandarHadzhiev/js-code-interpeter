export default class LineNumberTracker {
    constructor() {
        this.tracker = document.getElementById('lines');
    }

    buildLineNumbers(contentAsLines) {
        lines.replaceChildren()
        if (contentAsLines)
            contentAsLines.forEach((content, index) => {
                this._buildLineNumber(index)
            });
        else this._buildLineNumber(0)
    }

    _buildLineNumber(index) {
        const lineNumber = document.createElement('p')
        lineNumber.textContent = index + 1;
        lineNumber.classList.add('line-number')
        this.tracker.appendChild(lineNumber)
    }
}