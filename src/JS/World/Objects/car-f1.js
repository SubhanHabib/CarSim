import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { MeshStandardMaterial } from 'three';
import Car from './car';

export default class F1Car extends Car {
    constructor(world, scene) {
        const scale = 0.25;
        const wheelOptions = {
            radius: 1 * scale,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.2,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 1000 * scale,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1 * scale, 1 * scale, 0),
            maxSuspensionTravel: 0.2,
            customSlidingRotationalSpeed: 30,
            useCustomSlidingRotationalSpeed: true,
        }
        const carOptions = {
            // Main body
            size: [2 * scale, 0.5 * scale, 5.3 * scale],
            mass: 800 * scale,
            scale,
            // Wheels
            wheelMass: 25 * scale,
            wheelOptions,
            axleWidth: 0.75 * scale,
            frontAxelOffset: 1.6 * scale,
            rearAxelOffset: -2 * scale,
            // Driving
            maxSteeringVal: 0.2,
            steeringSpeed: 0.5,
            engineForce: 350,
            brakeForce: 50,
        }
        super({world, scene, wheelOptions, carOptions});
    }

    _createSteerimgWheel() {
        this._steeringWheel = this._simulation.resources.steeringWheel
        this._steeringWheel.position.set(0, 0.25, 0.41)
        this._car.add(this._steeringWheel)
    }

    _createBrakeLight() {
        this._brakeLight = {
            geometry: new THREE.PlaneGeometry(0.0175, 0.015),
            material: new MeshStandardMaterial({
                color: 0x100404,
                emissive: 0x000000
            })
        }
        const brakeLight = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const mesh = new THREE.Mesh(this._brakeLight.geometry, this._brakeLight.material)
                mesh.position.set(0.025 * i, 0.025 * j, 0);
                brakeLight.add(mesh)
            }
        }
        brakeLight.rotation.y = Math.PI;
        brakeLight.position.set(0.025, 0.085, -2.57);
        this._car.add(brakeLight)
    }

    _setBrakeLight(braking = false) {
        this._brakeLight.material.color = new THREE.Color(braking ? 0x303030 : 0x100404)
        this._brakeLight.material.emissive = new THREE.Color(braking ? 0xff0000 : 0x000000)
    }
}
