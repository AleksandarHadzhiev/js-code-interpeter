// import reservedWords from './keywords/javascript.json' with { type: "json" }
const fullDisplay = document.getElementById('body')
fullDisplay.style.zoom = "1"

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === "f") {
        event.preventDefault()
    }
    else if (event.ctrlKey && event.key === "+") {
        event.preventDefault()
        fullDisplay.style.zoom = Number(fullDisplay.style.zoom) + 0.2
    }
    else if (event.ctrlKey && event.key === "-") {
        event.preventDefault()
        fullDisplay.style.zoom = Number(fullDisplay.style.zoom) - 0.2
    }
})

// class IconIdentifier {
//     constructor(fileName) {
//         this.fileName = fileName
//         this.directoryIconPath = "./icons/directory.png"
//         this.supportedLanguages = [
//             {
//                 language: ".js",
//                 icon: "./icons/js_file.png"
//             },
//             {
//                 language: ".html",
//                 icon: "./icons/html_file.png"
//             },
//             {
//                 language: ".css",
//                 icon: "./icons/css_file.png"
//             },
//             {
//                 language: ".txt",
//                 icon: "./icons/txt_file.png"
//             },
//             {
//                 language: ".ts",
//                 icon: "./icons/ts_file.png"
//             }
//         ]
//     }

//     getIconPath() {
//         let iconPath = ""
//         this.supportedLanguages.forEach(supported => {
//             console.log(this.fileName, supported)
//             console.log(this.fileName.endsWith(supported.language))
//             if (this.fileName.endsWith(supported.language)) {
//                 iconPath = supported.icon
//             }
//         });
//         if (!String(this.fileName).includes('.')) {
//             return this.directoryIconPath
//         }
//         return iconPath
//     }
// }

// // CONTENT DISPLAYS
// const files = document.getElementById('files')
// const fileReader = document.getElementById('file-reader')


// // API CALLS
// function changeDirectory(fileName, directoryName) {
//     fetch(`http://127.0.0.1:5000/change-directory-of/${fileName}/to/${directoryName}`, { method: "GET" })
//         .then(async (res) => {
//             const content = await res.json()
//             console.log(content.files)
//             readFiles(content.files)
//         }).catch((err) => {
//             console.log(err)
//         }).finally(() => {
//             console.log("FINALLy")
//         });
// }

// // INITIAL CALLS
// // will have a specific name attached to itself later
// function loadFilesForProject() {
//     fetch(`http://127.0.0.1:5000/get-all-files`, { method: "GET" })
//         .then(async (res) => {
//             const content = await res.json()
//             console.log(content.files)
//             readFiles(content.files)
//         }).catch((err) => {
//             console.log(err)
//         }).finally(() => {
//             console.log("FINALLy")
//         });
// }

// function readFiles(fechedFiles) {
//     if (fechedFiles != []) {
//         files.replaceChildren()
//         fechedFiles.forEach(fetchedFile => {
//             addFileToFiles(fetchedFile)
//         });
//     }
// }

// function buildIconImage(path) {
//     const icon = document.createElement('img')
//     icon.classList.add('icon')
//     icon.src = path
//     icon.alt = "Icon for the language"
//     return icon
// }

// function addIcon(fileName, file) {
//     const iconIdentifier = new IconIdentifier(fileName)
//     const path = iconIdentifier.getIconPath()
//     console.log(path)
//     if (path) {
//         const icon = buildIconImage(path)
//         file.appendChild(icon)
//     }
// }

// function addFileName(fileName, file) {
//     const name = document.createElement('p')
//     name.textContent = fileName
//     name.classList.add('file-name')
//     file.appendChild(name)
// }

// function dropDownForFolderClosed(fileName, header) {
//     if (!String(fileName).includes('.')) {
//         const dropwdownArrow = document.createElement('img')
//         dropwdownArrow.src = './icons/dropdown_closed.png'
//         dropwdownArrow.alt = 'Dropdown is closed'
//         dropwdownArrow.setAttribute('id', `closed-${fileName}`)
//         dropwdownArrow.classList.add('dropdown-arrow')
//         header.appendChild(dropwdownArrow)
//     }
// }

// function dropDownForFolderOpened(fileName, header) {
//     if (!String(fileName).includes('.')) {
//         const dropwdownArrow = document.createElement('img')
//         dropwdownArrow.src = './icons/dropdown_opened.png'
//         dropwdownArrow.alt = 'Dropdown is closed'
//         dropwdownArrow.setAttribute('id', `opened-${fileName}`)
//         dropwdownArrow.classList.add('dropdown-arrow')
//         header.appendChild(dropwdownArrow)
//     }
// }

