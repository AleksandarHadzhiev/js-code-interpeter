/**
 * @param {String} text
 * @returns {Number} the width of the provided text 
 */
export default function calculateWidthForText(text) {
    const spanElement = _createSpanElementForText(text)
    const width = _getiWidthOfSpanElement(spanElement)
    spanElement.remove()
    return width;
}

/**
 * @param {String} text 
 * @returns {HTMLElement} the html element.
 */
function _createSpanElementForText(text) {
    const element = document.createElement('span')
    element.textContent = text
    element.classList.add('line-content-marker')
    return element
}

/**
 * @param {HTMLElement} spanElement 
 * @returns {Number} the width of the element
 */
function _getiWidthOfSpanElement(spanElement) {
    let editorElement = document.getElementById('editor')
    editorElement.prepend(spanElement)
    const width = spanElement.offsetWidth
    editorElement = null // for GC to remove from memory
    return width
}