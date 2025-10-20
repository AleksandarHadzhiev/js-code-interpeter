const reader = document.getElementById('code')
const main = document.getElementById('reader-container')
const lineTracker = document.getElementById('lines-tracker')

const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch'],
    brackets: ['(', ')', '{', '}'],
    arrayBrackets: ['[', ']'],
    quotationMarks: [`'`, `"`, `${"`"}`]

}

class LineNumberTracker {
    constructor() {
        this.updateLineTracker()
    }

    getLines() {
        const lines = document.getElementsByName('line')
        return lines.length
    }

    updateLineTracker() {
        lineTracker.replaceChildren("")
        const numberOfLines = this.getLines()
        for (let number = 1; number <= numberOfLines; number++) {
            this.appointLineNumberToLine(number)
        }
    }

    appointLineNumberToLine(number) {
        const lineNumber = this.buildLineNumber(number)
        lineTracker.appendChild(lineNumber)
    }

    buildLineNumber(number) {
        const lineNumber = document.createElement('p')
        lineNumber.textContent = number
        lineNumber.setAttribute('id', `line-${number}`)
        lineNumber.classList.add('line-number')
        return lineNumber
    }

}

class WordTracker {
    constructor() {
        this.words = new Map()
    }

    addWordToWords(word) {
        if (this.words.size == 0)
            this._buildNewWordsForWord(word)
        else
            this._addWordToWords(word)
    }

    _buildNewWordsForWord(word) {
        const words = []
        this._pushTheWords(words, word)
    }

    _pushTheWords(words, word) {
        words.push(word)
        this.words.set(word.value, words)
    }

    _addWordToWords(word) {
        const words = this.words.get(word.value)
        if (words)
            this._pushTheWords(words, word)
        else
            this._pushTheWords([], word)
    }

    clean() {
        this.words = new Map()
    }
}

const wordTracker = new WordTracker()


class Word {
    constructor(value, color, type, lineId, index) {
        this.value = value;
        this.color = color;
        this.type = type;
        this.lineId = lineId
        this.id = `${this.lineId}-${index}`
        this.redirectToElementInCode = null
    }

    updateRedirectToElementInCode(element) {
        this.redirectToElementInCode = element
    }

}

class ColorPicker {
    pickColorBasedOnWordType(word) {
        if (keywords.variableInitWords.includes(word))
            return "purple";
        else if (keywords.mathematicOperations.includes(word))
            return "gray";
        else if (keywords.sentencePointers.includes(word))
            return "white";
        else if (keywords.scopeInitingWords.includes(word))
            return "red";
        else if (keywords.brackets.includes(word))
            return "yellow"
        else if (keywords.arrayBrackets.includes(word))
            return "pink"
        else if (keywords.quotationMarks.includes(word))
            return "green"
        else return "blue"
    }
}

class WordType {
    KEYWORD = 'keyword';
    CONST_ARIABLE = 'const_variable';
    LET_ARIABLE = 'let_variable';
    VARIABLE_VALUE = 'value';
    CLASS = 'class';
    FUNCTION = 'function';
    EMPTY = 'empty';
}

class WordBuilder {
    constructor() {
        this.singleQuotationNumber = 0;
        this.doubleQuotationNumber = 0;
        this.specialQuotationNumber = 0;
        this.isStringInsertion = false;
        this.words = []
    }

    trasnformWords(words, line) {
        words.forEach((_word, index) => {
            const content = this._defineContent(_word, words)
            const color = this._defineColor(_word, index, words)
            const wordType = this._defineWordType(_word, index, words, line)
            const word = new Word(content, color, wordType, line.id, index)
            this.words.push(word)
            console.log(this.words)
        });
    }

    _defineContent(_word, words) {
        if (_word == '' && words.length == 1) {
            return '\n'
        }
        return _word
    }

