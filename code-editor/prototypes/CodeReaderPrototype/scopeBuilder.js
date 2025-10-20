const reader = document.getElementById('reader-container')
const code = document.getElementById('code')
const lineTracker = document.getElementById('lines-tracker')

const INITIAL_SCOPE_ID = 0;

class LineTracker {
    constructor() {
        this.trackedLines = new Map();
    }

    addLine(line) {
        this.trackedLines.set(line.row, line)
    }

    removeLine(line) {
        this.trackedLines.delete(line.row)
    }

    getLineForRow(row) {
        return this.trackedLines.get(row)
    }
}



const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch']
}

class HintsForRowTracker {
    constructor() {
        this.problems = []
        this.currentHintIndex = 0;
    }

    addHint(hint) {
        const hintAlreadyExists = this._checkIfSpecifiedHintAlreadyExists(hint)
        if (!hintAlreadyExists)
            this._pushSpecifiedHintBasedOnType(hint)
        this.currentHintIndex = this.problems.length - 1
        return this
    }

    _checkIfSpecifiedHintAlreadyExists(hint) {
        let exists = false;
        this.problems.forEach(_hint => {
            if (_hint.message === hint.message)
                exists = true
        });
        return exists
    }

    _pushSpecifiedHintBasedOnType(hint) {
        if (hint.type === new HintTypes().ERROR)
            this.problems.unshift(hint)
        else this.problems.push(hint)
    }

    updateHintAtSpecifiedIndex(index) {
        this.problems.forEach((_hint, _index) => {
            if (_index === index) {
                _hint.switchDisplaySettings()
                this.problems[index] = _hint
            }
        });
        return this
    }

    updateHintMatchingSpecifiedMessage(message) {
        this.problems.forEach((_hint, index) => {
            if (_hint.message === message) {
                _hint.switchDisplaySettings()
                this.problems[index] = _hint
            }
        });
        return this
    }

    updateHintMatchingSpecifiedMessageToSpecificMode(message, mode) {
        this.problems.forEach((_hint, index) => {
            if (_hint.message === message) {
                _hint.changeDisplaySettingsToMode(mode)
                this.problems[index] = _hint
            }
        });
        return this
    }

    getCurrentHint() {
        return this.problems[this.currentHintIndex];
    }

    moveUpTheHints() {
        if (this.currentHintIndex === this.problems.length - 1) {
            this.currentHintIndex = 0;
        }
        else {
            this.currentHintIndex += 1;
        }

    }

    moveDownTheHints() {
        if (this.currentHintIndex === 0) {
            this.currentHintIndex = this.problems.length - 1;
        }
        else {
            this.currentHintIndex -= 1;
        }
    }

    getPositionInformation() {
        return `${this.currentHintIndex + 1} : ${this.problems.length}`
    }
}

class HintTypes {
    ERROR = 'error';
    SUGGESTION = 'suggestion';
}

class HintTracker {
    constructor() {
        this.caughtProblems = new Map()
    }

    addHint(hint) {
        let hintsForId = this.caughtProblems.get(hint.id) === undefined ? new HintsForRowTracker() : this.caughtProblems.get(hint.id)
        hintsForId = hintsForId.addHint(hint)
        this.caughtProblems.set(hint.id, hintsForId)
    }

    removeHintsForLineWithInted(index) {
        const id = `hint-${index + 1}`;
        if (this.caughtProblems.get(id) !== undefined)
            this.caughtProblems.set(id, new HintsForRowTracker())
    }

    switchDisplaySettingsForHintAtIndex(hint, index) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintAtSpecifiedIndex(index)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    switchDisplaySettingsForHintWithMessage(hint, message) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintMatchingSpecifiedMessage(message)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    switchDisplaySettingsForHintWithMessageToSpecificMode(hint, message, mode) {
        let hintsForRow = this.caughtProblems.get(hint.id)
        hintsForRow = hintsForRow.updateHintMatchingSpecifiedMessageToSpecificMode(message, mode)
        console.log(hintsForRow)
        this.caughtProblems.set(hint.id, hintsForRow)
    }

    clean() {
        this.caughtProblems = new Map()
    }
}

class Hint {
    constructor(message, type, row, id) {
        this.message = message
        this.type = type
        this.row = row
        this.id = id
        this.isToBeDisplayed = true;
    }

    switchDisplaySettings() {
        if (this.type !== new HintTypes().ERROR)
            this.isToBeDisplayed = !this.isToBeDisplayed
    }

    changeDisplaySettingsToMode(mode) {
        if (this.type !== new HintTypes().ERROR)
            this.isToBeDisplayed = mode
    }
}

class ScopeType {
    FILE = "file";
    CLASS = "class";
    FUNCTION = "function";
    CONSTRUCTOR = "constructor";
    BLOCK = "block";
}

