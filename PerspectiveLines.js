const velocity = .3

class PerspectiveLines {
    constructor() {
        this.start = 96
        this.height = 48
        this.end = this.start - this.height
    }
    updateVelocity() {
        this.start += velocity * streetCanvas.height
    }
    adjustSizeByDistance() {
        this.height = (this.start - street.skyAdjust)/2
    }
    updateEnd() {
        this.end = this.start - this.height
    }
}