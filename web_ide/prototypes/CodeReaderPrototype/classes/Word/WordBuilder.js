import Word from "./Word.js";
import WordType from "./WordType.js";
import Hint from "../Hints/Hint.js";
import HintTypes from "../Hints/HintTypes.js";
import { WordTypeDefiner } from "./WordTypeDefiner.js";


export default class WordBuilder {
    constructor(tracker) {
        this.words = []
        this.tracker = tracker
    }

    trasnformWords(words, line, hintsTracker) {
        words.forEach((_word, index) => {
            const content = this._defineContent(_word, words)
            const wordType = new WordTypeDefiner(_word, index, words, line, this.tracker).defineTypeForWordOnLine()
            const equalTo = this._getEqualTo(line, wordType, hintsTracker)
            const word = new Word(content, "transparent", wordType, line.id, index, line, equalTo)
            word.updateScope(line.scope)
            this.words.push(word)
        });
        return this.words
    }

    _getEqualTo(line, wordType, hintsTracker) {
        let equalTo = '';
        if (line.content.includes('=') && wordType == new WordType().CONST_ARIABLE && !line.content.includes('const')) {
            this._raiseEnError(line, hintsTracker);
        }
        else if (line.content.includes('=') && wordType == new WordType().LET_ARIABLE || wordType == new WordType().CONST_ARIABLE) {
            equalTo = String(line.content).substring(line.content.indexOf('=' + 1), line.content.length)
            if (equalTo.endsWith(';'))
                equalTo = equalTo.replace(';', '')
        }
        return equalTo;
    }

    _raiseEnError(line, hintsTracker) {
        const message = 'Error: cannot reassing value to a constant variable.'
        const hint = new Hint(message, new HintTypes().ERROR, line.id, `hint-${line.id}`)
        hintsTracker.addHint(hint);
    }

    _defineContent(_word, words) {
        if (_word == '' && words.length == 1) {
            return '\n'
        }
        return _word
    }
} 