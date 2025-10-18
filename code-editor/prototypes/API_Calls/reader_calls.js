export default class ReaderAPIHandler {
    constructor() {
        this.BASE_URL = 'http://127.0.0.1:5000'
    }

    openFile(fileName) {
        return fetch(`${this.BASE_URL}/read-file/${fileName}`, { method: "GET" })
    }


    saveFileContent(fileName, content) {
        console.log(content)
        return fetch(`${this.BASE_URL}/save-file/${fileName}`, {
            method: "POST",
            body: JSON.stringify(content),
            headers: {
                "Content-Type": "application/json"
            }
        })

    }
}

