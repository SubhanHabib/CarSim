import * as dat from 'dat.gui';
import * as THREEConfig from './config.js'

export default class Debug {
    constructor() {
        // console.log(THREEConfig.isDebug)
        // if (THREEConfig.isDebug)
            this._gui = new dat.GUI();
        this._debugObject = {};
    }

    get gui() { return this._gui; }

    addObject(name, func) {
        this._debugObject[name] = func;
        this._gui?.add(this._debugObject, name);
    }
}
