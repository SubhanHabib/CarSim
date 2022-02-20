import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Simulator from "../simulator";
import Mapper from '../Physics/mapper';
import Scene from './scene';

export default class Environment {
    constructor() {
        this._simulation = new Simulator();
        this._scene = new Scene();

        const ObjectMapper = new Mapper();

        this.groundMaterial = new CANNON.Material("groundMaterial");
        this.groundMaterial.friction = 0.7

        const floorGeo = new THREE.PlaneGeometry(100,100);
        floorGeo.rotateX(- Math.PI * 0.5)
        const floor = new THREE.Mesh(
            floorGeo,
            new THREE.MeshStandardMaterial({
                color: new THREE.Color('#636c75'),
                metalness: 0.3,
                roughness: 0.6,
                side: THREE.DoubleSide,
            })
        )

        // floor.receiveShadow = true
        // floor.position.y = -10
        this._simulation.scene.add(floor)

        const material = new THREE.ShadowMaterial();
        material.opacity = 0.15;


        const plane = new THREE.Mesh(floorGeo, material);
        // plane.position.y = -200;
        // plane.position.y = -10
        plane.receiveShadow = true;
        this._simulation.scene.add(plane);

        const ground2 = new CANNON.Body({ mass: 0, material: this.groundMaterial });
        ground2.addShape(new CANNON.Plane());
        // ground2.position.y = -10;
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
}
