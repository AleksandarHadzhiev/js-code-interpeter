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
        let longestLine = " * This DTO transfers the data needed to calculate the total left offset of the caret position on the line."
        if (fileName == 'app.js')
            longestLine = "This is a long line to be displayed, and for that reason it will have a lot of text inside it."
        this.codeLoader.loadContentFromFileWithName(fileName, longestLine)
    }
}