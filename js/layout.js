export class Layout {
    constructor() {
        this.rangeInput = document.getElementById('layout-input')
        this.rangeInput.oninput = () => this.changeHueValue()
    }

    changeHueValue() {
        document.documentElement.style.cssText = `--hue: ${this.rangeInput.value}`
    }
}