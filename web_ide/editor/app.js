// import { BarVerticalHandler, BarHorizontalHandler } from "./src/classes/scrollingMechanisms/BarHandler.js"
// import LoaderHandler from "./src/classes/scrollingMechanisms/LoaderHandler.js"
// import OffsetCalculator from "./src/classes/scrollingMechanisms/OffsetCalculator.js"
// import LinesLoader from "./src/classes/scrollingMechanisms/LinesLoader.js"
// import TextSelection from "./src/classes/selectionMechanisms/textSelection.js"
// import TextSelectionScrolling from "./src/classes/scrollingMechanisms/textSelectionScrolling.js"
// import calculateTotalLeftOffsetOfCaretInTheLine from "./src/classes/calculators/caretLeftOffsetCalculator.js"
// import { CaretLeftOffsetDTO } from "./src/classes/dtos/caretDTOs.js"
// import CaretMover from "./src/classes/caretMover.js"
// import ScrollOnCaretMovement from "./src/classes/scrollingMechanisms/scrollOnCaretMovement.js"
// import { MousePosition } from "./src/classes/selectionMechanisms/enums.js"
// import ContentScrollingHandler from "./src/classes/scrollingMechanisms/ContentScrollingHandler.js"
// import calculateWidthForText from "./src/classes/calculators/widthOfTextCalculator.js"
// import LineSelector from "./src/classes/selectionMechanisms/lineSelector.js"
// import SearchReplaceHandler from "./src/classes/searchReplace/searchReplaceHandler.js"
// import WriterHandler from "./src/classes/writerHandler.js"
// import CodeChangesHistoryHandler from "./src/classes/codeChangesHistoryHandler.js"
// import SizeChangesHandler from "./src/classes/sizesUpdateMechanisms/sizeChangesHandler.js"

// import CaretBuilder from "./src/classes/selectionMechanisms/caretBuilder.js"
// const mainContainer = document.getElementById('container')
// const menuContainer = document.getElementById('menu')
// const navigationElement = document.getElementById('navigation')
// const loaderElement = document.getElementById('loader')
// const writerElement = document.getElementById('writer')

// const scrollbarElementVertical = document.getElementById('scrollbar-vertical')
// const scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
// const barVerticalElement = document.getElementById('bar-vertical')
// const placer = document.getElementById('caret-placer')

// const scrollbarElementHorizontal = document.getElementById('scrollbar-horizontal')
// const scrollbarAreaElementHorizontal = document.getElementById('scrollable-area-horizontal')
// const barHorizontalElement = document.getElementById('bar-horizontal')

// const lineNumerationElement = document.getElementById('line-numeration')
// const lineContentElement = document.getElementById('line-content')
// const contentElement = document.getElementById('content')


// const scrollbarVerticalHeight = scrollbarElementVertical.offsetHeight
// const scrollbarVerticalTopOffset = navigationElement.offsetHeight
// const barVerticalHeight = barVerticalElement.offsetHeight

// let text = contentPicker.pickTextFromFileWithName('app.js')
// const listOfPossibleLinesToDisplay = String(text).split('\n')
// console.log(text)
// let isWriting = false
// let intervalId = null
// let intervalHorizontalId = null
// const lineNumerationWidth = lineNumerationElement.scrollWidth
// const menuWidth = menuContainer.offsetWidth
// let contentElementOffsetLeft = menuWidth + lineNumerationWidth

// // the horizontal scrollbar elements and their sizes - unsure which sizes for now..
// const barHorizontalWidth = barHorizontalElement.offsetWidth
// const barVerticalWidth = barVerticalElement.offsetWidth
// const scrollbarHorizontalLeftOffset = menuWidth + lineNumerationWidth
// const scrollbarWidth = scrollbarElementHorizontal.offsetWidth
// const lineContentWidth = lineContentElement.scrollWidth

