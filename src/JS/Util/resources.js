import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Simulator from '../simulator';
import { LoadingManager } from 'three';

export default class Resources {

    _collection = {};

    constructor({ onLoad }) {
        this._simulation = new Simulator();

        const loadingManager = new LoadingManager(
            (e) => {
                onLoad(this._collection)
                console.log('loaded')
            }
        );

        const dracoLoader = new DRACOLoader(loadingManager)
        dracoLoader.setDecoderPath('/draco/')

        const gltfLoader = new GLTFLoader(loadingManager)
        // gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(
            './models/Car.gltf',
            (gltf) => {
                const obj = new THREE.Group();
                const offset = new THREE.Vector3(0, -0.2, 0.1)
                while (gltf.scene.children.length) {
                    gltf.scene.children[0].position.add(offset)
                    gltf.scene.children[0].receiveShadow = true
                    obj.add(gltf.scene.children[0])
                }
                this._collection['car'] = obj;
            }
        )
        gltfLoader.load(
            './models/Car Tyre Front.gltf',
            gltf => {
                const obj = new THREE.Group();
                gltf.scene.children[0].rotation.y = Math.PI;
                gltf.scene.children[0].castShadow = true;
                obj.add(gltf.scene.children[0]);
                this._collection['tyreFront'] = obj;
            }
        )
        gltfLoader.load(
            './models/Car Tyre Rear.gltf',
            gltf => {
                const obj = new THREE.Group();
                gltf.scene.children[0].rotation.y = Math.PI
                gltf.scene.children[0].castShadow = true;
                obj.add(gltf.scene.children[0])
                this._collection['tyreRear'] = obj;
            }
        )
        gltfLoader.load(
            './models/Car Steering Wheel.gltf',
            gltf => {
                const obj = new THREE.Group();
                // gltf.scene.children[0].castShadow = true;
                obj.add(gltf.scene.children[0])
                this._collection['steeringWheel'] = obj;
            }
        )
    }
}
