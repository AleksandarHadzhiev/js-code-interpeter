export default class Line {

    constructor(index, lines) {
        this.index = index
        this.lines = lines
        this.content = this.getLineContent(index)
        this.numeration = this.getLineNumerationBasedOnIndexInLoop(index)
    }

    getLineContent(index) {
        if (index >= this.lines.length)
            return ""
        return this.lines[index]
    }

    getLineNumerationBasedOnIndexInLoop(index) {
        return String(index + 1)
    }
}
