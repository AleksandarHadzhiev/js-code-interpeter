import CodeLoader from "./codeLoader.js"
import ProjectFile from "./projectFile.js"
import FileLoaderObserver from "./fileLoaderObserver.js"

export default class FileLoader {
    /**
     * 
     * @param {FileLoaderObserver} fileLoaderObserver 
     */
    constructor(fileLoaderObserver) {
        this.fileLoaderObserver = fileLoaderObserver
    }

    /**
     * 
     * @param {Array} projectContent 
     */
    updateProjectContent(projectContent) {
        projectContent.forEach((file) => {
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
        const projectFile = new ProjectFile(fileName, longestLine, "js")
        this.fileLoaderObserver.updateCodePanelOnLoadingNewFile(projectFile)
        // this.codeLoader.loadContentFromFileWithName(fileName, longestLine)
    }
}