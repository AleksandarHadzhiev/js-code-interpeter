import ColorPicker from "../../frontend/ColorPicker.js";

export class WordColorDefiner {
    constructor() {
        this.singleQuotationNumber = 0;
        this.doubleQuotationNumber = 0;
        this.specialQuotationNumber = 0;
        this.isStringInsertion = false;
    }

    defineColor(_word, index, words) {
        this._increaseQuotationNumber(_word)
        let color = new ColorPicker().pickColorBasedOnWordType(_word.value)
        if (words[index + 1] == "(")
            color = "orange";
        else if (this._checkIfWordIsInsideString())
            color = "green";
        color = this._checkIfItsObjectCreation(words, index, color)
        this._checkIfItsVariableInsertionInsideString(_word.value, index, words)
        color = this._checkIfItIsAVariableInsertionInsideString(_word.value, color)
        return color
    }

    _checkIfItsObjectCreation(words, index, color) {
        if (words.includes('new') && words.indexOf('new') < index && index < words.indexOf('(', words.indexOf('new'))) {
            return "red"
        }
        return color
    }

    _increaseQuotationNumber(word) {
        if (word == "'")
            this._increaseSingle()
        else if (word == `"`)
            this._increaseDouble()
        else if (word == "`")
            this._increaseSpecial()
    }

    _increaseSingle() {
        if (this.singleQuotationNumber == 2)
            this.singleQuotationNumber = 1;
        else this.singleQuotationNumber += 1;
    }

    _increaseDouble() {
        if (this.doubleQuotationNumber == 2)
            this.doubleQuotationNumber = 1;
        else this.doubleQuotationNumber += 1;
    }

    _increaseSpecial() {
        if (this.specialQuotationNumber == 2)
            this.specialQuotationNumber = 1;
        else this.specialQuotationNumber += 1;
    }

    _checkIfWordIsInsideString() {
        if (this.specialQuotationNumber == 1 || this.singleQuotationNumber == 1 || this.doubleQuotationNumber == 1)
            return true;
        return false
    }

    _checkIfItsVariableInsertionInsideString(_word, index, words) {
        if (_word == "$" && words[index + 1] == "{")
            this.isStringInsertion = true
    }

    _checkIfItIsAVariableInsertionInsideString(_word, color) {
        if (this.isStringInsertion) {
            if (this.isStringInsertion && _word == "}")
                this.isStringInsertion = false
            return new ColorPicker().pickColorBasedOnWordType(_word)
        }
        return color;
    }
}