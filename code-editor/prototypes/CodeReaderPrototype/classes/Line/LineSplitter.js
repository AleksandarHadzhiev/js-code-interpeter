export default class LineSplitter {
    constructor() {
        this.words = []
        this.wordValue = ''
    }

    splitLineIntoWords(content) {
        const regex = /`|\b\w+\b|[.\s |;|,|=|<|(|)|[|]|\{|\}|\;|\:|\>|\?|\!|"|']+/g;
        const splits = this._splitContentUsingRegex(content, regex)
        this.words = splits
        return this.words
    }

    _splitContentUsingRegex(content, regex) {
        let splits = ['']
        if (content.trim() != "")
            splits = String(content).match(regex)
        return splits
    }
}