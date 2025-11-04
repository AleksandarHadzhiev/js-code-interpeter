const container = document.getElementById('container')

const messages = {
    notAFolder: "The path you are trying to move the module to is not a directory, but a file."
}

console.log(container)

const filesAndFoldersNames = [
    "index.html", "style.css", "app.js", "Folder_One", "Folder_2", "Folder_3", "index.js", "app.html"
]

function buildHeader(moduleName) {
    const moduleHeader = document.createElement('div')
    moduleHeader.classList.add('header')
    const name = document.createElement('p')
    name.textContent = moduleName
    moduleHeader.appendChild(name)
    return moduleHeader
}

function buildContainer(idOfDropPosition) {
    let moduleContainer = document.getElementById(`container-${idOfDropPosition}`)
    if (!moduleContainer) {
        moduleContainer = document.createElement('div')
        moduleContainer.setAttribute('id', `container-${idOfDropPosition}`)
        moduleContainer.classList.add('module-container')
    }
    return moduleContainer
}

function buildModuleChildrenContainer(idOfElementToDrop, idOfDropPosition) {
    const moduleContainer = buildContainer(idOfDropPosition)
    const module = buildModule(idOfElementToDrop)
    module.classList.add('line-bend')
    moduleContainer.appendChild(module)
    return moduleContainer
}

function deleteNotificationAfterBeingVisible(notification) {
    setTimeout(() => {
        notification.remove()
    }, [2000])
}

function buildNotification(message) {
    const notification = document.createElement('div')
    const notificationText = document.createElement('p')
    notificationText.textContent = message
    notificationText.classList.add('notification-text')
    notification.appendChild(notificationText)
    notification.classList.add('notification')
    deleteNotificationAfterBeingVisible(notification)
    container.appendChild(notification)
}

function buildModule(name) {
    const module = document.createElement('div')
    module.classList.add('module')
    if (document.getElementById(name)) document.getElementById(name).remove()
    module.setAttribute('id', name)
    const moduleHeader = buildHeader(name)
    module.appendChild(moduleHeader)
    module.setAttribute('draggable', true)
    handleModuleDragAndDrop(module)
    return module
}

function isFolder(id) {
    if (String(id).includes('.')) {
        return false
    }
    return true
}

function handleModuleDragAndDrop(module) {
    module.ondragstart = (event) => {
        console.log("Starting")
        event.dataTransfer.setData('id', event.target.id)
    }

    module.ondragover = (event) => {
        event.preventDefault()
    }

    module.ondrop = (event) => {
        event.preventDefault()
        event.stopPropagation()
        console.log("DROPPED")
        console.log(event)

        const idOfElementToDrop = event.dataTransfer.getData('id')
        const idOfDropPosition = event.currentTarget.id
        if (isFolder(idOfDropPosition)) {
            console.log(idOfDropPosition)
            // Display container of child elements
            const modulebContainer = buildModuleChildrenContainer(idOfElementToDrop, idOfDropPosition)
            module.appendChild(modulebContainer)
        } else {
            // Display notification
            buildNotification(messages.notAFolder)
        }
    }
}

function loadFilesForProject() {
    filesAndFoldersNames.forEach((name) => {
        console.log(name)
        const module = buildModule(name)
        container.appendChild(module)
    })
}

loadFilesForProject()