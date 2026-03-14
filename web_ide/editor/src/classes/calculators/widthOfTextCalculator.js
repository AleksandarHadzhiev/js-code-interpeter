/**
 * @param {String} text
 * @returns {Number} the width of the provided text 
 */
export default function calculateWidthForText(contentElement, text) {
    const spanElement = _createSpanElementForText(text)
    const width = _getiWidthOfSpanElement(contentElement, spanElement)
    spanElement.remove()
    return width;
}

/**
 * @param {String} text 
 * @returns {HTMLElement} the html element.
 */
function _createSpanElementForText(text) {
    const element = document.createElement('div')
    element.textContent = text
    element.classList.add('line-content-marker')
    return element
}

/**
 * @param {HTMLElement} spanElement 
 * @returns {Number} the width of the element
 */
function _getiWidthOfSpanElement(contentElement, spanElement) {
    contentElement.prepend(spanElement)
    const width = spanElement.offsetWidth
    return width
}