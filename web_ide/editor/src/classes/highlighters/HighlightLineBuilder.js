export default class HighlightLineBuilder {
    buildReplaceTextElement(text) {
        const replaceText = document.createElement('span')
        replaceText.setAttribute('name', "highlighted")
        replaceText.classList.add('highlighted')
        replaceText.textContent = text
        return replaceText
    }

    buildNomralTextElement(text) {
        const replaceText = document.createElement('span')
        replaceText.style.whiteSpace = "pre"
        replaceText.textContent = text
        return replaceText
    }
}