import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import Simulator from '../../simulator';
import { MeshStandardMaterial } from 'three';

export default class F1Car {
    _vehicle = null;

    _options = {
        radius: 1,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 30,
        suspensionRestLength: 0.2,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 1000,
        rollInfluence:  0.01,
        axleLocal: new CANNON.Vec3(-1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.2,
        customSlidingRotationalSpeed: 30,
        useCustomSlidingRotationalSpeed: true,
    }

    constructor(world, scene,) {
        this._simulation = new Simulator();
        this._showHelper = false;
        this.obj = this._simulation.resources.car;
        this.tyre = this._simulation.resources.tyre;
        this._world = world;
        this._scene = scene;

        this._createCamera();
        this._createShadowTexture();

        this._createChassis();
        this._createVehicle();
        this._createSteerimgWheel();
        this._createWheels();
        this._createBrakeLight();
        this._keyLoop();

        this._hud = {
            rpm: document.querySelector('.hud .hud__rpm .rpm__value'),
            gear: document.querySelector('.hud .hud__gear'),
            kmh: document.querySelector('.hud .hud__kmh .kmh__value'),
            revCounter: document.querySelectorAll('.hud .hud__leds .hud__led')
        }
    }

    _createCamera() {
        const cameraRear = new THREE.PerspectiveCamera(60, this._simulation._sizes.width / this._simulation._sizes.height, 0.1, 1000);
        this.obj.add(cameraRear)
        cameraRear.position.set(0, 6, -16);
        cameraRear.rotation.x = 0.35;
        cameraRear.rotation.y = Math.PI;
        this._simulation._camera.addCamera(cameraRear)

        const camera = new THREE.PerspectiveCamera(70, this._simulation._sizes.width / this._simulation._sizes.height, 0.1, 1000);
        this.obj.add(camera)
        camera.position.set(0, 2.2, -1.3);
        camera.rotation.x = 0.3;
        camera.rotation.y = Math.PI;
        this._simulation._camera.addCamera(camera)

        // this._simulation._debug.gui.add(camera, 'fov', 40, 120).onChange(() => {
        //     camera.updateProjectionMatrix();
        // });
        // this._simulation._debug.gui.add(camera.position, 'x', 0, 5);
        // this._simulation._debug.gui.add(camera.position, 'y', 0, 5);
        // this._simulation._debug.gui.add(camera.position, 'z', -5, 0);
        // this._simulation._debug.gui.add(camera.rotation, 'x', 0, Math.PI, 0.02);
        // this._simulation._debug.gui.add(camera.rotation, 'y', 0, Math.PI, 0.02);
        // this._simulation._debug.gui.add(camera.rotation, 'z', 0, Math.PI, 0.02);
    }

    _createSteerimgWheel() {
        this._steeringWheel = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.6, 0.05),
            new MeshStandardMaterial({
                color: 0x080403,
                emissive: 0x000000
            })
        )
        this._steeringWheel.position.set(0, 0.7, 0.8)
        this._simulation._debug.gui.add(this._steeringWheel.position, 'x', -1, 1, 0.1);
        this._simulation._debug.gui.add(this._steeringWheel.position, 'y', -1, 1, 0.1);
        this._simulation._debug.gui.add(this._steeringWheel.position, 'z', -1, 1, 0.1);
        // this._simulation._debug.gui.add(this._steeringWheel.rotation, 'x', -1, 1, 0.1);
        // this._simulation._debug.gui.add(this._steeringWheel.rotation, 'y', -1, 1, 0.1);
        // this._simulation._debug.gui.add(this._steeringWheel.rotation, 'z', -1, 1, 0.1);
        this.obj.add(this._steeringWheel)
    }

    _createShadowTexture() {
        this.textureLoader = new THREE.TextureLoader()
        const texture = this.textureLoader.load('/textures/Car Shadow.png')
        this._shadowPlane = new THREE.Group();
        
        const scale = 4;
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(9.6 * scale, 10.8 * scale),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                alphaMap: texture
            })
        )
        plane.rotation.x = -Math.PI/2
        plane.position.y = -0.95
        plane.position.z = -1.2
        // plane.scale.set(new THREE.Vector3(2.0, 2.0, 2.0))
        this._shadowPlane.add(plane)
        this._simulation.scene.add(this._shadowPlane)
    }

    _createTyreShadow() {
        if (!this.tyreShadows) this.tyreShadows = []
        if (!this.tyreTexture) this.tyreTexture = this.textureLoader.load('/textures/Car Tyre Shadow.png')
        if (!this.tyreMaterial) this.tyreMaterial = new THREE.MeshBasicMaterial({
            // color: 0x000000,
            // transparent: true,
            map: this.tyreTexture,
            blending: THREE.MultiplyBlending
        })

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 6),
            this.tyreMaterial
        )
        plane.rotation.x = -Math.PI/2
        plane.position.y = -0.98
        plane.position.z = -0.4
        const shadow = new THREE.Group();
        shadow.add(plane);
        this.tyreShadows.push(shadow)
        this._simulation.scene.add(shadow)
    }

    reset() {
        this._chassisBody.position.set(0, 0.2, 0);
    }

    _setHUD() {
        const mph = this._vehicle.currentVehicleSpeedKmHour / 1.6;
        const reverse = mph < 0
        const revCounter = Math.floor(Math.abs(mph) % 30 / 3);
        // console.log(revCounter)
        this._hud.revCounter.forEach((el, i) => {
            // console.log(el, i)
            el.classList.toggle('red', i <= revCounter)
        })
        this._hud.rpm.textContent = Math.floor(Math.floor(Math.abs(mph) % 30) * 500)
        this._hud.gear.textContent = 
            mph < 1 && mph > -1
                ? 'N'
                : reverse
                ? 'R'
                : mph < 30
                    ? '1'
                : mph < 60
                    ? '2'
                : mph < 90
                    ? '3'
                : mph < 120
                    ? '4'
                : mph < 150
                    ? '5'
                : mph < 180
                    ? '6'
                : mph < 210
                    ? '7'
                    : '8'
        this._hud.kmh.textContent = `${Math.abs(Math.floor(mph < 2 && mph > -2 ? 0 : mph))}`
    }
    
    _createBrakeLight() {
        this._brakeLight = {
            geometry: new THREE.PlaneGeometry(0.07, 0.06),
            material: new MeshStandardMaterial({
                color: 0x100404,
                emissive: 0x000000
            })
        }
        const brakeLight = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const mesh = new THREE.Mesh(this._brakeLight.geometry, this._brakeLight.material)
                mesh.position.set(0.1 * i, 0.1 * j, 0);
                brakeLight.add(mesh)
            }
        }
        brakeLight.rotation.y = Math.PI;
        brakeLight.position.set(0.1, -0.05, -9.28);
        this.obj.add(brakeLight)
    }

    _setBrakeLight(braking = false) {
        this._brakeLight.material.color = new THREE.Color(braking ? 0x303030 : 0x100404)
        this._brakeLight.material.emissive = new THREE.Color(braking ? 0xff0000 : 0x000000)
    }

    _createChassis() {
        var chassisShape = new CANNON.Box(new CANNON.Vec3(3, 1, 10));
        var chassisBody = new CANNON.Body({mass: 650});
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 0.2, 0);
        chassisBody.angularVelocity.set(0, 0, 0); // initial velocity
        this._chassisBody = chassisBody;
    }

    _createVehicle() {
        this._vehicle = new CANNON.RaycastVehicle({
            chassisBody: this._chassisBody,
            indexRightAxis: 0, // x
            indexUpAxis: 1, // y
            indexForwardAxis: 2, // z
        });
    }

    _createWheels() {
        var axlewidth = 3;
        const frontAxelOffset = 6;
        const rearAxelOffset = -7;
        [
            { x: axlewidth,  z: rearAxelOffset  },
            { x: -axlewidth, z: rearAxelOffset  },
            { x: axlewidth,  z: frontAxelOffset },
            { x: -axlewidth, z: frontAxelOffset }
        ].forEach(({x, z}) => {
            this._options.chassisConnectionPointLocal.set(x, 0, z);
            this._vehicle.addWheel(this._options);
        });
        this._vehicle.addToWorld(this._world);

        this._car = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 19));
        if (this._showHelper) this._scene.add(this._car)

        const wheelFrontGeometry = new THREE.CylinderGeometry(1, 1, 0.305*4, 16)
        const wheelRearGeometry = new THREE.CylinderGeometry(1, 1, 0.405*4, 16)
        wheelFrontGeometry.rotateZ(Math.PI/2);
        wheelRearGeometry.rotateZ(Math.PI/2);
        const wheelMaterial = new THREE.MeshStandardMaterial({color: 0x101010});
        const createWheel = isRearAxel => {
            this._createTyreShadow();
            return this.tyre.clone();
            // const mesh = new THREE.Mesh(isRearAxel ? wheelRearGeometry : wheelFrontGeometry, wheelMaterial)
            // mesh.castShadow = true
            // return mesh;
        }
        
        const carWheels = []
        const wheelBodies = [];
        const wheelPhysicsMaterial = new CANNON.Material("wheelMaterial");
        this._vehicle.wheelInfos.forEach((wheel, i) => {
            const shape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius * 1.5, 10);
            const body = new CANNON.Body({ mass: 25, material: wheelPhysicsMaterial });
            const q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            body.addShape(shape, new CANNON.Vec3(), q);
            wheelBodies.push(body);
            carWheels.push(createWheel(i < 2));
        });
        this._scene.add(...carWheels);

        // update the wheels to match the physics
        this._world.addEventListener('postStep', () => {
            // this._vehicle.updateWheelTransform(i);
            // console.log(this._vehicle.wheelInfos[0].worldTransform.quaternion.w)
            for (let i = 0; i < this._vehicle.wheelInfos.length; i++) {
                this._vehicle.updateWheelTransform(i);
                const t = this._vehicle.wheelInfos[i].worldTransform;
                // update wheel physics
                wheelBodies[i].position.copy(t.position);
                wheelBodies[i].quaternion.copy(t.quaternion);
                // update wheel visuals
                carWheels[i].position.copy(t.position);
                carWheels[i].quaternion.copy(t.quaternion);
                this.tyreShadows[i].position.copy(t.position);
                // this.tyreShadows[i].quaternion.copy(t.quaternion);
                // this.tyreShadows[i].rotation.x = -Math.PI/2



    //   vehicle.updateWheelTransform(i)
    //   let t: CANNON.Transform = vehicle.wheelInfos[i].worldTransform
    //   let wheelBody: CANNON.Body = wheelBodies[i]
    //   wheelBody.position.copy(t.position)
    //   wheelBody.quaternion.copy(t.quaternion)
    //   wheels[i].getComponent(Transform).position.copyFrom(wheelBodies[i].position)
    //   wheels[i].getComponent(Transform).rotation.copyFrom(wheelBodies[i].quaternion)
            }
        });
    }

    /**
     * Ease Steering
     */
    _isSteering = 0;
    _maxSteerVal = 0.7;
    _steeringInterpolation(t) {
        const easeSine = t => Math.sin((t* Math.PI) / 2);
        t = easeSine(t);
        return 0 * (1 - t) + this._maxSteerVal * t;
    }
    /**
     * @param {number} direction (-1 = left, 1 = right)
     */
    _getSteeringValue(direction, onUpdate) {
        if (direction === undefined) {
            if (this._isSteering < 0)
                this._isSteering = Math.min(0.0, this._isSteering + 0.1)
            else if (this._isSteering > 0)
                this._isSteering = Math.max(0.0, this._isSteering - 0.1)
        } else {
            direction > 0
                ? this._isSteering = Math.min(1.0, this._isSteering + 0.1)
                : this._isSteering = Math.max(-1.0, this._isSteering - 0.1)
        }
        onUpdate(this._steeringInterpolation(this._isSteering));
    }

    _keyLoop() {
        requestAnimationFrame(() => this._setHUD())

        const engineForce = 7000;
        const brakeForce = 300;

        this._setBrakeLight(false)
        this._vehicle.setBrake(0, 0);
        this._vehicle.setBrake(0, 1);
        this._vehicle.setBrake(0, 2);
        this._vehicle.setBrake(0, 3);

        // Braking
        if (this._simulation.keys[' ']) {
            this._setBrakeLight(true)
            this._vehicle.setBrake(brakeForce, 2);
            this._vehicle.setBrake(brakeForce, 3);
        }

        // Acceleration
        if (this._simulation.keys['w'] || this._simulation.keys['ArrowUp']) {
            this._vehicle.applyEngineForce(-engineForce, 0);
            this._vehicle.applyEngineForce(-engineForce, 1);
        } else if (this._simulation.keys['s'] || this._simulation.keys['ArrowDown']) {
            this._vehicle.applyEngineForce(engineForce/2, 0);
            this._vehicle.applyEngineForce(engineForce/2, 1);
        } else {
            this._vehicle.applyEngineForce(0, 0);
            this._vehicle.applyEngineForce(0, 1);
        }

        // Steering
        if (this._simulation.keys['a'] || this._simulation.keys['ArrowLeft']) {
            this._getSteeringValue(1, steeringVal => {
                // console.log(steeringVal)
                this._steeringWheel.rotation.z = -steeringVal
                this._vehicle.setSteeringValue(steeringVal, 2);
                this._vehicle.setSteeringValue(steeringVal, 3);
            })
        } else if (this._simulation.keys['d'] || this._simulation.keys['ArrowRight']) {
            this._getSteeringValue(-1, steeringVal => {
                this._steeringWheel.rotation.z = -steeringVal
                this._vehicle.setSteeringValue(steeringVal, 2);
                this._vehicle.setSteeringValue(steeringVal, 3);
            })
        } else {
            this._getSteeringValue(undefined, steeringVal => {
                this._steeringWheel.rotation.z = -steeringVal
                this._vehicle.setSteeringValue(steeringVal, 2);
                this._vehicle.setSteeringValue(steeringVal, 3);
            })
        }

        setTimeout(() => this._keyLoop(), 10);
    }

    clock = new THREE.Clock();
    oldElapsedTime = 0;

    onTick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.oldElapsedTime;
        this.oldElapsedTime = elapsedTime;
        this._world.step(1 / 60, deltaTime, 3);
        // console.log(this._vehicle.wheelInfos[2].worldTransform.quaternion)

        this.obj.position.copy(this._chassisBody.position);
        this.obj.quaternion.copy(this._chassisBody.quaternion);
        this._car.position.copy(this._chassisBody.position);
        this._car.quaternion.copy(this._chassisBody.quaternion);
        
        this._shadowPlane.position.copy(this._chassisBody.position);
        this._shadowPlane.quaternion.copy(this._chassisBody.quaternion);

    }
}
