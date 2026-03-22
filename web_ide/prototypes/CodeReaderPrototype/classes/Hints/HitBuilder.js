import HintTypes from "./HintTypes.js"


export default class HintBuilder {
    constructor(hintsTracker, code) {
        this.hintsTracker = hintsTracker
        this.amountOfHints = hintsTracker.caughtProblems.length
        this.code = code
    }

    buildHints() {
        if (this.amountOfHints == 0) {
            return null
        }
        const hints = this.hintsTracker.caughtProblems
        hints.forEach(hintsForRow => {
            this.buildHintsForRow(hintsForRow)
        })
    }

    buildHintsForRow(hintsForRow) {
        let hintsView = null
        if (hintsForRow.problems.length > 1) {
            hintsView = this.buildHintsWithSwitcher(hintsForRow)
        }
        else {
            hintsView = this.buildHint(hintsForRow.problems[0], 0)
        }
        if (hintsView) this.code.appendChild(hintsView)
    }

    buildHintsWithSwitcher(hintsForRow) {
        const hint = hintsForRow.problems[hintsForRow.problems.length - 1]
        let line = document.getElementById(`${hint.row}`)
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
        const switcher = this.buildHintsSwitcher(hintsForRow)
        const startingHint = this.displayHint(hintsForRow.problems[lastHint], lastHint)
        hintsView.appendChild(startingHint)
        hintsView.appendChild(switcher)
        return hintsView
    }

    buildHintsSwitcher(hintsForRow) {
        const switcher = document.createElement('div')
        switcher.style = `display:flex; width: fit-content; margin-right: 5px;`
        const switchButtons = this.buildSwitchButtons(hintsForRow)
        const info = document.createElement('span')
        info.style = `margin-left: 15px;`
        info.setAttribute('id', 'hint-info')
        info.textContent = hintsForRow.getPositionInformation()
        switcher.appendChild(switchButtons)
        switcher.appendChild(info)
        return switcher
    }

    buildSwitchButtons(hintsForRow) {
        const switchButtons = document.createElement('div')
        switchButtons.style = `
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 25px;
    `
        const buttonToGoUpOnce = this.buildButtonForHintsWithTextOnButton(hintsForRow, '+')
        const buttonToGoDownOnce = this.buildButtonForHintsWithTextOnButton(hintsForRow, '-')
        switchButtons.appendChild(buttonToGoUpOnce)
        switchButtons.appendChild(buttonToGoDownOnce)
        return switchButtons
    }

    buildButtonForHintsWithTextOnButton(hintsForRow, text) {
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
        button = this.handleButtonHover(button)
        button = this.changeHintIndex(button, hintsForRow)
        return button
    }

    handleButtonHover(button) {
        button.addEventListener('mouseenter', () => {
            button.style.borderColor = `blue`;
        })

        button.addEventListener('mouseleave', () => {
            button.style.borderColor = `gray`;
        })
        return button
    }

    changeHintIndex(button, hintsForRow) {
        const text = button.textContent
        button.addEventListener('click', () => {
            if (text == '+') hintsForRow.moveUpTheHints()
            else hintsForRow.moveDownTheHints()
            this.updateTextForHintMessage(hintsForRow)
        })
        return button
    }

    updateTextForHintMessage(hintsForRow) {
        const hintMessage = document.getElementById(`${hintsForRow.problems[0].id}-message`)
        const info = document.getElementById('hint-info')
        const newHint = hintsForRow.getCurrentHint()
        hintMessage.textContent = newHint.message
        info.textContent = hintsForRow.getPositionInformation()
    }

    buildHint(hint, index) {
        if (hint && hint.isToBeDisplayed) {
            let line = document.getElementById(`${hint.row}`)
            if (line) {
                line = this.applyStyleToLine(hint, line)
                return this.buildHintMessage(hint, line, index)
            }
            return null
        }
        return null
    }

    applyStyleToLine(hint, line) {
        const color = hint.type === new HintTypes().ERROR ? "white" : "lightyellow"
        line.style.background = `${color}`
        return line
    }

    buildHintMessage(hint, line, index) {
        const message = document.createElement('p')
        message.textContent = hint.message
        message.setAttribute('id', `${hint.id}-message`)
        const color = hint.type === new HintTypes().ERROR ? "lightcoral" : "lightyellow"
        if (this.hintsTracker.caughtProblems.get(hint.id).problems.length == 1)
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
            this.hintsTracker.switchDisplaySettingsForHintAtIndex(hint, index)
            if (hint.type === new HintTypes().SUGGESTION) {
                line.style.background = `transparent`
                message.remove()
            }
        })
        return message
    }
}