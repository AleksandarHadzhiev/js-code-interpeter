export default class LineNumberationTracker {
    constructor() {
        this.tracker = document.getElementById('lines');
    }

    buildLineNumbers(lines) {
        this.tracker.replaceChildren()
        if (lines && lines.length > 0)
            for (let index = 0; index < lines.length; index++) {
                this._buildLineNumber(index)
            }
        else this._buildLineNumber(0)
    }

    _buildLineNumber(index) {
        const lineNumber = document.createElement('p')
        lineNumber.textContent = index + 1;
        lineNumber.classList.add('line-number')
        this.tracker.appendChild(lineNumber)
    }
}