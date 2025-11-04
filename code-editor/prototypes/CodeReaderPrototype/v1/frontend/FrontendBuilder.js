import LineBuilder from "./LineBuilder.js"
import FormatBuilder from "./FormatBuilder.js"

export default class FrontendBuilder {
    constructor(reader) {
        // this.builder = new LineBuilder()
        this.reader = reader
        this.formatBuilder = new FormatBuilder(reader)
    }

    buildCodeBasedOnLineChangesAndReturnRefactoredContent(id, content) {
        // const refactoredLines = this.builder.writeLineWithIdAndContentAndGetRefactoredLines(id, content)
        this.formatBuilder.formatCodeForLinesAfterIndex(refactoredLines, id)
        return refactoredLines
    }

    buildCodeBasedOnMultipleLinesChangesAndReturnRefactoredContent(lines) {
        // const refactoredLines = this.builder.writeMultipleLinesAndGetRefactoredLines(lines)
        this.formatBuilder.formatCodeForLines(refactoredLines)
        return refactoredLines
    }

    buildCode(lines) {
        this.reader.replaceChildren('')
        console.log(lines)
        this.formatBuilder.formatCodeForLines(lines)
    }

    buildCodeForWords(words) {
        this.formatBuilder.formatCodeForWords(words)
    }
}