import sheet from './file-reader.css' with {type: 'css'}
import LoadStylesFromCSS from "../../loadStylesFromCSS.js";
import ReaderAPIHandler from '../../API_Calls/reader_calls.js';
import { CustomSearch } from './search.js';
const loader = new LoadStylesFromCSS(sheet.rules)
const readerHandler = new ReaderAPIHandler()
const classes = loader.getClasses()

const SPACES_FOR_TAB = 4

export default class CustomFileReader extends HTMLElement {
    constructor(fileName) {
        super();
        this.name = fileName
        this.currentLineText = ""
        this.rows = 0
        const reader = this.buildMainContainer()
        this.reader = reader
        this.appendChild(reader)
        this.mapOfVariables = new Map()
    }

    buildMainContainer() {
        const reader = document.createElement('div')
        reader.style = `${classes.reader}`
        reader.setAttribute('id', 'reader')
        const contentReader = this.buildContent()
        reader.appendChild(contentReader)
        return reader
    }

    buildContent() {
        const content = this.buildContentContainer()
        const response = readerHandler.openFile(this.name)
        response.then(async (data) => {
            await this.loadContent(data, content)
        })
        return content
    }

    async loadContent(data, reader) {
        const body = await data.json()
        this.rows = body.content.length
        body.content.forEach((lineOfCode, index) => {
            const code = this.buildLineOfCode(lineOfCode, index)
            reader.appendChild(code)
        });
    }

    buildContentContainer() {
        let container = document.getElementById('code-reader')
        if (container) {
            container.remove()
        }
        container = document.createElement('ul')
        container.style = `${classes.reader}`
        container.setAttribute('id', 'code-reader')

        return container
    }

    buildLineOfCode(content, index) {
        const lineOfCode = document.createElement('li')
        lineOfCode.style = `${classes['line-of-code']}`
        lineOfCode.setAttribute('id', `line-${index}`)
        const codeContent = this.buildCodeContent(content, index)
        const lineNumber = this.buildLineNumber(index + 1)
        lineOfCode.appendChild(lineNumber)
        lineOfCode.appendChild(codeContent)
        return lineOfCode
    }

    buildLineNumber(index) {
        const lineNumber = document.createElement('p')
        lineNumber.style = `${classes["line-number"]}`
        lineNumber.textContent = `${index}`
        return lineNumber
    }

    createNewWord(word, content) {
        const parentElement = word.parentElement
        const nextElement = word.nextSibling
        const newWord = this.buildWord(content, parentElement, parentElement.childNodes.length)
        parentElement.insertBefore(newWord, nextElement)
        newWord.focus()
        this.selectWord(newWord, newWord.textContent.length)
    }

    cleanSpace(event) {
        event.preventDefault()
        const target = document.getElementById(event.target.id)
        const sibling = target.previousSibling
        sibling.focus()
        this.selectWord(sibling, sibling.textContent.length)
        event.target.remove()
    }

    buildWord(content, code, index) {
        const word = document.createElement('span')
        word.setAttribute('contenteditable', true)
        word.setAttribute('id', `${code.id}-${index}`)
        word.textContent = content
        word.style = `${classes.word}`
        word.addEventListener('click', (event) => {
            event.stopPropagation()
            if (event.ctrlKey) {
                this.handleRedirectionToAction(event)
            }
        })

        if (this.mapOfVariables.get(content) == undefined)
            this.mapOfVariables.set(content, { id: word.id })
        return word
    }

    selectWord(element, index) {
        console.log(element)
        const target = element.firstChild !== null ? element.firstChild : element
        const range = document.createRange()
        range.setStart(target, index)
        range.setEnd(target, index)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }

    handleRedirectionToAction(event) {
        const targetWord = event.target.textContent
        console.log(targetWord)
        const wordFromMapOfVariables = this.mapOfVariables.get(targetWord)
        if (wordFromMapOfVariables !== undefined) {
            const element = document.getElementById(wordFromMapOfVariables.id)
            element.scrollIntoView()
            this.selectWord(element, 0)
        }
    }

