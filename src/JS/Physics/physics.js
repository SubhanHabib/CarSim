

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import Simulator from '../simulator';
import F1Car from '../World/Objects/car';
import Mapper from './mapper';

export default class Physics {
    constructor() {
        this._simulation = new Simulator();
        this._createWorld();


        const ObjectMapper = new Mapper();
        // const obj = ObjectMapper.createSphere({world: this._world, scene: this._simulation.scene})
        // this.o = obj
    }

    createCar() {
        this._car = new F1Car(this._world, this._simulation.scene)
    }

    get world() { return this._world; }

    _createWorld() {
        this._world = new CANNON.World()
        this._world.broadphase = new CANNON.SAPBroadphase(this._world)
        this._world.gravity.set(0, -9.82, 0);
        this._world.defaultContactMaterial.friction = 0.0;

        const groundMaterial = new CANNON.Material("groundMaterial");
        const wheelMaterial = new CANNON.Material("wheelMaterial");
        const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
            friction: 0.7,
            restitution: 0.5,
            contactEquationStiffness: 1000
        });
        this._world.addContactMaterial(wheelGroundContactMaterial);

        this.clock = new THREE.Clock();
        this.oldElapsedTime = 0;
    }

    onTick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.oldElapsedTime;
        this.oldElapsedTime = elapsedTime;
        this._world.step(1 / 60, deltaTime, 3);

        if (this._car) this._car.onTick();
        // this.o.mesh.position.copy(this.o.body.position)
    }
}
