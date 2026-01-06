const keywords = {
    variableInitWords: ['const', 'let', 'var'],
    mathematicOperations: ['=', '>', '<', '>=', '+', '<=', '==', '===', '!=', '!==', '-', '/', '*'],
    sentencePointers: [':', ';', '.', ','],
    scopeInitingWords: ['class', 'function', 'constructor', 'if', 'else', 'else if', 'while', 'for', 'try', 'catch'],
    brackets: ['(', ')', '{', '}'],
    arrayBrackets: ['[', ']'],
    quotationMarks: [`'`, `"`, `${"`"}`],
    specialKeyWords: ['this', 'new', 'return', 'import', 'from', 'export']

}

export default class BaseColorPicker {
    pickColorBasedOnWordType(word) {
        if (keywords.variableInitWords.includes(word))
            return "#DFD0B8";
        else if (keywords.mathematicOperations.includes(word))
            return "#F2F2F2";
        else if (keywords.sentencePointers.includes(word))
            return "white";
        else if (keywords.scopeInitingWords.includes(word))
            return "#E43636";
        else if (keywords.brackets.includes(word))
            return "yellow"
        else if (keywords.arrayBrackets.includes(word))
            return "#CC66DA"
        else if (keywords.quotationMarks.includes(word))
            return "#169976"
        else if (keywords.specialKeyWords.includes(word))
            return '#DCA06D'
        else return "#468A9A"
    }
}