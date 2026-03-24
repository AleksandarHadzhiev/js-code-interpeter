/**
 * 
 * @param {Number} width 
 * @param {Number} fullTextWidth 
 * @param {Number} textLength 
 */
export default function turnWidthToIndexForText(width, fullTextWidth, textLength) {
    const percentage = (width / fullTextWidth) * 100
    const index = Math.round(textLength * (percentage / 100))
    return index
}
