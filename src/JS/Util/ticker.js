export default class Ticker {
    constructor() {
        this._tick();
    }

    _tick() {
        window.requestAnimationFrame(this._tick.bind(this));
    }
}
