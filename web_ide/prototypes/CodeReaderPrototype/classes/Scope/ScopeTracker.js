import ScopeType from "./ScopeType.js"
import Scope from "./Scope.js"
import Hint from "../Hints/Hint.js";
import HintTypes from "../Hints/HintTypes.js";

const INITIAL_SCOPE_ID = 0;


export default class ScopeTracker {
    constructor(hintsTracker, linesTracker) {
        this.currentScope = new Scope(new ScopeType().FILE, INITIAL_SCOPE_ID)
        this.previousScope = this.currentScope
        this.scopes = new Map()
        this.scopes.set(this.currentScope.id, this.currentScope)
        this.hintsTracker = hintsTracker
        this.linesTracker = linesTracker
    }

    cleanTracker() {
        // this.linesTracker.cleanTracker()
        this.currentScope = new Scope(new ScopeType().FILE, INITIAL_SCOPE_ID)
        this.scopes = new Map()
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    updateCurrentScopeToNewScopeAndInsertLine(newScope, line) {
        if ((this._checkIfWordsOnLineIncludeSpecifiedText(line, "else") ||
            this._checkIfWordsOnLineIncludeSpecifiedText(line, 'else if')) &&
            newScope.type === this.previousScope.type &&
            this.currentScope !== newScope.type) {
            this._raiseErrorIfCodeBetweenBlocksExists(line)
        }
        if (newScope != this.currentScope) {
            this._changeToNewScope(newScope)
        }
        console.log("INSERT")
        this._insertLineIntoScopeAndCloseScopeWhenNeeded(line)
    }

    _checkIfWordsOnLineIncludeSpecifiedText(line, text) {
        return line.content.includes(text)
    }

    _checkIfLineEndsWithSpeicifiedText(line, text) {
        return line.content.trim().endsWith(text)
    }

    _raiseErrorIfCodeBetweenBlocksExists(line) {
        const codeExistsBetweenBlocks = this._checkIfThereNeedsToBeAnErrorForCodeBetweenBlocks(line)
        if (codeExistsBetweenBlocks) {
            const message = `Error: Code between block scopes is not allowed.`
            this._buildHintErrorForLineWithMessage(line, message)
        }
    }

    _checkIfThereNeedsToBeAnErrorForCodeBetweenBlocks(line) {
        const numberOfLinesOfPreviousScope = this.previousScope.lines.length;
        const latLineInPreviousScope = this.previousScope.lines[numberOfLinesOfPreviousScope - 1]
        if (line.id - latLineInPreviousScope.id > 1) {
            return this._checkLinesBetweenBlocks(latLineInPreviousScope.id + 1, line.id)
        }
        return false
    }

    _checkLinesBetweenBlocks(firstLine, lastLine) {
        let codeExistsBetweenBlocks = false
        while (firstLine < lastLine) {
            const row = this.linesTracker.getLineForId(firstLine)
            if (row.content.trim() != "")
                codeExistsBetweenBlocks = true
            firstLine++
        }
        return codeExistsBetweenBlocks
    }

    _buildHintErrorForLineWithMessage(line, message) {
        const hint = new Hint(
            message,
            new HintTypes().ERROR,
            line.id,
            `hint-${line.id}`)
        this.hintsTracker.addHint(hint)
    }

    _changeToNewScope(scope) {
        this.currentScope.addChild(scope)
        this.currentScope = scope
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    _insertLineIntoScopeAndCloseScopeWhenNeeded(line) {
        this.currentScope.addNewLine(line)
        this._toggleSuggestionForCurlyBracketsIfLineIsStatement(line)
        console.log(line, "HERE")
        if (this._checkIfLineEndsWithSpeicifiedText(line, '}')) {
            console.log("SOME")
            this._closeCurrentScope()
            console.log(this.currentScope)
        }
        else if (this.currentScope.type == new ScopeType().BLOCK)
            this._handleBlocksWithoutCurlyBrackets(line)
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    _toggleSuggestionForCurlyBracketsIfLineIsStatement(line) {
        const isStatement = this._checkIfContentIsStatemet(line)
        const hints = this.hintsTracker.caughtProblems.get(`hint-${line.id}`)
        if (hints && isStatement && hints.problems[0]) {
            const message = `Suggestion: Add curly brackets, otherwise content will not be counted as part of the block.`
            this.hintsTracker.switchDisplaySettingsForHintWithMessageToSpecificMode(hints.problems[0], message, false)
        }
        else if (hints && hints.problems[0]) {
            const message = `Suggestion: Add curly brackets, otherwise content will not be counted as part of the block.`
            this.hintsTracker.switchDisplaySettingsForHintWithMessageToSpecificMode(hints.problems[0], message, hints.problems[0].isToBeDisplayed)
        }
    }

    _checkIfContentIsStatemet(line) {
        return this._checkIfWordsOnLineIncludeSpecifiedText(line, 'if') ||
            this._checkIfWordsOnLineIncludeSpecifiedText(line, 'else')
    }

    _checkIfLineEndsWithSpeicifiedText(line, text) {
        return line.content.trim().endsWith(text)
    }

    _closeCurrentScope() {
        if (this.currentScope.id > INITIAL_SCOPE_ID) {
            this.previousScope = this.currentScope
            this.currentScope.closeScope()
            this._searchForOpenScopeToGoBackTo()
        }
    }

    _searchForOpenScopeToGoBackTo() {
        this.currentScope = this.scopes.get(this.currentScope.id - 1)
        while (this.currentScope.isCloded)
            this.currentScope = this.scopes.get(this.currentScope.id - 1)
    }

    _handleBlocksWithoutCurlyBrackets() {
        let containsCurlyBracket = false
        this.currentScope.lines.forEach((line, index) => {
            if (line.content.trim().includes("{")) containsCurlyBracket = true
            else if (index > 1 && line.content.trim() !== "" && !containsCurlyBracket) this._suggestBracketsWhileClosingScopeForLine(line)
        });
    }

    _suggestBracketsWhileClosingScopeForLine(line) {
        this._closeCurrentScope()
        const message = `Suggestion: Add curly brackets, otherwise content will not be counted as part of the block.`
        this._buildHintSuggestionForLineWithMessage(line, message)
    }

    _buildHintSuggestionForLineWithMessage(line, message) {
        const hint = new Hint(
            message,
            new HintTypes().SUGGESTION,
            line.id,
            `hint-${line.id}`)
        this.hintsTracker.addHint(hint)
    }
}