// function buildFileElement(fileName, file) {
//     const header = document.createElement('div')
//     header.classList.add('header')
//     header.setAttribute('id', `header-${fileName}`)
//     addIcon(fileName, header)
//     addFileName(fileName, header)
//     dropDownForFolderClosed(fileName, header)
//     file.appendChild(header)
// }

// function buildDropDown(id, folderId) {
//     let dropdown = document.getElementById(`dropdown-${folderId}`)
//     if (!dropdown) {
//         dropdown = document.createElement('div')
//         dropdown.setAttribute('id', `dropdown-${folderId}`)
//         dropdown.classList.add('dropdown')
//     }
//     handleOpenClosedDropdown(folderId)
//     const file = document.getElementById(id)
//     file.classList.add('innder-file')
//     dropdown.appendChild(file)
//     return dropdown
// }

// function handleOpenClosedDropdown(fileName) {
//     const header = document.getElementById(`header-${fileName}`)

//     const opened = document.getElementById(`opened-${fileName}`)
//     const closed = document.getElementById(`closed-${fileName}`)
//     if (opened) {
//         opened.remove()
//         dropDownForFolderClosed(fileName, header)
//     }
//     else if (closed) {
//         closed.remove()
//         dropDownForFolderOpened(fileName, header)
//     }
// }

// // Will be a complete component not only paragraph
// function addFileToFiles(fileName) {
//     const file = document.createElement('div')
//     file.setAttribute('id', fileName)
//     file.onclick = (event) => {
//         if (String(fileName).includes('.'))
//             openFile(fileName)
//         else {
//             const dropdown = document.getElementById(`dropdown-${fileName}`)

//             if (dropdown && dropdown.classList.contains('dropdown-invisible')) {
//                 dropdown.classList.remove('dropdown-invisible')
//             }
//             else if (dropdown && !dropdown.classList.contains('dropdown-invisible')) {
//                 dropdown.classList.add('dropdown-invisible')
//             }
//             handleOpenClosedDropdown(fileName)
//         }
//     }

//     file.ondragstart = (event) => {
//         event.dataTransfer.setData('id', event.target.id)
//     }

//     file.ondragover = (event) => {
//         event.preventDefault()
//     }

//     file.ondrop = (event) => {
//         event.preventDefault()
//         event.stopPropagation()
//         const id = event.dataTransfer.getData('id')
//         const folderId = event.currentTarget.id
//         if (!String(folderId).includes('.')) {
//             const dropdown = buildDropDown(id, folderId)
//             console.log(dropdown)
//             file.appendChild(dropdown)
//         } else {
//             alert("Your action is not allowed. Can not drop folder/file inside a file.")
//         }
//     }

//     console.log("READING")
//     buildFileElement(fileName, file)
//     file.classList.add('file')
//     file.setAttribute('draggable', true)
//     files.append(file)
// }

// function createReader() {
//     const reader = document.createElement('ul')
//     reader.classList.add('reader')
//     reader.setAttribute('id', 'code-reader')
//     fileReader.appendChild(reader)
//     return reader
// }

// function createLineNumber(index) {
//     const lineNumber = document.createElement('p')
//     lineNumber.classList.add('line-number')
//     lineNumber.textContent = `${index}`
//     return lineNumber
// }

// function createCodeContent(content, index) {
//     const lineOfcode = document.createElement('div')
//     lineOfcode.setAttribute('contenteditable', true)
//     lineOfcode.classList.add('code')
//     lineOfcode.setAttribute('id', index)
//     const words = content.split(" ")
//     words.forEach(word => {
//         checkIfInListOfReservedWords(word, lineOfcode)
//     });
//     return lineOfcode
// }

// function buildWordWithDesiredColor(content, color) {
//     const word = document.createElement('span')
//     word.textContent = content
//     word.style.color = color
//     return word
// }

// function wordIsString(word) {
//     if (String(word).startsWith(`"`) && String(word).endsWith(`"`)) {
//         return "#4BA860"
//     }
//     return "#FFFFFF"
// }

// function checkIfInListOfReservedWords(word, lineOfCode) {
//     let isReservedWord = false
//     const checkWord = word.replace("\n", "")
//     reservedWords.reservedWords.forEach(reservedWord => {
//         if (reservedWord.word == checkWord) {
//             const element = buildWordWithDesiredColor(checkWord, reservedWord.color)
//             lineOfCode.appendChild(element)
//             isReservedWord = true
//         }

