export default class SingleLineHighlighter {
    /**
     * 
     * @param {String} content 
     * @param {String} wholeText 
     */
    constructor(content, wholeText) {
        this.wholeText = wholeText.toLowerCase()
        this.contentToSearchFor = String(content)
        this.highlighter = document.getElementById('highlighter')
        this.highlightedLines = []
        this.index = 0
        this.indexOf = 0
    }

    getHighlightedLines() {
        return this.highlightedLines
    }

    highlight() {
        console.info('Handled at the lines level FOR REAL COLORIzATION')
        const startTime = performance.now()

        // const wholeText = String(document.getElementById('writer').value).toLowerCase()
        this._refresh()
        this._revisit(this.wholeText)

        const endTime = performance.now()

        console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    }

    _refresh() {
        this.index = 0
        this.indexOf = 0
    }

    _revisit(text) {
        this.indexOf = String(text).indexOf(this.contentToSearchFor, this.index)
        if (this.indexOf != -1) {
            this.index = this.indexOf + this.contentToSearchFor.length
            this.highlightedLines.push(this.indexOf)
            this._revisit(text)
        }
    }
}