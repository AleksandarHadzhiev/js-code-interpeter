export default class WordsSplitter {

    splitLineIntoWords(line) {
        const regex = /`|\b\w+\b|[.\s |;|,|=|<|(|)|[|]|\{|\}|\;|\:|\>|\?|\!|"|']+|\W{1}/g;
        return this._splitLineUsingRegex(line, regex)
    }

    _splitLineIntoWordsUsingRegex(line, regex) {
        let words = ['']
        if (line.trim() != "")
            words = String(line).match(regex)
        return words
    }
}