export default class WordsSplitter {

    splitLineIntoWords(content) {
        const regex = /`|\b\w+\b|[.\s |;|,|=|<|(|)|[|]|\{|\}|\;|\:|\>|\?|\!|"|']+|\W{1}/g;
        const words = this._splitContentUsingRegex(content, regex)
        return words
    }

    _splitContentUsingRegex(content, regex) {
        let splits = ['']
        if (content.trim() != "")
            splits = String(content).match(regex)
        return splits
    }
}