// const longestLinesInText = "This is a long line to be displayed, and for that reason it will have a lot of text inside it." // will be a data coming from the backend
// const lines = listOfPossibleLinesToDisplay.length // will be a data coming from the backend.
// const lineHeightInPixels = 28.8
// let maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)
// const widthOfLongestLine = calculateWidthForText(contentElement, longestLinesInText)

// let loaderHeightInLines = lines > maxVisibleLinesOnScreen - 1 ? (lines + maxVisibleLinesOnScreen - 1) : lines

// let loaderHeight = loaderHeightInLines * lineHeightInPixels
// loaderElement.style.height = `${loaderHeight}px`
// lineContentElement.style = `width: ${widthOfLongestLine}px;`
// let barVerticalIsSelected = false
// let barHorizontalIsSelected = false
// let isTextSelecting = false
// let startingRange = null
// let pageYMousePosition = 0

// const codeChangesHistoryHandler = new CodeChangesHistoryHandler(text)
// const contentScrollingHandler = new ContentScrollingHandler(lineContentWidth, scrollbarHorizontalLeftOffset, lineNumerationWidth, barVerticalWidth, lineContentElement)
// const textSelection = new TextSelection(scrollbarVerticalTopOffset, lineNumerationWidth, scrollbarVerticalHeight, loaderElement.offsetWidth, contentElement, contentElementOffsetLeft, lines, contentScrollingHandler)
// const barVerticalHandler = new BarVerticalHandler(scrollbarVerticalHeight, barVerticalHeight, barVerticalElement)
// const barHorizontalHandler = new BarHorizontalHandler(scrollbarWidth, barHorizontalWidth, barHorizontalElement)
// const loaderHandler = new LoaderHandler(loaderHeight, scrollbarVerticalHeight, loaderElement)
// const offsetCalculator = new OffsetCalculator()
// const linesLoader = new LinesLoader(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement, contentElement, listOfPossibleLinesToDisplay, lineHeightInPixels, text)
// const textSelectionScrolling = new TextSelectionScrolling(barVerticalHandler, loaderHandler, linesLoader)
// const scrollOncaretMovement = new ScrollOnCaretMovement(loaderHandler, barVerticalHandler, linesLoader, contentScrollingHandler, barHorizontalHandler)
// const caretMover = new CaretMover(scrollOncaretMovement, lineContentElement)
// const caretBuidler = new CaretBuilder()
// const searchReplaceHandler = new SearchReplaceHandler(linesLoader, text, loaderHandler, barVerticalHandler, barHorizontalHandler, contentScrollingHandler, codeChangesHistoryHandler)
// const writerHandler = new WriterHandler(text, contentElement, searchReplaceHandler, caretBuidler, codeChangesHistoryHandler)
// const sizeChangesHandler = new SizeChangesHandler(textSelection)


// function displayVerticalScrollbar() {
//     if (loaderHeight > mainContainer.offsetHeight) {
//         scrollbarAreaElementVertical.classList.remove('hidden')
//     }
//     else {
//         scrollbarAreaElementVertical.classList.add('hidden')
//     }
// }

// function displayHorizontalScrollbar() {
//     if (contentElement.offsetWidth < contentElement.scrollWidth) {
//         scrollbarAreaElementHorizontal.classList.remove('hidden')
//     }
//     else {
//         scrollbarAreaElementHorizontal.classList.add('hidden')
//     }
// }


// linesLoader.loadLines(updateWidths)

// function updateWidths() {
//     barHorizontalHandler.updateWidths(scrollbarElementHorizontal.offsetWidth, barHorizontalElement.offsetWidth)
//     contentScrollingHandler.updateMaxLeftOffset(lineContentElement.scrollWidth, scrollbarHorizontalLeftOffset, barHorizontalWidth)
// }

// displayVerticalScrollbar()
// displayHorizontalScrollbar()

