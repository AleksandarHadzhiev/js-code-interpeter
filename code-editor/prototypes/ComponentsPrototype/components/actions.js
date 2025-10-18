import sheet from './actions.css' with {type: 'css'}
import LoadStylesFromCSS from '../../loadStylesFromCSS.js'
import SIdebarAPIHandler from '../../API_Calls/sidebar_calls.js'

const loader = new LoadStylesFromCSS(sheet.rules)
const apiHandler = new SIdebarAPIHandler()
const classes = loader.getClasses()

class CustomActions extends HTMLElement {
    constructor() {
        super()
        this.sidebarActions = ['create-file', 'create-folder']
        const actionsContainer = this.buildContainerForAvailableActions()
        this.appendChild(actionsContainer)
    }


    buildContainerForAvailableActions() {
        const actionsContainer = document.createElement('div')
        actionsContainer.style = `${classes.actions}`
        const directoryName = this.buildDirectoryNameElement()
        actionsContainer.appendChild(directoryName)
        const actions = this.buildActions()
        actionsContainer.appendChild(actions)
        return actionsContainer
    }

    buildDirectoryNameElement() {
        const directoryname = document.createElement('p')
        directoryname.textContent = "Project"
        return directoryname
    }

    buildActions() {
        const container = document.createElement('div')
        container.style = `${classes['actions-left']}`
        this.sidebarActions.forEach(action => {
            const button = this.buildActionElement(action)
            container.appendChild(button)
        });
        return container
    }

    handleActionElementHover(button) {
        button.addEventListener('mouseenter', () => {
            button.style = `${classes.action} opacity:0.5;`
        })
        button.addEventListener('mouseleave', () => {
            button.style = `${classes.action}`
        })
    }

    handleCorrectActionAssignment(name) {
        if (name === 'create-file') apiHandler.buildFile(name)
        else apiHandler.buildFolder(name)
    }

    buildActionElement(name) {
        const button = document.createElement('button')
        button.setAttribute('id', name)
        button.style = `${classes.action}`
        this.handleActionElementHover(button)
        button.addEventListener('click', () => {
            // Will also be refactored to properly handle dynamic names
            this.handleCorrectActionAssignment(name)
        })
        const icon = this.buildIconForAction(name)
        button.appendChild(icon)
        return button
    }

    buildIconForAction(name) {
        // Simplified for now with an if check - > to be more dynamic later
        let src = './icons/create_file.png';
        let alt = 'Create file';
        if (name === 'create-folder') {
            src = './icons/create_folder.png'
            alt = 'Create folder'
        }
        const icon = document.createElement('img')
        icon.src = src
        icon.alt = alt
        icon.style = `${classes.icon}`
        return icon
    }
}

customElements.define('custom-actions', CustomActions)