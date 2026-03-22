import ScopeType from "../Scope/ScopeType.js"
import WordType from "../Word/WordType.js"

export default class FirstAppearance {
    findFirstAppearanceForWordInWordsTracker(word, wordsTracker) {
        console.log(word)
        const isWordType = word.type != new WordType().KEYWORD && word.type !== new WordType().EMPTY;
        if (isWordType)
            return this._checkWords(word, wordsTracker)
        else return word
    }

    _checkWords(word, wordsTracker) {
        console.log(word)
        const words = wordsTracker.words.get(word.value)
        console.log(words, wordsTracker)
        if (words && words.length > 1)
            return this._compareMatchingWordsWithWord(words.toReversed(), word)
        else return word
    }

    _compareMatchingWordsWithWord(matchingWords, word) {
        let firstAppearance = word
        matchingWords.forEach(matchingWord => {
            if (this._checkIfItIsClassField(word, matchingWord)) firstAppearance = matchingWord
            else if (this._checkIfItIsFunctionCalling(word, matchingWord)) firstAppearance = matchingWord
            else if (this._wordsInTheSameScope(matchingWord, word)) firstAppearance = matchingWord
        });
        console.log(firstAppearance)
        return firstAppearance
    }

    _checkIfItIsClassField(word, matchingWord) {
        const isClassField = word.type == new WordType().CLASS_FIELD && matchingWord.type === word.type
        if (isClassField && matchingWord.scope.type == new ScopeType().CONSTRUCTOR) {
            return true
        }
        return false
    }

    _checkIfItIsFunctionCalling(word, matchingWord) {
        const isFunction = word.type === new WordType().FUNCTION && matchingWord.type == word.type
        const isClassFunction = word.type === new WordType().CLASS_FUNCTION && matchingWord.type == word.type
        if (isFunction)
            return this._checkIfItsTheInitOfTheFunction(matchingWord)
        else if (isClassFunction) {
            console.log("IS CLASS FUNCTION")
            return this._checkIfItsTheInitOfTheFunction(matchingWord)
        }
        return false
    }

    _checkIfItsTheInitOfTheFunction(matchingWord) {
        console.log(matchingWord)
        if (matchingWord.scope.type == new ScopeType().FUNCTION) {
            return this._checkIfItsOnFirstLine(matchingWord)
        }
        return false
    }

    _checkIfItsOnFirstLine(matchingWord) {
        const lines = matchingWord.scope.getLines()
        const isOnFirstLine = lines[0].content.includes(matchingWord.value)
        if (isOnFirstLine) return true
        return false
    }

    _wordsInTheSameScope(matchingWord, word) {
        console.log(word.scope, matchingWord.scope)
        if (matchingWord.scope.type === word.scope.type) {
            if (this._checkIfFirstAppearanceIsParamaterOfAFunction(matchingWord, word)) return true
            else if (this._checkIfWordIsVariable(word, matchingWord)) return true
        }
        return false
    }

    _checkIfFirstAppearanceIsParamaterOfAFunction(matchingWord, word) {
        const isFunctionScope = word.scope.type == new ScopeType().FUNCTION || word.scope.type == new ScopeType().CONSTRUCTOR
        console.log(matchingWord, word)

        if (isFunctionScope && matchingWord.type == new WordType().FUNCTION_PARAMETER) {
            return true
        }
        return false
    }

    _checkIfWordIsVariable(word, matchingWord) {
        const isVariable = word.type == new WordType().LET_ARIABLE || word.type == new WordType().CONST_ARIABLE
        if (word.type == matchingWord.type && isVariable)
            return true
        return false
    }
}