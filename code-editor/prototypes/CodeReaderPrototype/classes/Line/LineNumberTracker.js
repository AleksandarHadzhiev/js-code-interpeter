const lineTracker = document.getElementById('lines-tracker')

export default class LineNumberTracker {
    constructor() {
        this.updateLineTracker()
    }

    getLines() {
        const lines = document.getElementsByName('line')
        return lines.length
    }

    updateLineTracker() {
        lineTracker.replaceChildren("")
        const numberOfLines = this.getLines()
        for (let number = 1; number <= numberOfLines; number++) {
            this.appointLineNumberToLine(number)
        }
    }

    appointLineNumberToLine(number) {
        const lineNumber = this.buildLineNumber(number)
        lineTracker.appendChild(lineNumber)
    }

    buildLineNumber(number) {
        const lineNumber = document.createElement('p')
        lineNumber.textContent = number
        lineNumber.setAttribute('id', `line-${number}`)
        lineNumber.classList.add('line-number')
        return lineNumber
    }
}