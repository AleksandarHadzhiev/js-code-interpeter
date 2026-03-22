export default class SIdebarAPIHandler {
    constructor() {
        this.BASE_URL = 'http://127.0.0.1:5000'
    }

    buildFile(endpoint) {
        fetch(`${this.BASE_URL}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify({
                userId: 1,
                title: "Fix my bugs",
                completed: false,
                name: "bob.js"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            console.log("FINALLy")
        });
    }

    buildFolder(endpoint) {
        fetch(`${this.BASE_URL}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify({
                userId: 1,
                title: "Fix my bugs",
                completed: false,
                name: "Folder 32"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            console.log("FINALLy")
        });
    }

    loadFilesForProject() {
        return fetch(`http://127.0.0.1:5000/get-all-files`, { method: "GET" })
        // .then(async (res) => {
        //     const content = await res.json()
        //     console.log(content.files)
        //     return await content.files
        // }).catch((err) => {
        //     console.log(err)
        // }).finally(() => {
        //     console.log("FINALLy")
        // });
    }

} 