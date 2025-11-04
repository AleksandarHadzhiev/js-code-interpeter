import BaseColorPicker from "./BaseColorPicker.js";

export default class WordColorDefiner {
    constructor(words) {
        this.singleQuotationNumber = 0;
        this.doubleQuotationNumber = 0;
        this.specialQuotationNumber = 0;
        this.isStringInsertion = false;
        this.color = "transparent;"
        this.words = words
    }

    defineColorForWordAtIndex(word, index) {
        this._increaseQuotationNumber(word)
        this.color = new BaseColorPicker().pickColorBasedOnWordType(word)
        this._updateColorIfWortAdIndexIsAFunctionCall(index)
        this._updateColorForWordAtIndexIfItsAStringValue(word, index)
        this._updateColorIfItsObjectCreation(index)
        return this.color
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


    _updateColorIfWortAdIndexIsAFunctionCall(index) {
        if (this.words[index + 1] == "(")
            this.color = "#FF7A30";
    }

    _updateColorForWordAtIndexIfItsAStringValue(word, index) {
        if (this._checkIfWordIsInsideString())
            this.color = "#169976";
        this._updateColorOnInsertionInsideString(word, index)
    }

    _checkIfWordIsInsideString() {
        if (this.specialQuotationNumber == 1 || this.singleQuotationNumber == 1 || this.doubleQuotationNumber == 1)
            return true;
        return false
    }

    _updateColorOnInsertionInsideString(word, index) {
        this._checkIfItsInsertionInsideString(word, index)
        this.color = this._changeColorOfItsInsertionInsideString(word, index)
    }

    _checkIfItsInsertionInsideString(word, index) {
        if (word == "$" && this.words[index + 1] == "{")
            this.isStringInsertion = true
    }

    _changeColorOfItsInsertionInsideString(word, index) {
        if (this.isStringInsertion) {
            this._closeInsertionIfWordIsClosingBracket(word)
            this.color = new BaseColorPicker().pickColorBasedOnWordType(word)
            this._updateColorIfWortAdIndexIsAFunctionCall(index)
        }
    }

    _closeInsertionIfWordIsClosingBracket(word) {
        if (this.isStringInsertion && word == "}")
            this.isStringInsertion = false
    }

    _updateColorIfItsObjectCreation(index) {
        if (this.words.includes('new') && this.words.indexOf('new') < index && index < this.words.indexOf('(', this.words.indexOf('new'))) {
            this.color = "#E43636"
        }
    }

}