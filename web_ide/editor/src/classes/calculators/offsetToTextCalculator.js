/**
 * 
 * @param {Number} width 
 * @param {Number} fullTextWidth 
 * @param {Number} textLength 
 */
export default function turnWidthToIndexForText(width, fullTextWidth, textLength) {
    console.log(width, fullTextWidth)
    const percentage = Math.round((width / fullTextWidth) * 100)
    console.log(percentage)
    console.log(percentage / 100)
    console.log(textLength)
    const index = Math.round(textLength * (percentage / 100))
    console.log(index)
    return index
}