// window.addEventListener('wheel', (event) => {
//     if (event.deltaY != -0)
//         scrollVertical(event)
//     else scrollHorizontal(event)
//     displayHighlightIfThereIsSelectedText()
// })

// function scrollVertical(event) {
//     const offsetTop = offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
//     loaderHandler.scrollWithOffset(offsetTop)
//     const percentage = loaderHandler.getPercentageOfScroll()
//     barVerticalHandler.scrollBasedOnPercentage(percentage)
//     linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
//     textSelection.setLoaderOffset(loaderHandler.topOffset)
//     searchReplaceHandler.updateOnScrolling()
// }

// function scrollHorizontal(event) {
//     contentScrollingHandler.updateMaxLeftOffset(lineContentElement.scrollWidth, scrollbarHorizontalLeftOffset, barHorizontalWidth)
//     contentScrollingHandler.scrollWithOffset(event.deltaX)
//     const percentageOfContentScroll = contentScrollingHandler.getPerentageOfScroll()
//     barHorizontalHandler.scrollBasedOnPercentage(percentageOfContentScroll)
//     caretMover.updateScreenWidth()
// }

// function displayHighlightIfThereIsSelectedText() {
//     buildMarker()
//     const markerElement = document.getElementById('marker')
//     if (markerElement) {
//         textSelection.display(linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
//     }
// }

// barVerticalElement.addEventListener('mousedown', (event) => {
//     barVerticalIsSelected = true
//     scrollbarAreaElementVertical.style.pointerEvents = "all"
// })

// barHorizontalElement.addEventListener('mousedown', (event) => {
//     barHorizontalIsSelected = true
//     scrollbarAreaElementHorizontal.style.pointerEvents = "all"
// })

// scrollbarAreaElementVertical.addEventListener('mousemove', (event) => {
//     if (barVerticalIsSelected) {
//         verticalScrolling(event)
//     }
// })

// /**
//  * 
//  * @param {MouseEvent} event 
//  */
// function verticalScrolling(event) {
//     barVerticalHandler.scrollWithOffset(event.clientY - scrollbarVerticalTopOffset)
//     const percentage = barVerticalHandler.getPercentageOfScroll()
//     loaderHandler.scrollWithPercentage(percentage)
//     linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
//     textSelection.setLoaderOffset(loaderHandler.topOffset)
//     displayHighlightIfThereIsSelectedText()
//     searchReplaceHandler.updateOnScrolling()
// }

// scrollbarAreaElementHorizontal.addEventListener('mousemove', (event) => {
//     if (barHorizontalIsSelected) {
//         horizontalScrolling(event)
//     }
// })

// /**
//  * 
//  * @param {MouseEvent} event 
//  */
// function horizontalScrolling(event) {
//     barHorizontalHandler.scrollWithOffset(event.clientX - scrollbarHorizontalLeftOffset)
//     const percentage = barHorizontalHandler.getPercentageOfScroll()
//     contentScrollingHandler.updateMaxLeftOffset(lineContentElement.scrollWidth, scrollbarHorizontalLeftOffset, barHorizontalWidth)
//     contentScrollingHandler.scrollWithPercentage(percentage)
//     caretMover.updateScreenWidth()
// }

// window.addEventListener('mousedown', (event) => {
//     if (event.target.id != 'search-field' && event.target.id != 'replace-field')
//         isWriting = true
//     else isWriting = false
// })


// window.addEventListener('mouseup', (event) => {
//     barVerticalIsSelected = false
//     barHorizontalIsSelected = false
//     scrollbarAreaElementVertical.style.pointerEvents = "none"
//     scrollbarAreaElementHorizontal.style.pointerEvents = "none"
//     if (isTextSelecting) {
//         scrollbarElementVertical.style.pointerEvents = "all"
//         scrollbarElementHorizontal.style.pointerEvents = "all"
//     }
//     isTextSelecting = false
//     startingRange = null
//     caretMover.resetLeftOffsetForCaretMover()
//     clearInterval(intervalId)
//     clearInterval(intervalHorizontalId)
//     intervalId = null
//     intervalHorizontalId = null
//     if (isWriting)
//         writerElement.focus()
// })

