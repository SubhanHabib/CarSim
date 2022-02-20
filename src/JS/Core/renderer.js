import * as THREE from 'three'
import * as THREEConfig from '../Util/config.js'

import Simulator from "../simulator";

export default class Renderer {
    constructor() {
        this._simulation = new Simulator();
        this._addRenderer();
        this._renderer.outputEncoding = THREE.sRGBEncoding
        this._renderer.physicallyCorrectLights = true
    }

    _addRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._simulation._canvas,
            alpha: true,
            antialias: true
        });
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.setSize(this._simulation._sizes.width, this._simulation._sizes.height);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    onResize() {
        this._renderer.setSize(this._simulation._sizes.width, this._simulation._sizes.height);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    onTick() {
        // console.log(this._simulation.camera)
        this._renderer.render(this._simulation._scene, this._simulation.camera);
    }
}


