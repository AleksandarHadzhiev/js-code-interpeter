import CodePanel from "./codePanel.js";
import ProjectFile from "./projectFile.js";

export default class FileLoaderObserver {
    /**
     * 
     * @param {CodePanel} codePanel 
     */
    constructor(codePanel) {
        this.codePanel = codePanel
    }

    /**
     * 
     * @param {ProjectFile} projectFile 
     */
    updateCodePanelOnLoadingNewFile(projectFile) {
        console.log(projectFile)
        // this.codePanel.updateForFile(projectFile)
    }
} 