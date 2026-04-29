import CodeLoader from "./codeLoader.js"

export default class FileLoader {
    /**
     * 
     * @param {CodeLoader} codeLoader 
     * @param {HTMLElement} sidebarContent 
     */
    constructor(codeLoader, sidebarContent) {
        this.files = sidebarContent.childNodes
        this.codeLoader = codeLoader
        this.files.forEach((file) => {
            file.addEventListener('click', () => {
                if (file.id != "")
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