    addWordsToLine(words, code) {
        const elements = []
        words.forEach((word, index) => {
            const wordElement = this.buildWord(word, code, index)
            elements.push(wordElement)
        });
        return elements
    }

    buildWords(words, lineOfCode) {
        const elements = this.addWordsToLine(words, lineOfCode)
        elements.forEach(element => {
            lineOfCode.appendChild(element)
        })
    }

    createAListOfWordsAsElementsInTheRow(lineContent) {
        const content = String(lineContent)
        const characters = content.split('')
        let word = ""
        const words = []
        characters.forEach((character) => {
            if (character === " " || character === "." || character === '.') {
                words.push(word)
                word = ""
                words.push(character)
            }
            else word += character

        })
        words.push(word)
        return words
    }

    createNewContent(event, index) {
        const target = document.getElementById(event.target.id)
        const content = target.textContent
        const newContent = this.buildCodeContent(content, index)
        const lineId = `line-${index}`
        const line = document.getElementById(lineId)
        console.log(line)
        line.replaceChild(newContent, line.lastChild)
        this.selectWord(newContent.lastChild, newContent.lastChild.textContent.length)
    }

    buildCodeContent(content, index) {
        const lineOfCode = document.createElement('pre')
        lineOfCode.setAttribute('contenteditable', true)
        lineOfCode.style = `${classes.code}`
        lineOfCode.previousSibling
        const filtered = this.filterCodeContent(content)
        const words = this.createAListOfWordsAsElementsInTheRow(filtered)
        this.buildWords(words, lineOfCode)
        lineOfCode.addEventListener('mouseenter', () => {
            lineOfCode.style.cursor = 'text'
        })
        lineOfCode.addEventListener('mouseleave', () => {
            lineOfCode.style.cursor = 'default'
        })
        lineOfCode.setAttribute('id', index)
        lineOfCode.onfocus = () => {
            lineOfCode.style = `${classes.code} outline: none;`
        }
        // lineOfCode.addEventListener('click', (event) => {
        //     const lastChild = event.target.lastChild
        //     this.selectWord(lastChild, lastChild.textContent.length)
        // })

        lineOfCode.addEventListener('keydown', (event) => {
            console.log("EVENT TRIGGERED")
            const targetId = event.currentTarget.id
            if (event.ctrlKey && event.key === "f") {
                event.preventDefault()
                event.stopPropagation()
                this.buildSearchBar()
            }
            else if (event.ctrlKey && event.key === "s") {
                event.preventDefault()
                let searchBar = document.getElementById('custom-search')
                if (searchBar) {
                    searchBar.removeHighlights()
                    this.readLines()
                    searchBar.search()
                }
                else this.readLines()
            }
            else if (event.key.includes('Arrow')) this.handleArrowsMovement(event, targetId)
            else if (event.key === "Enter") this.handleCreatingNewLine(event, targetId)
            else if (event.key === "Backspace") this.handleRemovingEmtpyLine(event, targetId)
            else if (event.key === "Tab") this.handleTabAction(targetId, event)
        })
        lineOfCode.addEventListener('input', (event) => {
            this.createNewContent(event, index)
        })

        return lineOfCode
    }


    readLines() {
        const content = document.getElementById('code-reader')
        const lines = content.childNodes
        const contentToSave = []
        lines.forEach((line) => {
            const code = line.lastChild
            const content = `${code.textContent}\n`
            contentToSave.push(content)
        })
        readerHandler.saveFileContent(this.name, { content: contentToSave })
    }


    buildSearchBar() {
        let searchBar = document.getElementById('custom-search')
        if (searchBar) {
            searchBar.removeHighlights()
            searchBar.remove()
        }

        else {
            searchBar = new CustomSearch()
            searchBar.style = `${classes.search}`
            searchBar.setAttribute('id', 'custom-search')
            document.getElementById('body').appendChild(searchBar)
        }

    }

    filterCodeContent(content) {
        let newConent = content
        const spaces = this.buildSpacesForTab()
        if (String(newConent).includes(`\n`)) newConent = String(newConent).replace(`\n`, "")
        if (String(newConent).includes(`\t`)) newConent = String(newConent).replace(`\t`, spaces)
        return newConent
    }

