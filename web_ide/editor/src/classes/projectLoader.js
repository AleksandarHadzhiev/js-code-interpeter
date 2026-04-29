import FileLoader from "./fileLoader.js"
import CodeLoader from "./codeLoader.js"
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js"

export default class ProjectLoader {
    /**
     * @param {CodeLoader} codeLoader 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver 
     */
    constructor(codeLoader, loaderElementResizeObserver) {
        this.codeLoader = codeLoader
        this.loaderElementResizeObserver = loaderElementResizeObserver
        this.sidebarContent = document.getElementById('sidebar-content')
        this.projectSelector = document.getElementById('project-selector')
        this.openProjectButton = document.getElementById('open-project')
        this.openProjectButton.addEventListener('click', (event) => {
            this._loadProject('default')
        })
        this.projectName = ""
    }

    /**
     * 
     * @param {String} projectName 
     */
    _loadProject(projectName) {
        if (projectName.trim() !== "" && projectName !== this.projectName) {
            this.projectSelector.remove()
            this.projectName = projectName
            this._loadContentIntoSidebar()
            const fileLoader = new FileLoader(this.codeLoader, this.sidebarContent, this.loaderElementResizeObserver)
        }
    }

    _loadContentIntoSidebar() {
        const files = ['app.js', 'index.js']
        files.forEach((file) => {
            const fileElement = this._buildFile(file)
            this.sidebarContent.appendChild(fileElement)
        })
    }

    /**
     * 
     * @param {String} fileName 
     * @returns {HTMLElement}
     */
    _buildFile(fileName) {
        const file = document.createElement('div')
        file.className = 'file'
        file.id = fileName
        const fileNameElement = this._buildFileName(fileName)
        file.appendChild(fileNameElement)
        return file
    }

    /**
     * 
     * @param {String} fileName 
     * @returns {HTMLElement}
     */
    _buildFileName(fileName) {
        const fileNameElement = document.createElement('p')
        fileNameElement.className = 'file-name'
        fileNameElement.textContent = fileName
        return fileNameElement
    }
}