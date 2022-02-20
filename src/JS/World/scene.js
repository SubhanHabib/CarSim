import * as THREE from 'three';
import Simulator from '../simulator';

export default class Scene {
    constructor() {
        this._simulation = new Simulator();
        this._createWorldLights();
        this._createSceneLights();
    }

    _createWorldLights() {
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        this._simulation.scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        this._simulation.scene.add( dirLight );
    }

    _createSceneLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
        this._simulation.scene.add(ambientLight);
    }
}
