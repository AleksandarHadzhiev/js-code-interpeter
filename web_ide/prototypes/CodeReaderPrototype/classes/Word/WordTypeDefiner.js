import ScopeType from "../Scope/ScopeType.js"
import WordType from "./WordType.js"

const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch'],
    brackets: ['(', ')', '{', '}'],
    arrayBrackets: ['[', ']'],
    quotationMarks: [`'`, `"`, `${"`"}`],
    specialKeyWords: ['this', 'new', 'return', 'import', 'from', 'export']
}


export class WordTypeDefiner {
    constructor(word, index, words, line, tracker) {
        this.word = word
        this.index = index
        this.words = words
        this.line = line
        this.tracker = tracker
    }

    defineTypeForWordOnLine() {
        if (this.word.trim() == "") return new WordType().EMPTY;
        else if (this._checkIfWordIsKeyword()) return new WordType().EMPTY;
        else if (this._defineType() != null) return this._defineType()
        else return new WordType().VARIABLE_VALUE;
    }

    _checkIfWordIsKeyword() {
        if (keywords.arrayBrackets.includes(this.word))
            return true;
        else if (keywords.brackets.includes(this.word))
            return true;
        else if (keywords.mathematicOperations.includes(this.word))
            return true;
        else if (keywords.quotationMarks.includes(this.word))
            return true;
        else if (this.word === "constructor")
            return false;
        else if (keywords.scopeInitingWords.includes(this.word))
            return true;
        else if (keywords.sentencePointers.includes(this.word))
            return true;
        else if (keywords.variableInitWords.includes(this.word))
            return true;
        else if (keywords.specialKeyWords.includes(this.word))
            return true;
        return false;
    }

    _defineType() {
        if (this._checkIfWordIsFunctionNameInsideClass()) return new WordType().CLASS_FUNCTION;
        else if (this._checkIfWordIsFunctionNameOutsideClass()) return new WordType().FUNCTION;
        else if (this._checkIfWordIsParamaterVariable()) return new WordType().FUNCTION_PARAMETER;
        else if (this._checkIfWordIsFunctionArumgnetVariable()) return new WordType().FUNCTION_ARGUMENT;
        else if (this._checkIfWordIsClassName()) return new WordType().CLASS;
        else if (this._checkIfWordIsLetVariable()) return new WordType().LET_ARIABLE;
        else if (this._checkIfWordIsConstVariable()) return new WordType().CONST_ARIABLE;
        else if (this._checkIfWordIsClassField()) return new WordType().CLASS_FIELD;
        else if (this._chekcIfWordIsClassObject()) return new WordType().CLASS_OBJECT;
        else if (this._checkIfWordHasBeenMentionedAsVariableBefore()) return this._getTheTypeOfTheUsedWord();
        return null
    }

    _checkIfWordIsParamaterVariable() {
        const isInAFunction = this.words.includes('constructor') || this.words.includes('function')
        const isBetweenBrackets = this._checkIfWordIsBetweenBrackets()
        if (isInAFunction && isBetweenBrackets) return true
        else if (this._isOnFirstLineOfScopeOfTypeFunction() && isBetweenBrackets) return true
        return false
    }

    _checkIfWordIsBetweenBrackets() {
        const indexOfOpeningBracket = this.words.indexOf('(')
        const indexOfClosingBracket = this.words.indexOf(')')
        if (this.index > indexOfOpeningBracket && this.index < indexOfClosingBracket)
            return true
        return false
    }

    _isOnFirstLineOfScopeOfTypeFunction() {
        const scopeLines = this.line.scope.getLines();
        const indexOfLine = scopeLines.indexOf(this.line)
        if (indexOfLine == 0 && this.line.scope.type == new ScopeType().FUNCTION) return true
        return false
    }

    _checkIfWordIsFunctionArumgnetVariable() {
        const isBetweenBrackets = this._checkIfWordIsBetweenBrackets()
        if (isBetweenBrackets && (!this._checkIfWordIsInLoop() && !this._checkIfWordIsInStatement()))
            return true
        return false
    }

    _checkIfWordIsInStatement() {
        if (this.words.includes('if') || this.words.includes('else'))
            return true
        return false
    }

