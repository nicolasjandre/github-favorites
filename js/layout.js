export class Layout {
    constructor() {
        this.rangeInput = document.getElementById('layout-input')
        this.rangeInput.oninput = () => this.changeHueValue()

        this.load()
    }

    changeHueValue() {
        document.documentElement.style.cssText = `--hue: ${this.rangeInput.value}`
        this.save()
    }

    load() {
        this.rangeInput.value = JSON.parse(localStorage.getItem('@layout-range:')) || []
        document.documentElement.style.cssText = `--hue: ${this.rangeInput.value}`
    }

    save() {
        localStorage.setItem('@layout-range:', this.rangeInput.value)
    }
}