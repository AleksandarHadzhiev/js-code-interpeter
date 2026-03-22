enum ScopeType {
    Global,
    File,
    Class,
    Functional,
    Block
}

class Word {
    value: string
    scopeType: any
    constructor(value: string, scopeType: ScopeType) {
        this.value = value
        this.scopeType = scopeType
    }
}

class WordsScopeTracker {
    words: Word[]
    constructor() {
        this.words = []
    }

    addWord(word: Word) {
        this.words.push(word)
    }

}

