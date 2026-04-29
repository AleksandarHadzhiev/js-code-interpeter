export default class ProjectLoader {
    constructor() {
        this.sidebarContent = document.getElementById('sidebar-content')
        this.screen = document.getElementById('screen')
        this.projectName = ""
    }

    /**
     * 
     * @param {String} projectName 
     */
    loadProject(projectName) {
        if (projectName.trim() !== "" && projectName !== this.projectName) {
            this.sidebarContent.replaceChildren([])
            this.projectName = projectName
            this._loadContentIntoSidebar()
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