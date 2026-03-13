import ScopeTracker from "./ScopeTracker.js";
import ScopeBuilder from "./ScopeBuilder.js";
import LineBuilder from "../Line/LineBuilder.js";
import ScopeType from "./ScopeType.js";


export default class CodeBuilder {
    constructor(hintTracker, lineTracker, scopeTracker) {
        this.lineTracker = lineTracker
        this.hintTracker = hintTracker;
        this.scopeTracker = scopeTracker;
    }

    buildLine(line) {
        const existingLine = this._checkIfLineWithIdExists(line.id)
        if (existingLine) {
            console.log(existingLine)
            existingLine.updateContent(line.content)
        } else {
            const lineAsObject = this._createLine(line)
            this.lineTracker.addLine(lineAsObject)
        }
    }

    _createLine(line) {
        const builder = new LineBuilder(this.hintTracker, this.wordsTracker)
        const lineAsObject = builder.buildLine(line.content, line.id)
        console.log(lineAsObject)
        return lineAsObject
    }

    buildMultipleLines(lines) {
        console.log(lines)
    }

    _checkIfLineWithIdExists(id) {
        const line = this.lineTracker.getLineForId(id)
        if (line)
            return line
        return null
    }

    buildCodeForContent(content, wordsTracker) {
        const lines = String(content).split('\n')
        wordsTracker = this._createLines(lines, wordsTracker)
        this._cleanLines(lines)
        return wordsTracker
    }

    _createLines(lines, wordsTracker) {
        lines.forEach((line, index) => {
            const _line = this._createLineIfContentIsDifferent(line, index, wordsTracker)
            wordsTracker = this.lineTracker.addLine(_line, wordsTracker)
        })
        return wordsTracker
    }

    _cleanLines(lines) {
        const size = this.lineTracker.trackedLines.size
        const length = lines.length
        if (length < size) {
            this._removeLines(length, size)
        }
    }

    _removeLines(length, size) {
        for (let index = length; index < size; index++) {
            const line = this.lineTracker.getLineForId(index)
            this.lineTracker.removeLine(line)
        }
    }

    _createLineIfContentIsDifferent(line, index, wordsTracker) {
        let lineFromTracker = this.lineTracker.getLineForId(index)
        console.log(this.scopeTracker)
        if (lineFromTracker === undefined)
            lineFromTracker = this._buildLine(line, index, wordsTracker)
        else if (lineFromTracker.content !== line)
            lineFromTracker = this._updateLine(line, lineFromTracker, wordsTracker)
        return lineFromTracker
    }

    _updateLine(content, line, wordsTracker) {
        console.log(`LINE ID: ${line.id}`)
        const scope = this._buildScopeForLine(content)
        console.log(scope)
        line.updateContent(content)
        console.log(scope.type, line.scope.type)
        if (content.trim() == "") {
            this.scopeTracker.updateCurrentScopeToNewScopeAndInsertLine(line.scope, line)
        }
        else if (scope.type != line.scope.type) {
            line.scope.removeLine(line)
            line.updateScope(scope)
            this.scopeTracker.updateCurrentScopeToNewScopeAndInsertLine(line.scope, line)
        }

        const lineBuilder = new LineBuilder(this.hintTracker, wordsTracker);
        lineBuilder.buildWords(line)
        return line
    }

    _buildLine(content, index, wordsTracker) {
        console.log(`INDEX: ${index}`)
        console.log(content)
        const scope = this._buildScopeForLine(content)
        console.log(scope)
        const lineBuilder = new LineBuilder(this.hintTracker, wordsTracker);
        const line = lineBuilder.buildLine(content, index, scope);
        this.scopeTracker.updateCurrentScopeToNewScopeAndInsertLine(scope, line)
        console.log(this.scopeTracker.currentScope)
        lineBuilder.buildWords(line)
        return line
    }

    _buildScopeForLine(line) {
        const scopeBuilder = new ScopeBuilder(this.hintTracker, this.scopeTracker.currentScope)
        const scope = scopeBuilder.buildScopeBasedOnLine(line)
        return scope;
    }
}