// lineContentElement.addEventListener('mousedown', (event) => {
//     isTextSelecting = true
//     scrollbarElementVertical.style.pointerEvents = "none"
//     scrollbarElementHorizontal.style.pointerEvents = "none"
// })

// contentElement.addEventListener('mousedown', (event) => {
//     const targetId = event.target.id
//     if (targetId == "content" || targetId == "line-selector") {
//         const mouseYPosition = loaderHandler.topOffset + (event.pageY - navigationElement.offsetHeight)
//         const lineId = Math.floor(mouseYPosition / lineHeightInPixels)
//         isTextSelecting = true
//         const lineSelector = new LineSelector(event, contentElement)
//         lineSelector.selectLineForClickOnEmptySpace(lineId, contentElement)
//         buildStartingPoint(lineId)
//     }
// })

// /**
//  * 
//  * @param {Number} lineId 
//  */
// function buildStartingPoint(lineId) {
//     const lineElement = document.getElementById(String(lineId))
//     const widthOfLine = calculateWidthForText(contentElement, lineElement.textContent)
//     startingRange = {
//         lineId: Number(lineId),
//         topOffset: lineElement.offsetTop,
//         leftOffset: widthOfLine,
//         fullText: lineElement.textContent
//     }
//     textSelection.setStartingPoint(startingRange)

// }

// window.addEventListener('mousemove', (event) => {
//     if (barVerticalIsSelected) {
//         verticalScrollingOnWindowMouseMove(event)
//     }
//     else if (barHorizontalIsSelected) {
//         horizontalScrollingOnWindowMouseMove(event)
//     }
//     else if (isTextSelecting) {
//         pageYMousePosition = event.pageY
//         const range = document.getSelection().getRangeAt(0)
//         if (startingRange == null) {
//             buildStartingRange(range)
//         }
//         else {
//             selectText(range, event)
//         }
//     }
// })

// /**
//  * 
//  * @param {MouseEvent} event 
//  */
// function verticalScrollingOnWindowMouseMove(event) {
//     const widthOfScreen = mainContainer.offsetWidth
//     const xPosition = event.pageX
//     if (widthOfScreen < xPosition) {
//         const widthOfAreaAllowedToScrollOutsideOfScreen = scrollbarAreaElementVertical.offsetWidth
//         const mouseOutsideOfScreenInPx = xPosition - widthOfScreen
//         const isAllowedToScroll = mouseOutsideOfScreenInPx <= widthOfAreaAllowedToScrollOutsideOfScreen
//         if (isAllowedToScroll) {
//             verticalScrolling(event)
//             searchReplaceHandler.updateOnScrolling()
//         }
//     }
// }

// /**
//  * 
//  * @param {MouseEvent} event 
//  */
// function horizontalScrollingOnWindowMouseMove(event) {
//     const heightOfScreen = mainContainer.offsetHeight
//     const yPosition = event.pageY
//     if (heightOfScreen < yPosition) {
//         const heightOfAreaAllowedToScrollOutsideOfScreen = scrollbarAreaElementHorizontal.offsetHeight
//         const mouseOutsideOfScreenInPx = yPosition - heightOfScreen
//         const isAllowedToScroll = mouseOutsideOfScreenInPx <= heightOfAreaAllowedToScrollOutsideOfScreen
//         if (isAllowedToScroll) {
//             horizontalScrolling(event)
//         }
//     }
// }

