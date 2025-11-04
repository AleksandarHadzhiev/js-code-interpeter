import WordBuilder from "./Words/wordBuilder.js";


export default class LineBuilder {
    constructor(reader) {
        this.reader = reader
    }

    buildLines(lines) {
        for (let index = 0; index < lines.length; index++) {
            const content = lines[index];
            this._buildLineForContent(content)
        }
    }

    _buildLineForContent(content) {
        const linElement = this._constructLineWithText(content)
        this.reader.appendChild(linElement)
    }

    _constructLineWithText(text) {
        const lineElement = document.createElement('div')
        lineElement.innerHTML = new WordBuilder().buildWordsForContentAsHTML(text)
        lineElement.classList.add('line')
        return lineElement
    }

    updateLinesBetweenStartingAndEndingLine(startingLine, endingLine, lines) {
        for (let index = startingLine; index <= endingLine; index++) {
            const content = lines[index];
            this._updateOrBuildNewOne(index, content)
        }
    }

    _updateOrBuildNewOne(index, content) {
        let line = this.reader.childNodes[index]
        if (line) this.updateLineAtIndexWithNewContent(index, content)
        else this._buildLineForContent(content)
    }

    updateLineAtIndexWithNewContent(index, content) {
        const line = this.reader.childNodes[index]
        line.innerHTML = new WordBuilder().buildWordsForContentAsHTML(content)
    }

    bringToSameSize(differenceInSize, changesTracker) {
        while (differenceInSize > 0) {
            this.reader.childNodes[changesTracker.newFirstLineOfChange].remove()
            differenceInSize--;
        }
    }

    updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, contentAsLines, changesTracker) {
        for (let index = changesTracker.firstLineOfChange - 1; index < changesTracker.firstLineOfChange + differenceInSize; index++) {
            const content = contentAsLines[index];
            if (index == changesTracker.lastLineOfChange - 1) { this.updateLineAtIndexWithNewContent(index, content) }
            else {
                const lineElement = this._constructLineWithText(content)
                const child = this.reader.childNodes[index]
                this.reader.insertBefore(lineElement, child)
            }
        }
    }

    updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, contentAsLines, changesTracker) {
        for (let index = changesTracker.firstLineOfChange - 1; index <= changesTracker.lastLineOfChange - 1 + differenceInSize; index++) {
            const content = contentAsLines[index];
            if (index >= changesTracker.lastLineOfChange) {
                const lineElement = this._constructLineWithText(content)
                const child = this.reader.childNodes[index]
                this.reader.insertBefore(lineElement, child)
            }
            else this.updateLineAtIndexWithNewContent(index, content)
        }
    }

    updatePreviousAndCurrent(newLines, changesTracker) {
        const indexOfPreviousLine = changesTracker.newFirstLineOfChange - 2 // - 2 because we talk about indexes not number of lines
        const contentOfPreviousLine = newLines[indexOfPreviousLine]
        this.updateLineAtIndexWithNewContent(indexOfPreviousLine, contentOfPreviousLine)
        const indexOfline = changesTracker.newFirstLineOfChange - 1
        const content = newLines[indexOfline]
        const line = this._constructLineWithText(content)
        const child = this.reader.childNodes[indexOfline]
        this.reader.insertBefore(line, child)
    }

    refresh(newLines) {
        this.reader.replaceChildren()
        this.buildLines(newLines)
    }
}