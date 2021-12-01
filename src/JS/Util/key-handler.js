export default class KeyHandler {
    _keys = {}

    constructor() {
        window.onkeydown = this._keyDown.bind(this);
        window.onkeyup = this._keyUp.bind(this);
    }

    _keyDown(e) {
        this._keys[e.key] = true;
    }

    _keyUp(e) {
        this._keys[e.key] = false;
    }
}
