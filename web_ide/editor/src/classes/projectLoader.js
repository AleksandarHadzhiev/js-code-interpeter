export default class ProjectLoader {
    /**
     * 
     * @param {String} projectName 
     */
    constructor(projectName) {
        this.sidebarContent = document.getElementById('sidebar-content')
        this.screen = document.getElementById('screen')
        this.projectName = projectName
    }

    load() {
        if (this.projectName.trim() !== "") {
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
        file.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent(
                "loadFile", {
                "detail": { 'fileName': fileName }
            }
            ))
        })
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