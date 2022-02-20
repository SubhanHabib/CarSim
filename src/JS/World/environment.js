import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Simulator from "../simulator";
import Mapper from '../Physics/mapper';

export default class Environment {
    constructor() {
        this._simulation = new Simulator();

        const ObjectMapper = new Mapper();
        this._addLighting();

        this.groundMaterial = new CANNON.Material("groundMaterial");
        this.groundMaterial.friction = 0.7

        const floorGeo = new THREE.PlaneGeometry(1, 1);
        floorGeo.rotateX(- Math.PI * 0.5)
        const floor = new THREE.Mesh(
            floorGeo,
            new THREE.MeshStandardMaterial({
                color: new THREE.Color('#636c75'),
                metalness: 0.3,
                roughness: 0.6,
                side: THREE.DoubleSide,
                // depthWrite: false,
                // depthTest: false
            })
        )

        // floor.receiveShadow = true
        floor.position.y = -10
        this._simulation.scene.add(floor)

        const material = new THREE.ShadowMaterial();
        material.opacity = 0.2;

        const plane = new THREE.Mesh( floorGeo, material );
        // plane.position.y = -200;
        plane.position.y = -10
        plane.receiveShadow = true;
        this._simulation.scene.add( plane );


        const ground2 = new CANNON.Body({ mass: 0, material: this.groundMaterial });
        ground2.addShape(new CANNON.Plane());
        ground2.position.y = -10;
        ground2.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI / 2)
        this._simulation.world.addBody(ground2);

    }

    _terrain() {
        console.log('matrix', 0)
        const matrix = [];
        const sizeX = 30,
            sizeY = 30;
        for (let i = 0; i < sizeX; i++) {
            matrix.push([]);
            for (let j = 0; j < sizeY; j++) {
                var height = Math.cos(i / sizeX * Math.PI * 2) * Math.cos(j / sizeY * Math.PI * 2) + 2;
                if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1)
                    height = 3;
                matrix[i].push(height);
            }
        }
        console.log('matrix', matrix)


        var hfShape = new CANNON.Heightfield(matrix, {
            elementSize: 1.5
        });
        var ground = new CANNON.Body({ mass: 0, material: this.groundMaterial });
        ground.addShape(hfShape);
        ground.position.set(-sizeX * hfShape.elementSize / 2, -10, 20);
        ground.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI / 2)
        this._simulation.world.addBody(ground);
        const obj = ObjectMapper.addVisuals({ body: ground })
        this._simulation.scene.add(obj)
    }

    _addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this._simulation.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6)
        directionalLight.castShadow = true
        directionalLight.shadow.bias = -0.001
        directionalLight.shadow.mapSize.set(4096, 4096)
        directionalLight.shadow.camera.far = 250
        directionalLight.shadow.camera.near = 50

        directionalLight.shadow.camera.top = 100
        directionalLight.shadow.camera.right = 100
        directionalLight.shadow.camera.bottom = -100
        directionalLight.shadow.camera.left = -100

        directionalLight.position.set(40, 100, 80)
        this._simulation.scene.add(directionalLight)
        // const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
        // this._simulation.scene.add( helper );
        // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
        // this._simulation.scene.add(directionalLightCameraHelper)
        // this._simulation._debug.gui.add(directionalLight.shadow.camera, 'far', 0, 2000, 1).name('directionalLight far');
        // this._simulation._debug.gui.add(directionalLight.shadow.camera, 'near', 0, 10, 1).name('directionalLight near');
    }
}
