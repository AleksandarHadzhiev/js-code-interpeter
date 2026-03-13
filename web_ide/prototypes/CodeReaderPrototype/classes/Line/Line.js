
import ScopeType from "../Scope/ScopeType.js";
import WordType from "../Word/WordType.js";
import FirstAppearance from "./FirstAppearance.js";

export default class Line {
    constructor(content, id) {
        this.content = content
        this.id = id
        this.scope = null
        this.words = []
        this.wordElements = []
    }

    updateScope(scope) {
        this.scope = scope
    }

    updateContent(content) {
        this.content = content
    }

    updateWords(words) {
        this.words = words
    }

    _transformWord(word, wordsTracker) {
        const firstAppearance = new FirstAppearance();
        const first = firstAppearance.findFirstAppearanceForWordInWordsTracker(word, wordsTracker)
        word.attachFirstAppearance(first)
        // this._ifWordIsObjectOfClassAttachFirstAppearance(word, wordTracker)
        // this._ifWordIsClassFunctionAttachFirstAppearance(word)
    }

    _ifWordIsObjectOfClassAttachFirstAppearance(word, wordsTracker) {
        if (this.content.includes('new')) {
            this._attachCalssNameIfWordIsVariable(word, wordsTracker)
        }
        else {
            this._attachFirstAppearanceIfVariableIsCalled(word, wordsTracker)
        }
    }

    _attachCalssNameIfWordIsVariable(word, wordsTracker) {
        const indexOfNew = this.words.indexOf('new')
        this.words.forEach((wordAsObject, index) => {
            if (index > indexOfNew && wordAsObject.value != "" && wordAsObject.type == new WordType().CLASS_OBJECT) {
                this._attachFirstAppearance(wordsTracker, wordAsObject, word)
            }
        });
    }

    _attachFirstAppearance(wordsTracker, wordAsObject, word) {
        const words = wordsTracker.words.get(wordAsObject.value)
        if (words) {
            words.forEach(_word => {
                if (_word.type == new WordType().CLASS) {
                    word.attachFirstAppearance(word)
                    wordAsObject.attachFirstAppearance(_word)
                }
            });
        }
    }

    _attachFirstAppearanceIfVariableIsCalled(word, wordsTracker) {
        const words = wordsTracker.words.get(word.value)
        if (words)
            words.forEach((_word) => {
                if (_word.scope.type === word.scope.type && _word.className != null) {
                    word.attachFirstAppearance(_word)
                }
            });
    }

    _ifWordIsClassFunctionAttachFirstAppearance(word) {
        if (word.type == new WordType().CLASS_FUNCTION) {
            let className = null
            if (this.scope.type == new ScopeType().CLASS)
                className = this._findTheClassType(scope.lines[0])
            word.attachFirstAppearance(className)
        }
    }

    _findTheClassType(line) {
        const words = line.words
        let index = 0
        words.forEach((word, i) => {
            if (index == 0 && word.trim() !== "")
                index = i
        });
        return line.words[index]
    }

}