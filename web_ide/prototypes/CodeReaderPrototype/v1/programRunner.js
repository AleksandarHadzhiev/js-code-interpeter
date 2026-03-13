import FrontendBuilder from "./frontend/FrontendBuilder.js";
import LineSplitter from "./frontend/LineSplitter.js";
export default class ProgramRunner {
    constructor(reader) {
        this.frontendBuilder = new FrontendBuilder(reader)
    }

    writeCodeForContent(content) {
        const lines = this._buildAndGetTheLinesForContent(content)
        console.log(lines)
    }

    writeCode(content) {
        const splitter = new LineSplitter()
        const words = splitter.splitLineIntoWords(content)
        this.frontendBuilder.buildCodeForWords(words)
    }

    _buildAndGetTheLinesForContent(content) {
        let lines = String(content).split('\n')
        // lines = this.frontendBuilder.buildCodeBasedOnMultipleLinesChangesAndReturnRefactoredContent(lines)
        this.frontendBuilder.buildCode(lines)
        return lines
    }

    // writeCodeForLineIdWithContent(lineId, content) {
    //     const lines = this._buildLineAndGetAllLines(lineId, content)
    // }

    // _buildLineAndGetAllLines(lineId, content) {
    //     const lines = this.frontendBuilder.buildCodeBasedOnLineChangesAndReturnRefactoredContent(lineId, content)
    //     return lines
    // }
}