class Scope {
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.parent = null
        this.chilren = []
        this.lines = []
        this.isCloded = false;
    }

    setParent(newParent) {
        this.parent = newParent
    }

    addNewContent(content) {
        this.lines.push(content)
    }

    closeScope() {
        this.isCloded = true;
    }

    addChild(scope) {
        this.chilren.push(scope)
    }
}

class ScopeTracker {
    constructor() {
        this.currentScope = new Scope(new ScopeType().FILE, INITIAL_SCOPE_ID)
        this.previousScope = this.currentScope
        this.scopes = new Map()
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    determineScopeAndInsertLine(line) {
        const scope = this._determineScopeBasedOnLine(line);
        // Can wrongfully catch an error, yet to understand why?
        if ((this._checkIfWordsOnLineIncludeSpecifiedText(line, "else") ||
            this._checkIfWordsOnLineIncludeSpecifiedText(line, 'else if')) &&
            scope.type === this.previousScope.type &&
            this.currentScope !== scope.type) {
            this._raiseErrorIfCodeBetweenBlocksExists(line)
        }
        if (scope != this.currentScope)
            this._changeToNewScope(scope)
        line.transformWordsOnLineToWordObjectsWithScope(this.currentScope)
        this._insertLineIntoScopeAndCloseScopeWhenNeeded(line)
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
        if (line.row - latLineInPreviousScope.row > 1) {
            return this._checkLinesBetweenBlocks(latLineInPreviousScope.row + 1, line.row)
        }
        return false
    }

    _checkLinesBetweenBlocks(firstLine, lastLine) {
        let codeExistsBetweenBlocks = false
        while (firstLine < lastLine) {
            const row = linesTracker.getLineForRow(firstLine)
            if (row.value.trim() != "")
                codeExistsBetweenBlocks = true
            firstLine++
        }
        return codeExistsBetweenBlocks
    }

    _changeToNewScope(scope) {
        this.currentScope.addChild(scope)
        this.currentScope = scope
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    _determineScopeBasedOnLine(line) {
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

    _lineIsStartingFunctionScope(line) {
        if (this._checkIfWordsOnLineIncludeSpecifiedText(line, 'function'))
            return true
        else if (this._checkIfContentIsStatemet(line) === false &&
            (this._checkIfLineEndsWithSpeicifiedText(line, "){") ||
                this._checkIfLineEndsWithSpeicifiedText(line, ") {")
            ))
            return true
        else if (this.currentScope.type == new ScopeType().CLASS &&
            this._checkIfLineEndsWithSpeicifiedText(line, ")") &&
            !this._checkIfContentIsStatemet(line) &&
            !this._checkIfWordsOnLineIncludeSpecifiedText(line, "="))
            return true
        return false
    }

    _checkIfWordsOnLineIncludeSpecifiedText(line, text) {
        return line.words.includes(text)
    }

    _checkIfLineEndsWithSpeicifiedText(line, text) {
        return line.value.trim().endsWith(text)
    }

    _checkIfContentIsStatemet(line) {
        return this._checkIfWordsOnLineIncludeSpecifiedText(line, 'if') ||
            this._checkIfWordsOnLineIncludeSpecifiedText(line, 'else')
    }

    _buildNewScope(type) {
        const scope = new Scope(type, this.scopes.size);
        scope.setParent(this.currentScope)
        return scope
    }

    _insertLineIntoScopeAndCloseScopeWhenNeeded(line) {
        this.currentScope.addNewContent(line)
        this._toggleSuggestionForCurlyBracketsIfLineIsStatement(line)
        if (this._checkIfLineEndsWithSpeicifiedText(line, '}')) {
            this._closeCurrentScope()
        }
        else if (this.currentScope.type == new ScopeType().BLOCK)
            this._handleBlocksWithoutCurlyBrackets()
        this.scopes.set(this.currentScope.id, this.currentScope)
    }

    _toggleSuggestionForCurlyBracketsIfLineIsStatement(line) {
        const isStatement = this._checkIfContentIsStatemet(line)
        const hints = hintsTracker.caughtProblems.get(`hint-${line.row}`)
        if (hints && isStatement && hints.problems[0]) {
            const message = `Suggestion: Add curly brackets, otherwise content will not be counted as part of the block.`
            hintsTracker.switchDisplaySettingsForHintWithMessageToSpecificMode(hints.problems[0], message, false)
        }
        else if (hints && hints.problems[0]) {
            const message = `Suggestion: Add curly brackets, otherwise content will not be counted as part of the block.`
            hintsTracker.switchDisplaySettingsForHintWithMessageToSpecificMode(hints.problems[0], message, true)
        }
    }

    _handleBlocksWithoutCurlyBrackets() {
        let containsCurlyBracket = false
        this.currentScope.lines.forEach((line, index) => {
            if (line.value.trim().includes("{")) containsCurlyBracket = true
            else if (index > 1 && line.value.trim() !== "" && !containsCurlyBracket) this._suggestBracketsWhileClosingScopeForLine(line)
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
            line.row,
            `hint-${line.row}`)
        hintsTracker.addHint(hint)
    }

    _buildHintErrorForLineWithMessage(line, message) {
        const hint = new Hint(
            message,
            new HintTypes().ERROR,
            line.row,
            `hint-${line.row}`)
        hintsTracker.addHint(hint)
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

    cleanTracker() {
        this.currentScope = new Scope(new ScopeType().FILE, INITIAL_SCOPE_ID)
        this.scopes = new Map()
        this.scopes.set(this.currentScope.id, this.currentScope)
    }
}

class Word {
    constructor(value, scope) {
        this.value = value;
        this.scope = scope;
        // this.link = link;
    }

    reassignLink(newLink) {
        this.link = newLink;
    }
}

class CodeLine {
    constructor(id, value) {
        this.id = id
        this.value = value
        this.row = this.calculateRow()
        this.words = []
        this.wordsAsObjects = []
        this.buildWordsBasedOnCharacters(this.value.split(''), this.words)
    }

    calculateRow() {
        return this.id + 1
    }

    buildWordsBasedOnCharacters(characters, words) {
        let word = ''
        characters.forEach((character) => {
            // Needs Reworking for STRING value -> "" breaks if there is some sort of space inside, also there should be change in FinalForm for it as well.
            if (keywords.sentencePointers.includes(character)) {
                word = this.addToWordsAndReset(word, character)
            }
            else if (character === " ") {
                words.push(word)
                word = ""
            }
            else if (character === "(" || character === ")" || character === "{" || character === "}") {
                word = this.addToWordsAndReset(word, character)
            }
            else if (character === '\n') {
                word = this.addToWordsAndReset(word, character)
            }
            else word += character
        })
        if (word.trim() != "")
            words.push(word)
    }

    transformWordsOnLineToWordObjectsWithScope(scope) {
        this.words.forEach((value) => {
            console.log(value)
            const word = new Word(value, scope)
            this.wordsAsObjects.push(word)
            // there should be some sort of check to see what the word is: variable, function, keyword, class, Object, etc.
            // the type should be added to the word.
            // IT is also here where the word should be checked if it is trying to change the value of a const variable.
        })
    }

    addToWordsAndReset(word, character) {
        this.words.push(word)
        this.words.push(character)
        return ""
    }
}


class Code {
    constructor() {
        this.lineTracker = new LineTracker()
        this.scopeTracker = new ScopeTracker()
    }
}

// const codeTracker = new Code()
const scopeTracker = new ScopeTracker()
const linesTracker = new LineTracker()

const hintsTracker = new HintTracker()
const content = `
const age = 21;
const name = "Aleks";

if (age == 21) { console.log("OF AGE")}
else { conosle.log("NOT OF AGE") }

class Person {

    constructor(age, name){
        this.age = age;
        this.name = name;
    }

    getAge()
    {
        return this.age;
    }

    getName() {
        if (this.name === "Aleks") 
        {
            return this.name;
        }
        else { return "Not important" }
    }
}

if (something)


    console.log("Meow")


else (anything)


    console.log("Peow")



const person = new Person(age, name);
console.log(person.getAge());

const user = {
    name: person.getName()
    age: person.getAge();
}

function addTwoNumbers(a, b)


{

}

if (something) {
    pesho
}
`;

const writer = document.getElementById('code-writer')

const lines = content.split('\n')
function checkLines(lines) {
    lines.forEach((line, index) => {
        if (line.trim() === "")
            hintsTracker.removeHintsForLineWithInted(index)

        checkLine(line, index)
    })

}

function checkLine(value, index) {
    const line = new CodeLine(index, value)
    linesTracker.addLine(line)
    scopeTracker.determineScopeAndInsertLine(line)
}

function checkForHints() {
    const amountOfHints = hintsTracker.caughtProblems.length
    if (amountOfHints != 0) {
        goThroughEachHint()
    }

}

function goThroughEachHint() {
    const hints = hintsTracker.caughtProblems
    hints.forEach(hintsForRow => {
        displayHintsForRow(hintsForRow)
    });
}

function displayHintsForRow(hintsForRow) {
    let hintsView = null
    if (hintsForRow.problems.length > 1) {
        hintsView = displayMultipleHints(hintsForRow)
    }
    else {
        hintsView = displayHint(hintsForRow.problems[0], 0)
    }
    if (hintsView) code.appendChild(hintsView)
}

function displayMultipleHints(hintsForRow) {
    const hint = hintsForRow.problems[hintsForRow.problems.length - 1]
    let line = document.getElementById(`${hint.row - 1}`)
    const color = hint.type === new HintTypes().ERROR ? "lightcoral" : "lightyellow"
    const hintsView = document.createElement('div')
    hintsView.style = `
        display: flex;
        width: fit-content;
        height: fit-content;
        position: absolute;
        font-size: 18px;
        z-index: 999;
        top: ${line.offsetTop - 24}px;
        left: ${line.offsetLeft}px;
        background-color: rgb(42, 42, 42);
        border: ${color} 1px solid;
    `
    const lastHint = hintsForRow.problems.length - 1
    const startingHint = displayHint(hintsForRow.problems[lastHint], lastHint)
    const switcher = buildHintsSwitcher(hintsForRow)
    hintsView.appendChild(startingHint)
    hintsView.appendChild(switcher)
    return hintsView
}

function buildHintsSwitcher(hintsForRow) {
    const switcher = document.createElement('div')
    switcher.style = `display:flex; width: fit-content; margin-right: 5px;`
    const switchButtons = buildSwitchButtons(hintsForRow)
    const info = document.createElement('span')
    info.style = `margin-left: 15px;`
    info.setAttribute('id', 'hint-info')
    info.textContent = hintsForRow.getPositionInformation()
    switcher.appendChild(switchButtons)
    switcher.appendChild(info)
    return switcher
}

function buildSwitchButtons(hintsForRow) {
    const switchButtons = document.createElement('div')
    switchButtons.style = `
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 25px;
    `
    const buttonToGoUpOnce = buildButtonForHintsWithTextOnButton(hintsForRow, '+')
    const buttonToGoDownOnce = buildButtonForHintsWithTextOnButton(hintsForRow, '-')
    switchButtons.appendChild(buttonToGoUpOnce)
    switchButtons.appendChild(buttonToGoDownOnce)
    return switchButtons
}

function buildButtonForHintsWithTextOnButton(hintsForRow, text) {
    let button = document.createElement('button')
    button.style = `
        width: 18px;
        heifht: 18px;
        font-size 16px;
        margin-left: 5px;
        color:white;
        border: solid gray 1px;
        background: transparent;
    `
    button.textContent = text
    button = handleButtonHover(button)
    button = changeHintIndex(button, hintsForRow)
    return button
}

function handleButtonHover(button) {
    button.addEventListener('mouseenter', () => {
        button.style.borderColor = `blue`;
    })

    button.addEventListener('mouseleave', () => {
        button.style.borderColor = `gray`;
    })
    return button
}

function changeHintIndex(button, hintsForRow) {
    const text = button.textContent
    button.addEventListener('click', () => {
        if (text == '+') hintsForRow.moveUpTheHints()
        else hintsForRow.moveDownTheHints()
        updateTextForHintMessage(hintsForRow)
    })
    return button
}

function updateTextForHintMessage(hintsForRow) {
    const hintMessage = document.getElementById(`${hintsForRow.problems[0].id}-message`)
    const info = document.getElementById('hint-info')
    const newHint = hintsForRow.getCurrentHint()
    hintMessage.textContent = newHint.message
    info.textContent = hintsForRow.getPositionInformation()
}

function displayHint(hint, index) {
    if (hint && hint.isToBeDisplayed) {
        let line = document.getElementById(`${hint.row - 1}`)
        if (line) {
            line = applyStyleToLine(hint, line)
            return buildHintMessage(hint, line, index)
        }
        return null
    }
    return null
}

function applyStyleToLine(hint, line) {
    const color = hint.type === new HintTypes().ERROR ? "lightcoral" : "lightyellow"
    line.style.background = `${color}`
    return line
}

function buildHintMessage(hint, line, index) {
    const message = document.createElement('p')
    message.textContent = hint.message
    message.setAttribute('id', `${hint.id}-message`)
    const color = hint.type === new HintTypes().ERROR ? "lightcoral" : "lightyellow"
    if (hintsTracker.caughtProblems.get(hint.id).problems.length == 1)
        message.style = `
            width: fit-content;
            height: fit-content;
            position: absolute;
            font-size: 18px;
            z-index: 999;
            top: ${line.offsetTop - 24}px;
            left: ${line.offsetLeft}px;
            background-color: rgb(42, 42, 42);
            border: ${color} 1px solid;
        `
    message.addEventListener('click', () => {
        hintsTracker.switchDisplaySettingsForHintAtIndex(hint, index)
        if (hint.type === new HintTypes().SUGGESTION) {
            line.style.background = `transparent`
            message.remove()
        }
    })
    return message
}

// writer.addEventListener('input', (event) => {
//     scopeTracker.cleanTracker()
//     const content = event.target.value
//     const lines = content.split('\n');
//     checkLines(lines)
//     checkForHints()
//     console.log(scopeTracker)
// })

// checkLines(lines)
// console.log(scopeTracker)
