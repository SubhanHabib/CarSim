import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

import Simulator from "../simulator";

export default class Camera {
    _cameras = [];
    _activeCamera = -1;

    constructor() {
        this._simulation = new Simulator();
        this._initSceneCamera();

        window.addEventListener('keydown', e => {
            if (e.key === 'c') this._toggleCamera();
        })
    }

    addCamera(camera) {
        const length = this._cameras.push(camera)
        return length - 1;
    }

    _initSceneCamera() {
        const camera = new THREE.PerspectiveCamera(40, this._simulation._sizes.width / this._simulation._sizes.height, 0.1, 1000);
        camera.position.set(4, 4, -10);
        this._simulation.scene.add(camera);
    
        this._controls = new OrbitControls(camera, this._simulation.canvas);
        this._controls.enableDamping = true;
        this._controls.zoomSpeed = 0.5;

        const i = this._cameras.push(camera);
        this._activeCamera = 0;
    }

    _toggleCamera() {
        this._activeCamera = this._cameras.length === 1
            ? 0
            : this._activeCamera < this._cameras.length - 1
                ? this._activeCamera = this._activeCamera + 1
                : 0;
    }

    onResize() {
        this._cameras.forEach(camera => {
            camera.aspect = this._simulation._sizes.width / this._simulation._sizes.height;
            camera.updateProjectionMatrix();
        })
    }
    
    onTick() {
        this._controls.update();
    }
}
