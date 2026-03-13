const lineTracker = document.getElementById('lines-tracker')

export default class LineNumberTracker {
    constructor(lines) {
        this.updateLineTracker(lines)
    }

    updateLineTracker(lines) {
        const numberOfLines = lines.length == 0 ? 1 : lines.length
        lineTracker.replaceChildren()
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