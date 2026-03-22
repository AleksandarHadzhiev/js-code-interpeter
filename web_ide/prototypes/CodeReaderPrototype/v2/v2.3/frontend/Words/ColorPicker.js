
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

export default class ColorPicker {
    pickColorBasedOnWordType(word) {
        if (keywords.variableInitWords.includes(word))
            return "purple";
        else if (keywords.mathematicOperations.includes(word))
            return "gray";
        else if (keywords.sentencePointers.includes(word))
            return "white";
        else if (keywords.scopeInitingWords.includes(word))
            return "red";
        else if (keywords.brackets.includes(word))
            return "yellow"
        else if (keywords.arrayBrackets.includes(word))
            return "pink"
        else if (keywords.quotationMarks.includes(word))
            return "green"
        else if (keywords.specialKeyWords.includes(word))
            return 'pink'
        else return "blue"
    }
}