// function buildStartingRange(range) {
//     startingRange = range
//     const leftOffsetDTO = new CaretLeftOffsetDTO(range.endContainer.parentElement, range.endContainer.parentElement.offsetLeft, range.endOffset)
//     const offset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, contentElement)
//     const id = range.startContainer.parentElement.parentElement.id
//     const topOffset = range.startContainer.parentElement.parentElement.offsetTop
//     startingRange = {
//         lineId: Number(id),
//         topOffset: topOffset,
//         leftOffset: offset,
//         fullText: range.startContainer.parentElement.parentElement.textContent
//     }
//     textSelection.setStartingPoint(startingRange)
// }

// /**
//  * 
//  * @param {Range} range 
//  * @param {Event} event 
//  */
// function selectText(range, event) {
//     textSelection.setEndingRange(range)
//     const mousePosition = textSelection.defineMousePosition(event)
//     if (mousePosition == MousePosition.BOTTOM || mousePosition == MousePosition.TOP)
//         autoScroll(mousePosition)
//     else if (mousePosition == MousePosition.LEFT || mousePosition == MousePosition.RIGHT)
//         autoScrollHorizontallyOnTextSelection(mousePosition)
//     else {
//         selectTextInCentreSection(mousePosition)
//     }
// }

// function autoScroll(mousePosition) {
//     clearInterval(intervalHorizontalId)
//     intervalHorizontalId = null
//     if (intervalId) return
//     intervalId = setInterval(() => {
//         buildMarker()
//         scroll(mousePosition)
//         if (loaderHandler.topOffset >= loaderHandler.maxTopOffset || loaderHandler.topOffset <= loaderHandler.minTopOffset) {
//             clearInterval(intervalId)
//             intervalId = null
//         }
//     }, 50)
// }

// function scroll(mousePosition) {
//     textSelectionScrolling.scrollOnMousePosition(mousePosition)
//     textSelection.selectText(pageYMousePosition, linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
//     textSelection.setLoaderOffset(loaderHandler.topOffset)
// }

// function autoScrollHorizontallyOnTextSelection(mousePosition) {
//     clearInterval(intervalId)
//     intervalId = null
//     if (intervalHorizontalId) return
//     intervalHorizontalId = setInterval(() => {
//         scrollHorizontallyOnTextSelection(mousePosition)
//         if (contentScrollingHandler.leftOffset <= contentScrollingHandler.maxLeftOffset || contentScrollingHandler.leftOffset >= contentScrollingHandler.minLeftOffset) {
//             clearInterval(intervalHorizontalId)
//             intervalHorizontalId = null
//         }
//     }, 50)
// }

// function scrollHorizontallyOnTextSelection(mousePosition) {
//     if (mousePosition == MousePosition.LEFT) {
//         contentScrollingHandler.scrollWithOffset(-25)
//         const percentage = contentScrollingHandler.getPerentageOfScroll()
//         barHorizontalHandler.scrollBasedOnPercentage(percentage)
//     }
//     else if (mousePosition == MousePosition.RIGHT) {
//         contentScrollingHandler.scrollWithOffset(25)
//         const percentage = contentScrollingHandler.getPerentageOfScroll()
//         barHorizontalHandler.scrollBasedOnPercentage(percentage)
//     }
//     buildMarker()
//     textSelection.selectText(pageYMousePosition, linesLoader.firstVisibleLine, linesLoader.lastVisibleLine)
// }

// function selectTextInCentreSection(mousePosition) {
//     buildMarker()
//     scroll(mousePosition)
//     clearInterval(intervalId)
//     intervalId = null
//     clearInterval(intervalHorizontalId)
//     intervalHorizontalId = null
// }

// function buildMarker() {
//     removeExistingHighlighter()
//     const newMarker = document.createElement('div')
//     newMarker.classList.add('marker')
//     newMarker.setAttribute('id', 'marker')
//     placer.prepend(newMarker)
// }

// mainContainer.addEventListener('mousedown', (event) => {
//     if (isTextSelecting == false && barHorizontalIsSelected == false && barVerticalIsSelected == false)
//         removeExistingHighlighter()
// })