    _checkIfWordIsInLoop() {
        if (this.words.includes('for') || this.words.includes('while') || this.words.includes('forEach'))
            return true
        return false
    }

    _checkIfWordIsFunctionNameInsideClass() {
        if (this.words.includes('constructor') && this.words[this.index] == 'constructor')
            return true;
        else if (this.words.includes('if') || this.words.includes('else') || this.words.includes('new'))
            return false;
        else if (this.words[this.index + 1] == "(" && !this.words.includes('function') && this._hasADotOrNothingInfrontOfItself())
            return true;
        else return false;
    }

    _hasADotOrNothingInfrontOfItself() {
        if (this.words.includes('.')) {
            const indexOfDot = this.words.indexOf('.') + 1
            return !this._checkIfWordIsInBetween(indexOfDot)
        }
        else {
            const startingPoint = 0
            const isInsideClass = this.line.scope.parent ? this.line.scope.parent.type === new ScopeType().CLASS : false
            return isInsideClass && !this._checkIfWordIsInBetween(startingPoint)
        }
    }

    _checkIfWordIsInBetween(startingPoint) {
        let wordIsInBetween = false
        for (let index = startingPoint; index < this.index; index++) {
            const element = this.words[index];
            if (element.trim() !== "")
                wordIsInBetween = true
        }
        return wordIsInBetween
    }

    _checkIfWordIsFunctionNameOutsideClass() {
        if (this.words[this.index + 1] == "(" && this.words.includes('function') && !this.words.includes('new'))
            return true;
        else if (this.words[this.index + 1] == "(" && !this.words.includes('new') && !this._hasADotOrNothingInfrontOfItself())
            return true;
        else return false;
    }

    _checkIfWordIsClassName() {
        if (this.words.includes('class')) return this._checkIfWordIsnextToClassKeyword()
        return false
    }

    _checkIfWordIsnextToClassKeyword() {
        const indexOfClass = this.words.indexOf('class')
        if (this.index === indexOfClass + 1 || this.index === indexOfClass + 2)
            return true;
        return false
    }

    _checkIfWordIsConstVariable() {
        if (this.words.includes('const')) return this._checkIfWordIsNextToConst()
        return false
    }

    _checkIfWordIsNextToConst() {
        const indexOfClass = this.words.indexOf('const')
        if (this.index === indexOfClass + 1 || this.index === indexOfClass + 2)
            return true;
        return false
    }

    _checkIfWordIsLetVariable() {
        if (this.words.includes('let') || this.words.includes('var')) return this._checkIfWordIsNextToLet()
        return false
    }

    _checkIfWordIsNextToLet() {
        const indexOfClass = this.words.includes('let') ? this.words.indexOf('let') : this.words.indexOf('var')
        if (this.index === indexOfClass + 1 || this.index === indexOfClass + 2)
            return true;
        return false
    }

    _checkIfWordIsClassField() {
        const indexOfThis = this.words.includes('this') ? this.words.indexOf('this') : -1
        const indexOfDot = this.words.includes('.') ? this.words.indexOf('.') : -1

        if (indexOfThis !== -1 && this.index == indexOfThis + 2 && indexOfDot !== -1 && indexOfDot - indexOfThis == 1) return true
        return false
    }

    _chekcIfWordIsClassObject() {
        const indexOfNew = this.words.indexOf('new');
        if (indexOfNew !== -1) {
            return this._checkWords(indexOfNew)
        }
        return false
    }

    _checkWords(indexOfNew) {
        let indexOfClass = -1;
        // indexOfClass is to be used, and will be very important as it will get the exact type of class it is
        this.words.forEach((word, index) => {
            if (index > indexOfNew && word.trim() != "" && indexOfClass === - 1) {
                indexOfClass = index
            }
        })
        return indexOfClass == -1 ? false : true
    }

    _checkIfWordHasBeenMentionedAsVariableBefore() {
        const words = this.tracker.words.get(this.word)
        if (words) return true
        return false
    }

    _getTheTypeOfTheUsedWord() {
        let type = this.tracker.words.get(this.word)[0].type
        return type
    }
}