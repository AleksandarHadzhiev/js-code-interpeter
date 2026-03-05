// for (let index = startingLine; index < visibleLines.length; index++) {
//     // const lineNumber = index + startingLine
//     // if (lineNumber < lastVisibleLine) {
//     //     const lineElement = visibleLines[index]
//     //     let inner = `<span>Hi</span><span> </span><span>I'm</span><span> </span><span>Aleksandar Hadzhiev</span>`
//     //     if (index == 3 || index == 5 || index == 7)
//     //         inner = `<span>Hi</span><span> </span><span>I'm</span><span> </span><span>Aleksandar Hadzhiev</span><span>Hi</span><span> </span><span>I'm</span><span>Hi</span><span> </span><span>I'm</span><span>Hi</span><span> </span><span>I'm</span>`
//     //     lineElement.innerHTML = inner
//     //     lineElement.setAttribute('id', `${lineNumber}`)
//     //     lineElement.addEventListener('mouseup', (event) => {
//     //         const selection = document.getSelection()
//     //         handleClickOnLine(event)
//     //         buildMarker()
//     //         selection.empty() // so that there isn't any marking from the actual range, but it will be from a custom marker...
//     //         oldRange = null
//     //         firstClicked = null
//     //     })
//     //     lineElement.addEventListener('mousedown', (event) => {
//     //         firstClicked = event.currentTarget
//     //         isSelectingRange = true
//     //     })
//     //     lineElement.addEventListener('mousemove', () => {
//     //         const selection = document.getSelection()
//     //         if (selection.rangeCount > 0) {
//     //             const range = selection.getRangeAt(0)
//     //             oldRange = range
//     //         }
//     //     })
//     //     lineElement.style =
//     //         `
//     //             top: ${lineNumber * 28.8}px;
//     //         `
//     // }
// }