// function removeExistingHighlighter() {
//     const markerElement = document.getElementById('marker')
//     if (markerElement)
//         markerElement.remove()
// }

// window.addEventListener('keydown', (event) => {
//     const isClickingF = event.key.toLowerCase() == "f"
//     const isCopiingText = event.ctrlKey && event.key.toLowerCase() == "c"
//     if (event.ctrlKey && isClickingF) {
//         event.preventDefault()
//         if (document.getElementById('marker')) {
//             const selectedText = textSelection.selectTextOnCopyCommand(text).text
//             searchReplaceHandler.setSelectedText(selectedText)
//             searchReplaceHandler.setTextToSearchField()
//         }
//         searchReplaceHandler.changeVisibility()
//     }
//     else if (isCopiingText) {
//         event.preventDefault()
//         const selectedText = textSelection.selectTextOnCopyCommand(text).text
//         searchReplaceHandler.setSelectedText(selectedText)
//     }
//     else handleCaretMovement(event)
// })

// /**
//  * 
//  * @param {MouseEvent} event 
//  */
// function handleCaretMovement(event) {
//     const caret = document.getElementById('caret')
//     if (caret) {
//         const isScrollable = isCaretMovementScrollable(event)
//         if (isScrollable)
//             scrollOnScrollable()
//         caretMover.moveCaretBasedOnKeybordKey(event, caret)
//     }
// }

// function isCaretMovementScrollable(event) {
//     if (event.key == "Control") return false
//     const isUsingCtrl = event.ctrlKey
//     const isArrowUp = event.key == "ArrowUp"
//     const isArrowDown = event.key == "ArrowDown"
//     const isCtrlUp = isUsingCtrl && isArrowUp
//     const isCtrlDown = isUsingCtrl && isArrowDown
//     const isScrollable = isCtrlDown == false && isCtrlUp == false
//     return isScrollable
// }

// function scrollOnScrollable() {
//     const caretTopOffset = caret.offsetTop
//     const lineId = Math.round(caretTopOffset / lineHeightInPixels)
//     if (lineId < linesLoader.firstVisibleLine || lineId > linesLoader.lastVisibleLine) {
//         scrollForCaretMovementOnLineId(lineId, caretTopOffset)
//     }
// }

// function scrollForCaretMovementOnLineId(lineId, caretTopOffset) {
//     if (loaderHandler.topOffset > caretTopOffset) {
//         scrollUp(lineId)
//     }
//     else {
//         scrollDown(lineId)
//     }
//     updateElementsPositionsOnScreen()
// }

// function scrollUp(lineId) {
//     const offsetForFirstVisibleLine = (lineId - 5) * lineHeightInPixels
//     const offsetToScroll = loaderHandler.topOffset - offsetForFirstVisibleLine
//     loaderHandler.scrollWithOffset(-offsetToScroll)
// }

// function scrollDown(lineId) {
//     const offsetForLastVisibleLine = (lineId + 5) * lineHeightInPixels
//     const offsetForFirstVisibleLine = offsetForLastVisibleLine - scrollbarVerticalHeight
//     const offsetToScroll = offsetForFirstVisibleLine - loaderHandler.topOffset
//     loaderHandler.scrollWithOffset(offsetToScroll)
// }

// function updateElementsPositionsOnScreen() {
//     const percentage = loaderHandler.getPercentageOfScroll()
//     barVerticalHandler.scrollBasedOnPercentage(percentage)
//     linesLoader.reloadLinesForNewTopOffset(loaderHandler.topOffset)
// }

