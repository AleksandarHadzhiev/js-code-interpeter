const contentElement = document.getElementById('content')

contentElement.addEventListener('mousedown', (event) => {
    console.log(event.currentTarget)
    console.log(event.target)
})

contentElement.addEventListener('mouseup', (event) => {
    console.log(event.currentTarget)
    console.log(event.target)
})

contentElement.addEventListener('mousemove', (event) => {
    console.log(event.currentTarget)
    console.log(event.target)
})
