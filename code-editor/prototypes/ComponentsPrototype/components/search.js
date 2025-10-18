import sheet from './search.css' with {type: 'css'}
import LoadStylesFromCSS from "../../loadStylesFromCSS.js";

const loader = new LoadStylesFromCSS(sheet.rules)
const classes = loader.getClasses()

const NODE_TYPE_SPAN = 1 // it is from JavaScrtip and DOM

export class CustomSearch extends HTMLElement {
    constructor() {
        super();
        this.currentFoundElement = 0
        this.contentToSearchFor = ""
        this.contentToReplaceWith = ""
        const search = this.buildMainContainer()
        this.appendChild(search)
        this.foundPositionsForContent = new Map()
    }

    buildMainContainer() {
        const searchBar = document.createElement('div')
        searchBar.setAttribute('id', 'code-search')
        searchBar.style = `${classes['search-bar']}`
        const leftWall = this.buildLeftWall()
        const actions = this.buildActionsContainer()
        searchBar.appendChild(leftWall)
        searchBar.appendChild(actions)
        return searchBar
    }

    buildActionsContainer() {
        const actions = document.createElement('div')
        actions.style = `${classes['actions']}`
        const searchContainer = this.buildSearchContainer()
        const replaceWithContainer = this.buildReplaceWithContainer()
        actions.appendChild(searchContainer)
        actions.appendChild(replaceWithContainer)
        return actions
    }

    buildSearchContainer() {
        const container = document.createElement('div')
        const search = this.builldSearchInput()
        const flipContainer = this.buildFlipActionsContainer()
        container.style = `${classes['action']}`
        container.appendChild(search)
        container.appendChild(flipContainer)
        return container
    }

    buildReplaceWithContainer() {
        const container = document.createElement('div')
        const replace = this.buildReplaceInput()
        const actionsContainer = this.buildReplaceActionsContainer()
        container.style = `${classes['action']}`
        container.appendChild(replace)
        container.appendChild(actionsContainer)
        return container
    }

    buildReplaceActionsContainer() {
        const container = document.createElement('div')
        container.style = `${classes['actions-flip']}`
        const replaceOneElement = this.buildReplaceOneElementButton()
        const replaceAllElements = this.buildReplaceAllElementsButton()
        container.appendChild(replaceOneElement)
        container.appendChild(replaceAllElements)
        return container
    }

    buildReplaceOneElementButton() {
        const button = document.createElement('button')
        button.style = `${classes['button-icon']}`
        const icon = this.buildIconForAction('replace-one')
        button.addEventListener('click', () => {
            if (this.contentToSearchFor != "") {
                if (this.foundPositionsForContent.size === 0 || this.contentToReplaceWith === "") {
                    alert("No content to replace/replace with.")
                }
                else {
                    const foundPosition = this.foundPositionsForContent.get(0)
                    this.replaceContentForElementInFoundPositions(foundPosition)
                }
            }
            else {
                alert("No content to search for.")
            }
        })
        button.addEventListener('mouseenter', () => {
            button.style = `${classes['button-icon']} opacity:0.5;`
        })

        button.addEventListener('mouseleave', () => {
            button.style = `${classes['button-icon']}`
        })
        button.appendChild(icon)
        return button
    }

    replaceContentForElementInFoundPositions(foundPosition) {
        const span = foundPosition.node
        this.replaceHighlightWith(span, this.contentToReplaceWith)
        this.search()
    }


    buildReplaceAllElementsButton() {
        const button = document.createElement('button')
        button.style = `${classes['button-icon']}`
        const icon = this.buildIconForAction('replace-multiple')
        button.addEventListener('click', () => {
            if (this.contentToSearchFor != "") {
                if (this.foundPositionsForContent.size === 0 || this.contentToReplaceWith === "") {
                    alert("No content to replace/replace with.")
                }
                else {
                    this.foundPositionsForContent.forEach((found) => {
                        this.replaceContentForElementInFoundPositions(found)
                    })
                }
            }
            else {
                alert("No content to search for.")
            }
        })
        button.addEventListener('mouseenter', () => {
            button.style = `${classes['button-icon']} opacity:0.5;`
        })

        button.addEventListener('mouseleave', () => {
            button.style = `${classes['button-icon']}`
        })
        button.appendChild(icon)
        return button
    }

    buildIconForAction(name) {
        // Simplified for now with an if check - > to be more dynamic later
        let src = './icons/replace_one_element.png';
        let alt = 'Replace one';
        if (name === 'replace-multiple') {
            src = './icons/replace_multiple.png'
            alt = 'Replace multiple'
        }
        const icon = document.createElement('img')
        icon.src = src
        icon.alt = alt
        icon.style = `${classes.icon}`
        return icon
    }


    buildFlipActionsContainer() {
        const actions = document.createElement('div')
        actions.style = `${classes['actions-flip']}`
        const information = document.createElement('p')
        information.setAttribute('id', 'information')
        information.textContent = '0 of 0'
        information.style = `${classes['information']}`
        actions.appendChild(information)
        const flipBetweenFoundElementsActions = this.buildFlipBetweenFoundElementsActions()
        actions.appendChild(flipBetweenFoundElementsActions)
        return actions
    }

    updateInformation(position) {
        const information = document.getElementById('information')
        information.textContent = `${position} of ${this.foundPositionsForContent.size}`
    }

    buildFlipBetweenFoundElementsActions() {
        const actions = document.createElement('div')
        actions.style = `${classes['actions-flip']}`
        const nextFoundElement = this.buildButtonForNextFoundElement()
        const previousFoundElement = this.buildButtonForPreviousFoundElement()
        actions.appendChild(previousFoundElement)
        actions.appendChild(nextFoundElement)
        return actions
    }

