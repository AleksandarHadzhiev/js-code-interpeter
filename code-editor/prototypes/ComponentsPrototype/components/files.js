import sheet from './files.css' with {type: 'css'}
import LoadStylesFromCSS from "../../loadStylesFromCSS.js";
import SIdebarAPIHandler from '../../API_Calls/sidebar_calls.js';
import CustomFileReader from './file-reader.js';

const loader = new LoadStylesFromCSS(sheet.rules)
const apiHandler = new SIdebarAPIHandler()
const classes = loader.getClasses()

class IconIdentifier {
    constructor(fileName) {
        this.fileName = fileName
        this.directoryIconPath = "./icons/directory.png"
        this.supportedLanguages = [
            {
                language: ".js",
                icon: "./icons/js_file.png"
            },
            {
                language: ".html",
                icon: "./icons/html_file.png"
            },
            {
                language: ".css",
                icon: "./icons/css_file.png"
            },
            {
                language: ".txt",
                icon: "./icons/txt_file.png"
            },
            {
                language: ".ts",
                icon: "./icons/ts_file.png"
            }
        ]
    }

    getIconPath() {
        let iconPath = ""
        this.supportedLanguages.forEach(supported => {
            if (this.fileName.endsWith(supported.language)) {
                iconPath = supported.icon
            }
        });
        if (!String(this.fileName).includes('.')) {
            return this.directoryIconPath
        }
        return iconPath
    }
}

class CustomFilesContainer extends HTMLElement {
    constructor() {
        super()
        const filesContainer = this.buildMainContainer()
        this.appendChild(filesContainer)
    }

    buildMainContainer() {
        const filesContainer = document.createElement('div')
        filesContainer.style = `${classes.files}`
        this.buildFiles(filesContainer)
        return filesContainer
    }

    buildFiles(filesContainer) {
        const response = apiHandler.loadFilesForProject()
        response.then(async (data) => {
            const content = await data.json()
            const files = content.files
            files.forEach(fileName => {
                const file = this.buildFile(fileName)
                this.handleDragAndDrop(file)
                this.handleClickAction(file)
                filesContainer.appendChild(file)
            });
        })
    }

    handleDragAndDrop(file) {
        file.ondragstart = (event) => {
            event.dataTransfer.setData('id', event.target.id)
        }

        file.ondragover = (event) => {
            event.preventDefault()
        }

        file.ondrop = (event) => {
            event.preventDefault()
            event.stopPropagation()
            const id = event.dataTransfer.getData('id')
            const folderId = event.currentTarget.id
            if (!String(folderId).includes('.')) {
                const dropdown = this.buildDropDown(id, folderId)
                file.appendChild(dropdown)
            } else {
                alert("Your action is not allowed. Can not drop folder/file inside a file.")
            }
        }
    }

    handleClickAction(file) {
        file.onclick = (event) => {
            const fileName = event.currentTarget.id
            if (String(fileName).includes('.'))
                this.openFile(fileName)
            else {
                this.handleOpenClosedDropdown(fileName)
            }
        }
    }

    openFile(fileName) {
        console.log(fileName)
        const container = document.getElementById('container')
        const fileReader = this.buildReader(fileName)
        container.appendChild(fileReader)
    }

    buildReader(fileName) {
        let fileReader = document.getElementById('custom-reader')
        if (fileReader) {
            fileReader.remove()
        }
        fileReader = new CustomFileReader(String(fileName))
        fileReader.style = `${classes.reader}`
        fileReader.setAttribute('id', 'custom-reader')
        return fileReader
    }

    buildFile(fileName) {
        const file = document.createElement('div')
        file.setAttribute('id', fileName)
        file.style = `${classes.file}`
        file.setAttribute('draggable', true)
        this.buildFileElement(fileName, file)
        return file
    }

    buildFileElement(fileName, file) {
        const header = document.createElement('div')
        header.style = `${classes.header}`
        header.setAttribute('id', `header-${fileName}`)
        this.handleActionElementHover(header)
        this.buildIcon(fileName, header)
        this.buildFileName(fileName, header)
        file.appendChild(header)
    }

    handleActionElementHover(header) {
        header.addEventListener('mouseenter', () => {
            header.style = `${classes.header} opacity:0.5;`
        })
        header.addEventListener('mouseleave', () => {
            header.style = `${classes.header}`
        })
    }

    buildIcon(fileName, header) {
        const iconIdentifier = new IconIdentifier(fileName)
        const path = iconIdentifier.getIconPath()
        if (path) {
            const icon = this.buildIconImage(path)
            header.appendChild(icon)
        }
    }
    buildIconImage(path) {
        const icon = document.createElement('img')
        icon.style = `${classes.icon}`
        icon.src = path
        icon.alt = "Icon for the language"
        return icon
    }

    buildFileName(fileName, header) {
        const name = document.createElement('p')
        name.textContent = fileName
        name.style = `${classes["file-name"]}`
        header.appendChild(name)
    }

    buildDropDown(id, folderId) {
        let dropdown = document.getElementById(`dropdown-${folderId}`)
        if (!dropdown) {
            dropdown = document.createElement('div')
            dropdown.setAttribute('id', `dropdown-${folderId}`)
            dropdown.style = `${classes.dropdown}`
        }
        this.handleOpenClosedDropdown(folderId)

        const file = document.getElementById(id)
        file.style = `${classes['innder-file']}`
        dropdown.appendChild(file)
        return dropdown
    }

    handleOpenClosedDropdown(fileName) {
        const header = document.getElementById(`header-${fileName}`)

        const opened = document.getElementById(`opened-${fileName}`)
        const closed = document.getElementById(`closed-${fileName}`)
        if (opened) {
            opened.remove()
            this.dropDownForFolderClosed(fileName, header)
        }
        else if (closed) {
            closed.remove()
            this.dropDownForFolderOpened(fileName, header)
        }
    }

    dropDownForFolderOpened(fileName, header) {
        if (!String(fileName).includes('.')) {
            const dropwdownArrow = document.createElement('img')
            dropwdownArrow.src = '../icons/dropdown_opened.png'
            dropwdownArrow.alt = 'Dropdown is closed'
            dropwdownArrow.setAttribute('id', `opened-${fileName}`)
            dropwdownArrow.style = `${classes['dropdown-arrow']}`
            header.appendChild(dropwdownArrow)
        }
    }

    dropDownForFolderClosed(fileName, header) {
        if (!String(fileName).includes('.')) {
            const dropwdownArrow = document.createElement('img')
            dropwdownArrow.src = '../icons/dropdown_closed.png'
            dropwdownArrow.alt = 'Dropdown is closed'
            dropwdownArrow.setAttribute('id', `closed-${fileName}`)
            dropwdownArrow.style = `${classes['dropdown-arrow']}`
            header.appendChild(dropwdownArrow)
        }
    }

}

customElements.define('custom-files-container', CustomFilesContainer);