// window.addEventListener('resize', () => {
//     removeExistingHighlighter()
//     displayVerticalScrollbar()
//     displayHorizontalScrollbar()
//     maxVisibleLinesOnScreen = Math.ceil(mainContainer.offsetHeight / lineHeightInPixels)
//     loaderHeightInLines = lines > maxVisibleLinesOnScreen - 1 ? (lines + maxVisibleLinesOnScreen - 1) : lines
//     loaderHeight = loaderHeightInLines * lineHeightInPixels
//     loaderElement.style.height = `${loaderHeight}px`
//     linesLoader.updateMaxVisibleLinesOnScreen(maxVisibleLinesOnScreen)
//     linesLoader.resizeLines()
//     caretMover.updateScreenWidth()
//     const scrollbarVerticalHeight = scrollbarElementVertical.offsetHeight

//     loaderHandler.updateHeights(loaderHeight, scrollbarVerticalHeight)
//     barVerticalHandler.updateHeights(scrollbarVerticalHeight, barVerticalElement.offsetHeight)
//     barHorizontalHandler.updateWidths(scrollbarElementHorizontal.offsetWidth, barHorizontalElement.offsetWidth)
//     contentScrollingHandler.updateMaxLeftOffset(lineContentElement.scrollWidth, scrollbarHorizontalLeftOffset, barHorizontalWidth)
//     const newTotalWidthOfScreen = loaderElement.offsetWidth + lineNumerationWidth
//     textSelection.updateWidths(newTotalWidthOfScreen, contentElementOffsetLeft)
// })

// writerElement.addEventListener('input', (event) => {
//     if (event.data != null) {
//         const selectedText = checkIfThereIsMarker()
//         writerHandler.insertText(event.data, selectedText)
//         text = writerHandler.textToWorkWith
//     }
// })

// writerElement.addEventListener('keydown', (event) => {
//     const isSelectingTheWholeText = event.ctrlKey && event.key.toLowerCase() == "a"
//     const ixRemovingTextByCopiingIt = event.ctrlKey && event.key.toLowerCase() == "x"
//     if (event.key.toLowerCase() == "backspace") {
//         const selectedText = checkIfThereIsMarker()
//         writerHandler.removeText(selectedText)
//         text = writerHandler.textToWorkWith
//     }
//     else if (event.key.toLowerCase() == "enter") {
//         const selectedText = checkIfThereIsMarker()
//         writerHandler.insertText('\n', selectedText)
//         text = writerHandler.textToWorkWith
//     }
//     else if (event.key.toLowerCase() == "z" && event.ctrlKey && event.shiftKey) {
//         const oldText = codeChangesHistoryHandler.goForward()
//         writerHandler.textToWorkWith = oldText
//         searchReplaceHandler.updateText(oldText)
//         text = writerHandler.textToWorkWith
//     }
//     else if (event.key.toLowerCase() == "z" && event.ctrlKey) {
//         const oldText = codeChangesHistoryHandler.goBack()
//         writerHandler.textToWorkWith = oldText
//         searchReplaceHandler.updateText(oldText)
//         text = writerHandler.textToWorkWith
//     }
//     else if (isSelectingTheWholeText) {
//         buildMarker()
//         textSelection.selectWholeText(linesLoader.firstVisibleLine, linesLoader.lastVisibleLine, text)
//     }
//     else if (ixRemovingTextByCopiingIt) {
//         const selectedText = checkIfThereIsMarker()
//         writerHandler.removeTextOnCtrlX(selectedText)
//         text = writerHandler.textToWorkWith
//     }
// })

// function checkIfThereIsMarker() {
//     const marker = document.getElementById('marker')
//     let selectedText = ""
//     if (marker) {
//         selectedText = textSelection.selectTextOnCopyCommand(text)
//         return selectedText
//     }
//     return null
// }

import AppRunner from "./src/classes/appRunner.js"

const startApp = document.getElementById('start-app')
const mainContainer = document.getElementById('container')

const appRunner = new AppRunner()

startApp.addEventListener('click', () => {
    const emptyScreen = document.getElementById('empty-screen')
    mainContainer.className = 'editor'
    emptyScreen.className = 'hidden'
    appRunner.runFile('app.js')
})