import ScopeType from "./ScopeType.js";
import Scope from './Scope.js'

export default class ScopeBuilder {
    constructor(hintsTracker, currentScope) {
        this.hintsTracker = hintsTracker;
        this.currentScope = currentScope;
    }

    buildScopeBasedOnLine(line) {
        if (this._checkIfWordsOnLineIncludeSpecifiedText(line, 'class'))
            return this._buildNewScope(new ScopeType().CLASS)
        else if (this._checkIfWordsOnLineIncludeSpecifiedText(line, 'constructor'))
            return this._buildNewScope(new ScopeType().CONSTRUCTOR)
        else if (this._lineIsStartingFunctionScope(line))
            return this._buildNewScope(new ScopeType().FUNCTION)
        else if (this._checkIfContentIsStatemet(line))
            return this._buildNewScope(new ScopeType().BLOCK)
        else return this.currentScope
    }

    _checkIfWordsOnLineIncludeSpecifiedText(line, text) {
        return line.includes(text)
    }

    _buildNewScope(type) {
        const scope = new Scope(type, this.currentScope.id + 1);
        scope.setParent(this.currentScope)
        return scope
    }

    _lineIsStartingFunctionScope(line) {
        if (this._checkIfWordsOnLineIncludeSpecifiedText(line, 'function'))
            return true
        else if (!this._checkIfContentIsStatemet(line) && !this._checkIfContentContainsNew(line) &&
            (this._checkIfLineEndsWithSpeicifiedText(line, "){") ||
                this._checkIfLineEndsWithSpeicifiedText(line, ") {")
            ))
            return true
        else if (this.currentScope.type == new ScopeType().CLASS &&
            this._checkIfLineEndsWithSpeicifiedText(line, ")") &&
            !this._checkIfContentIsStatemet(line) &&
            !this._checkIfContentContainsNew(line) &&
            !this._checkIfWordsOnLineIncludeSpecifiedText(line, "="))
            return true
        return false
    }

    _checkIfContentIsStatemet(line) {
        return this._checkIfWordsOnLineIncludeSpecifiedText(line, 'if') ||
            this._checkIfWordsOnLineIncludeSpecifiedText(line, 'else')
    }

    _checkIfLineEndsWithSpeicifiedText(line, text) {
        return line.trim().endsWith(text)
    }

    _checkIfContentContainsNew(line) {
        return this._checkIfWordsOnLineIncludeSpecifiedText(line, 'new')
    }
}