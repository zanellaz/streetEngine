const streetCanvas = document.getElementById('street')
const sc = streetCanvas.getContext("2d", { alpha: false });

let canvasHeight = streetCanvas.clientHeight
let canvasWidth = streetCanvas.clientWidth
let pWidth = canvasHeight/48

const velocity = .1

class PerspectiveLine {
    constructor() {
        this.start = 97
        // this.height = 97
        // this.end = this.start - this.height
    }
    updateVelocity() {
        this.start += velocity * streetCanvas.height
    }
    adjustSizeByDistance() {
        this.height = (this.start)/2
    }
    updateEnd() {
        this.end = this.start - this.height
    }
}

window.addEventListener('resize', () => {
    canvasHeight = streetCanvas.clientHeight
    canvasWidth = streetCanvas.clientWidth
    pWidth = canvasHeight/48
})

const half = .5
const middlePoint = .5
const streetWidth = .8
const finalPerspective = 8
let color
let velocityAcc = 0

const lines = []

lines.push(new PerspectiveLine())

function handleLines() {
    checkAmountOfLines()
    handleDistance()
}

function handleDistance() {
    lines[0].adjustSizeByDistance()
    lines[0].updateEnd()
    lines[0].updateVelocity()
    for (let i = 1; i < lines.length; i++) {
        const actualLine = lines[i];
        const lineBefore = lines[i-1]
        actualLine.start = lineBefore.end
        actualLine.adjustSizeByDistance()
        actualLine.updateEnd()
    }
}

let colorAdjust = false

function checkAmountOfLines() {
    const lastLine = lines[lines.length - 1]
    const firstLine = lines[0]
    const passedScreen = firstLine.end >= streetCanvas.height
    const lastHasSize = lastLine.height > 5
    if (!!!lastHasSize) {
        lines.splice(lines.length, 1)
    }
    else {
        lines.push(new PerspectiveLine())
    }
    if (passedScreen) {
        lines.splice(0, 1)
        lines[0].start = streetCanvas.height + velocity + pWidth
        handleDistance()
        colorAdjust = !colorAdjust
    }
}

function drawGrass() {
    for (let i = 0; i < lines.length-1; i++) {
        color = i % 2 === Number(colorAdjust) ? '#0a0' : '#090'
        const line = lines[i]
        const { start, end } = line
        sc.fillStyle = color
        sc.beginPath()
        sc.moveTo(0, start)
        sc.lineTo(0, end)
        sc.lineTo(canvasWidth, end)
        sc.lineTo(canvasWidth, start)
        sc.closePath()
        sc.fill()
    }
}

function pixel(x, y, color) {
    sc.fillStyle = color
    sc.fillRect(x, y, pWidth, pWidth)
}

function drawStreet() {
    handleLines()
    drawGrass()
    for (let x = 0; x < canvasWidth; x += pWidth) {
        for (let y = 0; y < canvasHeight; y += pWidth) {
            const perspectiveY = y / canvasHeight
            const roadWidth = (streetWidth/finalPerspective + perspectiveY * streetWidth) * half
            const clipWidth = roadWidth * 0.15
            const leftGrass = (middlePoint - roadWidth - clipWidth) * canvasWidth
            const rightGrass = (middlePoint + roadWidth + clipWidth) * canvasWidth
            const leftClip = (middlePoint - roadWidth) * canvasWidth
            const rightClip = (middlePoint + roadWidth) * canvasWidth
            if (y < 6) {
                color = 'white'
                pixel(x, y, color)
            }
            else if ((x >= leftGrass && x <= leftClip) || (x <= rightGrass && x >= rightClip)) {
                for (let i = 0; i < lines.length; i++) {
                    if (y < lines[i].start && y > lines[i].end) {                        
                        color = i % 2 == Number(colorAdjust) ? '#fff' : '#d00'
                        pixel(x, y, color)
                    }
                }
            }
            else if (x < rightClip && x > leftClip){
                for (let i = 0; i < lines.length; i++) {
                    if (y < lines[i].start && y > lines[i].end) {                        
                        color = i % 2 == Number(colorAdjust) ? '#666' : '#555'
                        pixel(x, y, color)
                    }
                }
            }
        }
    }
}

let frames = 0

setInterval(() => {
    const framesDiv = document.getElementById('frames')
    framesDiv.textContent = frames
    frames = 0
}, 1000);

createjs.Ticker.framerate = 30;
createjs.Ticker.addEventListener("tick", handleTick);

function handleTick(event) {
    frames += 1
    // sc.fillRect(0, 0, canvasWidth, canvasHeight, 'green');
    drawStreet()
}