import sheet from './sidebar.css' with {type: 'css'}
import LoadStylesFromCSS from "../../loadStylesFromCSS.js";

const loader = new LoadStylesFromCSS(sheet.rules)
const classes = loader.getClasses()


class CustomSidebar extends HTMLElement {
    constructor() {
        super();
        this.sidebarActions = ['create-file', 'create-folder']
        const sidebar = this.buildMainContainer()
        this.appendChild(sidebar)
    }

    buildMainContainer() {
        const sidebar = document.createElement('section')
        sidebar.style = `${classes.sidebar}`
        const actionsContainer = document.createElement('custom-actions')
        const filesContainer = document.createElement('custom-files-container')
        filesContainer.style = `${classes.files}`
        actionsContainer.style = `${classes.actions}`
        sidebar.appendChild(actionsContainer)
        sidebar.appendChild(filesContainer)
        return sidebar
    }

}

customElements.define('custom-sidebar', CustomSidebar);