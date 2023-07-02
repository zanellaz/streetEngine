const streetCanvas = document.getElementById('street')
const sc = streetCanvas.getContext("2d", { alpha: false });

let canvasHeight = streetCanvas.clientHeight
let canvasWidth = streetCanvas.clientWidth

let pWidth = canvasHeight/48

const pow = (value) => value * value

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

function pixel(x, y, color) {
    sc.fillStyle = color
    sc.fillRect(x, y, pWidth, pWidth);    
}

function drawStreet() {
    
    const velocity = .3
    velocityAcc += velocity

    for (let x = 0; x < canvasWidth; x += pWidth) {
        for (let y = 0; y < canvasHeight; y += pWidth) {
            const perspectiveY = y / canvasHeight
            const roadWidth = (streetWidth/finalPerspective + perspectiveY * streetWidth) * half
            const clipWidth = roadWidth * 0.15
            const leftGrass = (middlePoint - roadWidth - clipWidth) * canvasWidth
            const rightGrass = (middlePoint + roadWidth + clipWidth) * canvasWidth
            const leftClip = (middlePoint - roadWidth) * canvasWidth
            const rightClip = (middlePoint + roadWidth) * canvasWidth
            if (x < leftGrass || x > rightGrass) {
                if (perspectiveY < 0.001) {
                    color = '#008800'
                }
                if (perspectiveY > 0.015) {
                    color = '#009900'
                }
                if (perspectiveY > 0.05) {
                    color = '#00aa00'
                }
                if (perspectiveY > 0.1) {
                    color = '#00bb00'
                }
                if (perspectiveY > 0.2) {
                    color = '#00cc00'
                }
                if (perspectiveY > 0.4) {
                    color = '#00aa00'
                }
            }
            if (x > leftGrass && x < leftClip || x < rightGrass && x > rightClip) {
                const ruaAtual = Math.sin(10 * pow(1-(perspectiveY)) + velocityAcc)
                color = ruaAtual > 0 ? '#fff' : '#900'
            }
            if (x < rightClip && x > leftClip)
                color = '#555'       
            pixel(x, y, color)
        }
    }
}

let frames = 0

setInterval(() => {
    const framesDiv = document.getElementById('frames')
    framesDiv.textContent = frames
    frames = 0
}, 1000);

createjs.Ticker.framerate = 35;
createjs.Ticker.addEventListener("tick", handleTick);

function handleTick(event) {
    frames += 1
    drawStreet()
}