    handleTabAction(targetId, event) {
        event.preventDefault()
        // Should get the current position
        const index = this.getPositonFromLine()
        if (index === -1) return null
        else {
            const line = document.getElementById(`line-${targetId}`)
            this.updateContentWhenTabTriggered(index, line)
        }
    }

    updateContentWhenTabTriggered(index, line) {
        let content = line.lastChild.textContent
        const substracted = content.substring(index, content.length)
        content = content.replace(substracted, "")
        const spaces = this.buildSpacesForTab()
        const newContent = `${content}${spaces}${substracted}`
        line.lastChild.textContent = newContent
    }

    buildSpacesForTab() {
        let spaces = ""
        for (let index = 0; index < SPACES_FOR_TAB; index++) {
            spaces = `${spaces} `
        }
        return spaces
    }

    handleRemovingEmtpyLine(event, targetId) {
        const line = document.getElementById(`line-${targetId}`)
        const isNotLastLine = Number(targetId) > 0
        if (isNotLastLine) {
            const idOfElementToFocus = Number(targetId) - 1
            const element = document.getElementById(idOfElementToFocus)
            const target = element.textContent.length
            if (event.target.textContent === "") {
                event.preventDefault()
                this.moveElement(idOfElementToFocus, target)
                line.remove()
                this.updateLinesAfterLineRemoved(targetId)
            }
            else if (this.getPositonFromLine() === 0) {
                event.preventDefault()
                this.updateContentForLineBeforeCurrent(line, targetId)
                this.moveElement(idOfElementToFocus, target)
                line.remove()
                this.updateLinesAfterLineRemoved(targetId)
            }
        }
        this.rows = document.getElementById('code-reader').childNodes.length
    }

    updateContentForLineBeforeCurrent(line, targetId) {
        // Get the content of the line
        const content = line.lastChild.textContent
        // Get the element before current
        const lineBeforeCurrent = document.getElementById(`line-${Number(targetId) - 1}`)
        // Get the content of the element before current
        let lineBeforeCurrentContent = lineBeforeCurrent.lastChild.textContent
        // Update the content of the element before current
        lineBeforeCurrentContent = `${lineBeforeCurrentContent}${content}`
        lineBeforeCurrent.lastChild.textContent = lineBeforeCurrentContent
    }

    updateLinesAfterLineRemoved(targetId) {
        const reader = document.getElementById('code-reader')
        const lines = reader.childNodes
        lines.forEach((line) => {
            this.updateLine(line, targetId)
        })
    }

    updateLine(line, targetId) {
        const lineId = line.id.replace('line-', "")
        if (Number(lineId) > Number(targetId)) {
            const newId = Number(lineId) - 1
            line.setAttribute('id', `line-${newId}`)
            line.lastChild.setAttribute('id', String(newId))
            line.firstChild.textContent = String(lineId)
        }
    }


    getPositonFromLine() {
        const selection = window.getSelection();
        let index = -1
        const caretExists = selection.rangeCount > 0
        if (caretExists) {
            // Selection object can contain 0 or more Range objects (ranges) // dd:mm:yyyy -> 03.09.2025 only firefox allows more than one.
            // By using selection.gerRangeAt(0) - we specify we want the very first range -> for all broswers except firefox the only range object.
            const range = selection.getRangeAt(0);
            // range.startOffset for starting point
            // range.endOffset for endinng point of selected text
            const position = range.startOffset;
            index = position
        }
        return index
    }

    getContentForNewLine(line) {
        const index = this.getPositonFromLine()
        // Get the content of the current line.
        const content = line.lastChild.textContent
        if (index == -1) return "" // if there is no selected text or caret -> return "" -> just create empty line
        else {
            const substractedContent = String(content).substring(index, content.length) // Get the text from the caret to the end of the line
            line.lastChild.textContent = String(content).replace(substractedContent, "") // update the current line, so that it doesn't have the substracted text
            return substractedContent // Return the substracted text, so it is added to the new line.
        }
    }