//     });
//     if (isReservedWord === false) {
//         let color = wordIsString(word.replace(`'`, ""))
//         if (!isNaN(checkWord)) {
//             color = "#b5b5b5ff"
//         }
//         const element = buildWordWithDesiredColor(checkWord, color)
//         lineOfCode.appendChild(element)
//     }

// }

// function createLineOfCode(content, index) {
//     const lineOfCode = document.createElement('li')
//     lineOfCode.classList.add('line-of-code')
//     const codeContent = createCodeContent(content, index)
//     const lineNumber = createLineNumber(index)
//     lineOfCode.appendChild(lineNumber)
//     lineOfCode.appendChild(codeContent)
//     return lineOfCode
// }

// function cleanReader() {
//     const reader = document.getElementById('code-reader')
//     if (reader) {
//         reader.remove()
//     }
// }

// function deleteOldCode(id) {
//     const oldCode = document.getElementById(id)
//     oldCode.remove()
// }

// function createNewCode(id, lineOfCode) {
//     const newCode = document.createElement('input')
//     newCode.value = lineOfCode
//     newCode.setAttribute('id', id)
//     newCode.onblur = (event) => {
//         console.log(event.target.value)
//     }
//     return newCode
// }

// function editLineContent(id, lineOfCode) {
//     deleteOldCode(id)
//     return createNewCode(id, lineOfCode)
// }

// function loadContent(content) {
//     cleanReader()
//     if (content != []) {
//         const reader = createReader()
//         content.forEach((lineOfCode, index) => {
//             const code = createLineOfCode(lineOfCode, index)
//             // code.onclick = (event) => {
//             //     event.preventDefault()
//             //     const newCode = editLineContent(index, lineOfCode)
//             //     code.appendChild(newCode)
//             //     newCode.focus()

//             // }
//             reader.appendChild(code)
//         });
//     }
// }

// function openFile(fileName) {
//     fetch(`http://127.0.0.1:5000/read-file/${fileName}`, { method: "GET" })
//         .then(async (res) => {
//             const content = await res.json()
//             loadContent(content.content)
//         }).catch((err) => {
//             console.log(err)
//         }).finally(() => {
//             console.log("FINALLy")
//         });
// }

// function buildFile(fileName) {
//     fetch("http://127.0.0.1:5000/create-file", {
//         method: "POST",
//         body: JSON.stringify({
//             userId: 1,
//             title: "Fix my bugs",
//             completed: false,
//             name: fileName
//         }),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     }).then((res) => {
//         console.log(res)
//     }).catch((err) => {
//         console.log(err)
//     }).finally(() => {
//         console.log("FINALLy")
//     });
// }

// function buildFolder(folderName) {
//     fetch("http://127.0.0.1:5000/create-folder", {
//         method: "POST",
//         body: JSON.stringify({
//             userId: 1,
//             title: "Fix my bugs",
//             completed: false,
//             name: folderName
//         }),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     }).then((res) => {
//         console.log(res)
//     }).catch((err) => {
//         console.log(err)
//     }).finally(() => {
//         console.log("FINALLy")
//     });
// }

// function createFile(fileNameProvider) {
//     if (files.contains(fileNameProvider)) {
//         const fileName = fileNameProvider.value
//         buildFile(fileName)
//         addFileToFiles(fileName)
//         files.removeChild(fileNameProvider)
//     }
// }

// function createFolder(folderNameProvider) {
//     if (files.contains(folderNameProvider)) {
//         const folderName = folderNameProvider.value
//         buildFolder(folderName)
//         addFileToFiles(folderName)
//         files.removeChild(folderNameProvider)
//     }
// }

// function createFileNameProvidingField() {
//     const fileNameProvider = document.createElement('input')
//     fileNameProvider.classList.add('file-name-provider')
//     fileNameProvider.onblur = () => {
//         createFile(fileNameProvider)
//     }
//     files.appendChild(fileNameProvider)
// }

// function createFolderNameProvidingField() {
//     const folderNameProvider = document.createElement('input')
//     folderNameProvider.classList.add('file-name-provider')
//     folderNameProvider.onblur = () => {
//         createFolder(folderNameProvider)
//     }
//     files.appendChild(folderNameProvider)
// }

// // createFileButton.onclick = (event) => {
// //     event.preventDefault()
// //     createFileNameProvidingField()
// // }

// // createFolderButton.onclick = (event) => {
// //     event.preventDefault()
// //     createFolderNameProvidingField()
// // }

// // RUN INITIAL CALLS
// loadFilesForProject()
