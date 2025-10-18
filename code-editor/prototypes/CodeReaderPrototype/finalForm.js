const reader = document.getElementById('code')
const main = document.getElementById('reader-container')
const lineTracker = document.getElementById('lines-tracker')
const writer = document.getElementById('code-writer')

const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch']
}

class LineNumberTracker {
    constructor() {
        this.updateLineTracker()
    }

    getLines() {
        const lines = document.getElementsByTagName('p')
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
        const lineNumber = document.createElement('div')
        lineNumber.textContent = number
        lineNumber.setAttribute('id', `line-${number}`)
        lineNumber.classList.add('line-number')
        return lineNumber
    }

}

class WordBuilder {
    constructor(content, id) {
        this.content = content
        this.id = id
    }

    buildWord() {
        if (keywords.scopeInitingWords.includes(this.content))
            return this._buildSpanElementWithSpecifiedColor("purple")
        else if (keywords.variableInitWords.includes(this.content))
            return this._buildSpanElementWithSpecifiedColor("purple")
        else if (keywords.mathematicOperations.includes(this.content))
            return this._buildSpanElementWithSpecifiedColor("gray")
        else if (keywords.sentencePointers.includes(this.content))
            return this._buildSpanElementWithSpecifiedColor("white")
        else if (this.content.startsWith(`"`) && this.content.endsWith(`"`) || this.content.startsWith(`'`) && this.content.endsWith(`'`))
            return this._buildSpanElementWithSpecifiedColor("green")
        else
            return this._buildSpanElementWithSpecifiedColor("rgb(54, 101, 255)")
    }


    _buildSpanElementWithSpecifiedColor(color) {
        const span = document.createElement('span')
        span.setAttribute('id', this.id)
        span.textContent = this.content
        span.style = `color: ${color}; font-size: 24px;`
        return span
    }
}

class LineDeconstructor {

    constructor(line) {
        this.line = line
        this.characters = line.split('')
        this.words = []
    }

    deconstructWordsBasedOnCharactes() {
        let word = ''
        this.characters.forEach((character) => {
            if (keywords.sentencePointers.includes(character)) {
                word = this._addToWordsAndReset(word, character)
            }
            else if (character === " ") {
                word = this._addToWordsAndReset(word, character)
            }
            else if (character === "(" || character === ")" || character === "{" || character === "}") {
                word = this._addToWordsAndReset(word, character)
            }
            else if (character === '\n') {
                word = this._addToWordsAndReset(word, character)
            }
            else word += character
        })
        if (word.trim() != "")
            this.words.push(word)
        return this.words
    }

    _addToWordsAndReset(word, character) {
        this.words.push(word)
        this.words.push(character)
        return ""
    }
}

class LineBuilder {
    constructor(content) {
        this.content = content
        this.words = []
    }

    buildLineWithId(id) {
        let lineElement = this._initLine(id)
        this._deconstructWordsBasedOnCharactes()
        lineElement = this._insertWordsToLineWithId(lineElement, id)
        return lineElement
    }

    _initLine(id) {
        const lineElement = document.createElement('p')
        lineElement.setAttribute('id', id)
        lineElement.style = `
            font-size: 24px;
            color: gray;
            width:fit-content;
            height: fit-content;
        `
        return lineElement
    }

    _deconstructWordsBasedOnCharactes() {
        const deconstructor = new LineDeconstructor(this.content)
        this.words = deconstructor.deconstructWordsBasedOnCharactes()
    }

    _insertWordsToLineWithId(lineElement, id) {
        if (this.words.length == 0) {
            const wordID = `${id}-0`
            return this._addWordWithIdToLine('\n', wordID, lineElement)
        }
        else {
            return this._buidAllWordsIntoLineWithId(lineElement, id)
        }
    }

    _addWordWithIdToLine(content, id, lineElement) {
        const wordElelemnt = this._buildWordAsElementWithId(content, id)
        lineElement.appendChild(wordElelemnt)
        return lineElement
    }

    _buildWordAsElementWithId(word, id) {
        const builder = new WordBuilder(word, id)
        const wordElement = builder.buildWord()
        return wordElement
    }

    _buidAllWordsIntoLineWithId(lineElement, id) {
        this.words.forEach((word, index) => {
            const wordID = `${id}-${index}`
            this._addWordWithIdToLine(word, wordID, lineElement)
        });
        return lineElement
    }

}

class CodeBuilder {
    constructor(content) {
        this.content = content
        this.code = ""
    }

    buildCode() {
        reader.innerHTML = ''
        const lines = this.content.split('\n');
        lines.forEach((line, id) => {
            this._addLineWithIdToCode(line, id)
        });
        new LineNumberTracker()
    }

    _addLineWithIdToCode(line, id) {
        const builder = new LineBuilder(line)
        const lineElement = builder.buildLineWithId(id)
        reader.appendChild(lineElement)
    }
}


writer.addEventListener('input', (event) => {
    const content = event.target.value
    const codeBuilder = new CodeBuilder(content)
    codeBuilder.buildCode()
})

writer.addEventListener('scroll', (event) => {
    main.scrollTop = writer.scrollTop
    main.scrollLeft = writer.scrollLeft
})