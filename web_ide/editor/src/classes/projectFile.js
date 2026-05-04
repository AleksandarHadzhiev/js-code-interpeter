export default class ProjectFile {

    /**
     * 
     * @param {String} fileName 
     * @param {String} longestLine 
     * @param {String} fileExtension 
     */
    constructor(fileName, longestLine, fileExtension) {
        this.name = fileName
        this.longestLine = longestLine
        this.fileExtension = fileExtension
    }
}