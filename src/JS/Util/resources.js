import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Simulator from '../simulator';

export default class Resources {
    
    _collection = {};

    constructor({ onLoad }) {
        this._onLoad = onLoad;
        this._simulation = new Simulator();

        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')

        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        let mixer = null

        gltfLoader.load(
            '/models/Car.gltf',
            (gltf) => {
                const obj = new THREE.Group();
                const offset = new THREE.Vector3(0, -0.2, 0.1)
                while (gltf.scene.children.length) {
                    gltf.scene.children[0].position.add(offset)
                    // gltf.scene.children[0].castShadow = true
                    // gltf.scene.children[0].receiveShadow = true
                    // gltf.scene.children[0].material.encoding = THREE.sRGBEncoding
                    // gltf.scene.children[0].material.wireframe = true

                    obj.add(gltf.scene.children[0])
                }
                // obj.castShadow = true;
                this._collection['car'] = obj;
                this._onLoad(this._collection)

                // obj.receiveShadow = true
                // gltf.scene.children[0].material.encoding = THREE.sRGBEncoding
                // this._simulation.scene.add(obj)
                // this._physics.createCar(obj)
            }
        )
        gltfLoader.load(
            '/models/Car Tyre Rear.gltf',
            (gltf) => {
                const obj = new THREE.Group();
                const offset = new THREE.Vector3(0, -0.2, 0.1)

                console.log(gltf.scene.children[0])
                // gltf.scene.children[0].position.add(offset)
                gltf.scene.children[0].rotation.y = Math.PI
                gltf.scene.children[0].castShadow = true
                obj.add(gltf.scene.children[0])
                // this._simulation.scene.add(obj)
                this._collection['tyre'] = obj;
                // this._collection['tyre'] = gltf.scene.children[0];
            }
        )


    }
}