    handleCreatingNewLine(event, targetId) {

        event.preventDefault()
        const reader = document.getElementById('code-reader')
        const lines = reader.childNodes
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const lineId = line.id.replace('line-', "")
            if (lineId === targetId) {
                const nextInLine = line.nextSibling
                const content = this.getContentForNewLine(line)
                const newLine = this.buildLineOfCode(content, Number(targetId) + 1)
                reader.insertBefore(newLine, nextInLine)
                index += 1
                this.moveElement(newLine.lastChild.id, 0)
            }
            else if (Number(lineId) > Number(targetId)) {
                this.updateLineAfterNewLineWasAdded(line, lineId)
            }
        }
        this.rows = reader.childNodes.length
    }

    updateLineAfterNewLineWasAdded(line, lineId) {
        const newId = Number(lineId) + 1
        const newLineNumber = newId + 1
        line.setAttribute('id', `line-${newId}`)
        line.lastChild.setAttribute('id', String(newId))
        line.firstChild.textContent = String(newLineNumber)
    }

    handleArrowsMovement(event, targetId) {
        if (event.key === "ArrowDown") this.goOnALowerRow(event, targetId)
        else if (event.key === "ArrowUp") this.goOnAnUpperRow(event, targetId)
        else if (event.key === "ArrowLeft") this.handleLeftArrow(event, targetId)
        else if (event.key === "ArrowRight") this.handleRightArrow(event, targetId)
    }

    handleLeftArrow(event, targetId) {
        // if at the beggining of the row go up
        const isAllowed = this.checkIfCanMoveUpper(targetId)
        const index = this.getPositonFromLine()
        if (isAllowed) {
            if (index === 0) {
                event.preventDefault()
                const idOfElementToFocus = String(Number(targetId) - 1)
                const element = document.getElementById(idOfElementToFocus)
                const target = element.textContent.length
                this.moveElement(idOfElementToFocus, target)
            }
        }
    }

    handleRightArrow(event, targetId) {
        // if at the end of the row go down
        const isAllowed = this.checkIfCanMoveLower(targetId)
        if (isAllowed) {
            const index = this.getPositonFromLine()
            const target = event.target.textContent.length
            if (index === target) {
                event.preventDefault()
                const idOfElementToFocus = String(Number(targetId) + 1)
                this.moveElement(idOfElementToFocus, 0)
            }
        }
    }

    goOnALowerRow(event, targetId) {
        const isAllowedToMove = this.checkIfCanMoveLower(targetId)
        const index = this.getPositonFromLine()

        if (isAllowedToMove) {
            event.preventDefault()
            const idOfElementToFocus = String(Number(targetId) + 1)
            const positionToLand = this.getPositionToLand(index, idOfElementToFocus)
            this.moveElement(idOfElementToFocus, positionToLand)
        }
    }

    getPositionToLand(index, idOfElementToFocus) {
        const element = document.getElementById(idOfElementToFocus)
        const length = element.textContent.length

        if (index > length) {
            return length
        }
        return index
    }

    goOnAnUpperRow(event, targetId) {
        const isAllowedToMoveUpper = this.checkIfCanMoveUpper(targetId)
        if (isAllowedToMoveUpper) {
            event.preventDefault()
            const index = this.getPositonFromLine()
            console.log(index)
            const idOfElementToFocus = String(Number(targetId) - 1)
            const positionToLand = this.getPositionToLand(index, idOfElementToFocus)
            this.moveElement(idOfElementToFocus, positionToLand)
        }
    }

    checkIfCanMoveLower(targetId) {
        if (Number(targetId) >= 0 && Number(targetId) < this.rows - 1)
            return true
        else return false
    }

    checkIfCanMoveUpper(targetId) {
        if (Number(targetId) <= this.rows - 1 && Number(targetId) > 0)
            return true
        else return false
    }

    moveElement(idOfElementToFocus, index) {
        const range = document.createRange()
        const elementToFocus = document.getElementById(idOfElementToFocus)
        elementToFocus.focus()
        if (elementToFocus.textContent !== '') {
            range.setStart(elementToFocus.firstChild, index)
            range.setEnd(elementToFocus.firstChild, index)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }
}

customElements.define('custom-files-reader', CustomFileReader);