    _defineColor(_word, index, words) {
        this._increaseQuotationNumber(_word)
        let color = new ColorPicker().pickColorBasedOnWordType(_word)
        if (words[index + 1] == "(")
            color = "orange";
        if (this._checkIfWordIsInsideString())
            color = "green";
        // check if it is insertion of a variable inside string
        this._checkIfItsVariableInsertionInsideString(_word, index, words)
        color = this._checkIfItIsAVariableInsertionInsideString(_word, color)
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
        // We should color everythig between ${ and } based on colors they are from ColorPicker.
        // Together with the ${ and }
        // How to catch them?
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

    _defineWordType(_word, index, words, line) {
        const isKeyword = this._checkIfWordIsKeyword(_word)
        if (isKeyword) return new WordType().KEYWORD;
        else if (this._checkIfWordIsFunctionName(index, _word, words, line)) return new WordType().FUNCTION;
        else if (this._checkIfWordIsClassName(words, index, _word)) return new WordType().CLASS;
        else if (this._checkIfWordIsLetVariable(_word, words, index)) return new WordType().LET_ARIABLE;
        else if (this._checkIfWordIsConstVariable(_word, words, index)) return new WordType().CONST_ARIABLE;
        else if (this._checkIfWordHasBeenMentionedAsVariableBefore(_word)) return wordTracker.words.get(_word)[0].type;
        else return new WordType().VARIABLE_VALUE;
    }

    _checkIfWordHasBeenMentionedAsVariableBefore(word) {
        const words = wordTracker.words.get(word)
        if (words) return true
        return false
    }

    _checkIfWordIsKeyword(_word) {
        if (keywords.arrayBrackets.includes(_word))
            return true;
        else if (keywords.brackets.includes(_word))
            return true;
        else if (keywords.mathematicOperations.includes(_word))
            return true;
        else if (keywords.quotationMarks.includes(_word))
            return true;
        else if (_word === "constructor")
            return false;
        else if (keywords.scopeInitingWords.includes(_word))
            return true;
        else if (keywords.sentencePointers.includes(_word))
            return true;
        else if (keywords.variableInitWords.includes(_word))
            return true;
        return false;
    }

    _checkIfWordIsFunctionName(index, _word, words, line) {
        if (_word === "constructor")
            return true;
        if (line.line.includes('if') || line.line.includes('else'))
            return false;
        else if (words[index + 1] == "(")
            return true;
        else return false;
    }

    _checkIfWordIsClassName(words, index, word) {
        if (words.includes('class')) return this._checkIfWordIsnextToClassKeyword(words, index, word)
        return false
    }

    _checkIfWordIsnextToClassKeyword(words, index, word) {
        const indexOfClass = words.indexOf('class')
        if (index === indexOfClass + 1 || index === indexOfClass + 2)
            return true;
        return false
    }

    _checkIfWordIsConstVariable(word, words, index) {
        if (words.includes('const')) return this._checkIfWordIsNextToConst(word, words, index)
        return false
    }

    _checkIfWordIsNextToConst(word, words, index) {
        const indexOfClass = words.indexOf('const')
        if (index === indexOfClass + 1 || index === indexOfClass + 2)
            return true;
        return false
    }

    _checkIfWordIsLetVariable(word, words, index) {
        if (words.includes('let') || words.includes('var')) return this._checkIfWordIsNextToLet(word, words, index)
        return false
    }

    _checkIfWordIsNextToLet(word, words, index) {
        const indexOfClass = words.includes('let') ? words.indexOf('let') : words.indexOf('var')
        if (index === indexOfClass + 1 || index === indexOfClass + 2)
            return true;
        return false
    }
}

class Line {
    constructor(line, index) {
        this.line = line;
        this.id = index
        this.words = [];
        this.wordValue = "";
    }

    getTransformedWords() {
        const builder = new WordBuilder()
        builder.trasnformWords(this.words, this)
        console.log(builder)
        return builder.words
    }

    splitTheLineIntoWords() {
        const characters = this.line.split('')
        this._buildWordBasedOnCharacters(characters)
        this.words.push(this.wordValue)
    }

    _buildWordBasedOnCharacters(characters) {
        characters.forEach(character => {
            if (character.trim() == "")
                this._addWordAndCharacterToWordsAndRefresh(character)
            else if (keywords.sentencePointers.includes(character))
                this._addWordAndCharacterToWordsAndRefresh(character)
            else if (keywords.mathematicOperations.includes(character))
                this._addWordAndCharacterToWordsAndRefresh(character)
            else if (keywords.brackets.includes(character))
                this._addWordAndCharacterToWordsAndRefresh(character)
            else if (keywords.arrayBrackets.includes(character))
                this._addWordAndCharacterToWordsAndRefresh(character)
            else if (keywords.quotationMarks.includes(character))
                this._addWordAndCharacterToWordsAndRefresh(character)
            else this.wordValue += character
        });
    }

    _addWordAndCharacterToWordsAndRefresh(character) {
        this.words.push(this.wordValue)
        this._refresh(character)
    }

    _refresh(character) {
        this.words.push(character)
        this.wordValue = ''
    }
}

class LineTracker {
    constructor() {
        this.lines = []
        this.words = new Map();
    }

    splitContentIntoLines(content) {
        const momentarylines = content.split('\n')
        this._buildLinesBasedOnMomentaryLines(momentarylines)
    }

    _buildLinesBasedOnMomentaryLines(momentarylines) {
        momentarylines.forEach((content, index) => {
            const line = this._buildLineWithContent(content, index)
            const _words = line.getTransformedWords()
            this.words.set(index, _words)
            this.lines.push(line)
            let lineElement = this._initLine(index)
            lineElement = this._addWordsAsElementsToLine(_words, lineElement)
            reader.appendChild(lineElement)
        });
    }

    _addWordsAsElementsToLine(words, line) {
        words.forEach(word => {
            const element = this._buildWordElement(word)
            word.updateRedirectToElementInCode(element)
            wordTracker.addWordToWords(word)
            line.appendChild(element)
        });
        return line
    }

    _buildWordElement(word) {
        const wordElement = document.createElement('span')
        wordElement.textContent = word.value
        wordElement.setAttribute('id', word.id)
        wordElement.style = `
            color: ${word.color}; 
            font-size: ${writer.style.fontSize}; 
            line-height:${writer.style.lineHeight};
            `
        return wordElement
    }

    _buildLineWithContent(content, index) {
        const line = new Line(content, index)
        line.splitTheLineIntoWords()
        return line
    }

    _initLine(id) {
        const lineElement = document.createElement('p')
        lineElement.setAttribute('id', id)
        lineElement.setAttribute('name', 'line')
        lineElement.style = `
            color: gray;
            font-size: ${writer.style.fontSize};
            width:fit-content;
            height: fit-content;
            line-height:${writer.style.lineHeight};
        `
        return lineElement
    }
}

const writer = document.getElementById('code-writer')

writer.addEventListener('input', (event) => {
    // scopeTracker.cleanTracker()
    wordTracker.clean()
    reader.innerHTML = ''
    console.log(event)
    const content = event.target.value
    console.log(content)
    const tracker = new LineTracker()
    tracker.splitContentIntoLines(content)
    console.log(wordTracker)
    // console.log(tracker.words)
    new LineNumberTracker()
})


writer.addEventListener('scroll', (event) => {
    main.scrollTop = writer.scrollTop
    main.scrollLeft = writer.scrollLeft
})