    buildButtonForNextFoundElement() {
        const button = document.createElement('button')
        button.style = `${classes.button}`
        button.textContent = '>'
        button.addEventListener('click', () => {
            if (this.foundPositionsForContent.size == 0) this.currentFoundElement = 0
            else if (this.currentFoundElement == this.foundPositionsForContent.size - 1) this.currentFoundElement = 0
            else this.currentFoundElement += 1

            if (this.foundPositionsForContent.size > 0) this.getFoundPositionForContent(this.currentFoundElement)
            this.updateInformation(this.currentFoundElement + 1)
        })
        button.addEventListener('mouseenter', () => {
            button.style = `${classes.button} opacity:0.5;`
        })

        button.addEventListener('mouseleave', () => {
            button.style = `${classes.button}`
        })
        return button
    }

    buildButtonForPreviousFoundElement() {
        const button = document.createElement('button')
        button.style = `${classes.button}`
        button.textContent = '<'
        button.addEventListener('click', () => {
            if (this.currentFoundElement == 0 && this.foundPositionsForContent.size == 0) this.currentFoundElement = 0
            else if (this.currentFoundElement == 0 && this.foundPositionsForContent.size > 0) this.currentFoundElement = this.foundPositionsForContent.size - 1
            else this.currentFoundElement -= 1
            if (this.foundPositionsForContent.size > 0) this.getFoundPositionForContent(this.currentFoundElement)
            this.updateInformation(this.currentFoundElement + 1)
        })
        button.addEventListener('mouseenter', () => {
            button.style = `${classes.button} opacity:0.5;`
        })

        button.addEventListener('mouseleave', () => {
            button.style = `${classes.button}`
        })
        return button
    }

    buildLeftWall() {
        const leftWall = document.createElement('div')
        leftWall.style = `${classes['left-wall']}`
        return leftWall
    }

    builldSearchInput() {
        const search = document.createElement('input')
        search.setAttribute('id', 'search-input')
        search.style = `${classes['search']}`
        search.placeholder = "Find"
        search.addEventListener('input', (event) => {
            this.currentFoundElement = 0
            this.contentToSearchFor = `${event.target.value}`
            this.contentToSearchFor = this.contentToSearchFor.toLocaleLowerCase()
            this.search()
        })
        return search
    }

    search() {
        this.foundPositionsForContent.clear()
        this.removeHighlights()
        if (this.contentToSearchFor !== "") this.searchForTextInCode()
        this.updateInformation(0)
    }

    buildReplaceInput() {
        const replace = document.createElement('input')
        replace.style = `${classes['search']}`
        replace.placeholder = "Replace with"
        replace.addEventListener('input', (event) => {
            this.contentToReplaceWith = `${event.target.value}`
        })
        return replace
    }

    searchForTextInCode() {
        const code = document.getElementById('code-reader')
        const lines = code.childNodes
        lines.forEach((line) => {
            const lineCode = line.lastChild
            this.highlightText(lineCode)
        })
        this.addToFoundElements()
    }

    addToFoundElements() {
        const foundElements = document.getElementsByTagName('span')
        for (let index = 0; index < foundElements.length; index++) {
            const element = foundElements[index];
            this.foundMatch(element)
        }
    }

    removeHighlights() {
        const reader = document.getElementById('code-reader')
        const lines = reader.childNodes

        lines.forEach(line => {
            const codeContent = line.lastChild
            this.readCodeContent(codeContent)
        });
    }

    readCodeContent(code) {
        const contents = code.childNodes
        contents.forEach(content => {
            this.replaceHighlightWith(content, content.textContent)
        });
    }

    replaceHighlightWith(highlight, newContent) {
        const isSpan = highlight.nodeType === NODE_TYPE_SPAN
        if (isSpan) {
            highlight.replaceWith(newContent)
        }
    }

    foundMatch(lineCode) {
        const lowered = lineCode.textContent.toLocaleLowerCase()
        const length = this.contentToSearchFor.length
        let index = 0
        index = lowered.indexOf(this.contentToSearchFor, index)
        if (index != - 1) {
            this.foundPositionsForContent.set(this.foundPositionsForContent.size, { node: lineCode, start: index, end: index + length })
        }

    }

    highlightText(lineCode) {
        const line = document.getElementById(lineCode.id)
        let html = line.innerHTML
        const endingPoint = this.contentToSearchFor.length
        const lowered = html.toLocaleLowerCase()
        let index = lowered.indexOf(this.contentToSearchFor)
        const substrings = []
        while (index != -1) {
            const substring = [index, index + endingPoint]
            substrings.push(substring)
            index = lowered.indexOf(this.contentToSearchFor, index + endingPoint)
        }
        this.replaceWithHighlightedText(substrings, line)

    }

    replaceWithHighlightedText(substrings, line) {
        let html = line.innerHTML
        const reversedSubstrings = substrings.reverse()
        reversedSubstrings.forEach((substring) => {
            html = html.substring(0, substring[0]) + `<span style="background-color: lightblue;">${html.substring(substring[0], substring[1])}</span>` + html.substring(substring[1], html.length)
        })
        line.innerHTML = html
    }

    getFoundPositionForContent(key) {
        const firstElement = this.foundPositionsForContent.get(key)
        const range = document.createRange()
        // sets the view to scroll to the desired element so that it is visible to the user - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
        firstElement.node.scrollIntoView()
        firstElement.node.focus()
        range.setStart(firstElement.node.firstChild, firstElement.start)
        range.setEnd(firstElement.node.firstChild, firstElement.end)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }
}

customElements.define('custom-search', CustomSearch);