import CodeLoader from "./codeLoader.js"

export default class FileLoader {
    /**
     * 
     * @param {CodeLoader} codeLoader 
     */
    constructor(codeLoader) {
        this.sidebarContent = document.getElementById('sidebar-content')
        this.files = this.sidebarContent.childNodes
        this.codeLoader = codeLoader
        this.files.forEach((file) => {
            file.addEventListener('click', () => {
                this._loadFileContentOnScreen(file)
            })
        })
    }

    /**
     * 
     * @param {HTMLElement} file 
     */
    _loadFileContentOnScreen(file) {
        const fileName = file.id
        this.codeLoader.loadContentFromFileWithName(fileName)
    }
}