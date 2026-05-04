import FileLoader from "./fileLoader.js"
import CodeLoader from "./codeLoader.js"
import ProjectLoaderObserver from "./projectLoaderObserver.js"

export default class ProjectLoader {
    /**
     * 
     * @param {ProjectLoaderObserver} projectLoaderObserver 
     */
    constructor(projectLoaderObserver) {
        this.projectLoaderObserver = projectLoaderObserver
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
            this.projectLoaderObserver.notifyFileLoader(this.sidebarContent.childNodes)
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