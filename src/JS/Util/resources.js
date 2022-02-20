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
            gltf => {
                // gltf.scene.scale.set(0.001, 0.001, 0.001); 

                // gltf.scene.scale.set(.001*gltf.scene.scale.x, .001*gltf.scene.scale.y, .001 * gltf.scene.scale.z)
                // gltf.scene.updateWorldMatrix(true) 
                const obj = new THREE.Group();
                const offset = new THREE.Vector3(0, -0.2, 0.1)
                const scale = new THREE.Vector3(0.5, 0.5, 0.5)
                // obj.updateWorldMatrix(true) 
                // gltf.scene.scale.set(0.5, 0.5, 0.5); 
                obj.scale.set(0.25, 0.25, 0.25);
                while (gltf.scene.children.length) {
                    gltf.scene.children[0].position.add(offset)
                    // gltf.scene.children[0].scale.set(scale)
                    // gltf.scene.children[0].receiveShadow = true
                    obj.add(gltf.scene.children[0])
                    // obj.scale.set(.001*gltf.scene.scale.x, .001*gltf.scene.scale.y, .001 * gltf.scene.scale.z)
                }
                this._collection['car'] = obj;
                // this._collection['car'].scale.set(scale)
            }
        )

        gltfLoader.load(
            './models/Car Tyre Front.gltf',
            gltf => {        
                gltf.scene.scale.set(0.25, 0.25, 0.25);
                gltf.scene.children[0].rotation.y = Math.PI;
                gltf.scene.children[0].castShadow = true;
                this._collection['tyreFront'] = gltf.scene;
            }
        )

        gltfLoader.load(
            './models/Car Tyre Rear.gltf',
            gltf => {
                gltf.scene.scale.set(0.25, 0.25, 0.25);
                gltf.scene.children[0].rotation.y = Math.PI
                gltf.scene.children[0].castShadow = true;
                this._collection['tyreRear'] = gltf.scene;
            }
        )

        gltfLoader.load(
            './models/Car Steering Wheel.gltf',
            gltf => {
                // gltf.scene.scale.set(0.5, 0.5, 0.5); 
                this._collection['steeringWheel'] = gltf.scene;
            }
        )
    }
}
