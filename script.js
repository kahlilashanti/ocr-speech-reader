const video = document.querySelector("video")
//print the text out to the screen
const textElem = document.querySelector("[data-text]")

async function setup() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream


    //listen for when the video is playing 
    video.addEventListener("playing", async () => {
        //worker is how Tesseract interacts
        worker = Tesseract.createWorker()
        //configure the worker
        await worker.load()
        //configure the worker to recognize the language
        await worker.loadLanguage('eng')
        //initializze worker
        await worker.initialize('eng')

        //in order for the worker to recognize an image we need to use canvas
        const canvas = document.createElement('canvas')
        canvas.width = video.width
        canvas.height = video.height

        //add an event listener so this fires whenever space bar is pressed
        document.addEventListener("keypress", async e => {
            if (e.code !== "Space") return
            //draw the entire video on the canvas
            //also gets the current frame of our video and puts it on the canvas
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
            //recognize the text thats in that image
            // const obj = await worker.recognize(canvas)
            const { data: { text } } = await worker.recognize(canvas)

            //make the computer read the text out loud
            //any place we have white space use regex to replace it with a normal space
            speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, "")))

            //print the text out to the screen
            textElem.textContent = text
            //print the text to console
            // console.log(text)
        })
    })
}



setup()