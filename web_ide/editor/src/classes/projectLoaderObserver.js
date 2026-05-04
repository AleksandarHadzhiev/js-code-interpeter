import FileLoader from "./fileLoader.js"

export default class ProjectLoaderObserver {
    /**
     * 
     * @param {FileLoader} fileLoader 
     */
    constructor(fileLoader) {
        this.fileLoader = fileLoader
    }

    /**
     * 
     * @param {Array} projectContent 
     */
    notifyFileLoader(projectContent) {
        this.fileLoader.updateProjectContent(projectContent)
    }
}