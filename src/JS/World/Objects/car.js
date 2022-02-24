import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Simulator from '../../simulator';
import { MeshStandardMaterial } from 'three';

export default class Car {
    _vehicle = null;

    constructor({world, scene, wheelOptions, carOptions}) {
        this._simulation = new Simulator();
        this._showHelper = false;
        this._car = this._simulation.resources.car;
        this.tyreRear = this._simulation.resources.tyreRear;
        this.tyreFront = this._simulation.resources.tyreFront;
        this._world = world;
        this._scene = scene;
        this._wheelOptions = wheelOptions;
        this._carOptions = carOptions;

        this._createCamera();
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

        this._simulation._camera._controls.target = this._car.position;

        this._createLocalLight();
    }

    _createLocalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.castShadow = true
        // directionalLight.shadow.bias = -0.001
        // directionalLight.shadow.radius = 1.5
        directionalLight.shadow.mapSize.set(2048, 2048)
        directionalLight.shadow.camera.far = 80
        // directionalLight.shadow.camera.near = 1

        // directionalLight.shadow.camera.top = 5
        // directionalLight.shadow.camera.right = 5
        // directionalLight.shadow.camera.bottom = -5
        // directionalLight.shadow.camera.left = -5

        // directionalLight.position.set(20, 35, 20)
        directionalLight.position.set(0, 20, 0)
        this._car.add(directionalLight)
        const helper = new THREE.DirectionalLightHelper( directionalLight, 1 );
        // this._car.add(helper);
        this.light = directionalLight;
        const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
        // this._car.add(directionalLightCameraHelper)

        
        const directionalLight2 = new THREE.DirectionalLight(0xfefcff, 1.4)
        directionalLight2.position.set(20, 35, 20)
        this._car.add(directionalLight2)
    }

    _createCamera() {
        const cameraRear = new THREE.PerspectiveCamera(60, this._simulation._sizes.width / this._simulation._sizes.height, 0.1, 1000);
        this._car.add(cameraRear)
        cameraRear.position.set(0, 1.5, -4);
        cameraRear.rotation.x = 0.35;
        cameraRear.rotation.y = Math.PI;
        this._simulation._camera.addCamera(cameraRear)

        const camera = new THREE.PerspectiveCamera(70, this._simulation._sizes.width / this._simulation._sizes.height, 0.1, 1000);
        this._car.add(camera)
        camera.position.set(0, 0.8, -0.3);
        camera.rotation.x = 0.3;
        camera.rotation.y = Math.PI;
        this._simulation._camera.addCamera(camera)

        // this._simulation._debug.gui.add(camera, 'fov', 40, 120).onChange(() => {
        //     camera.updateProjectionMatrix();
        // });
        // this._simulation._debug.gui.add(camera.position, 'x', 0, 5);
        // this._simulation._debug.gui.add(camera.position, 'y', 0.5, 1.5, 0.05);
        // this._simulation._debug.gui.add(camera.position, 'z', -1, 0, 0.05);
        // this._simulation._debug.gui.add(camera.rotation, 'x', 0, Math.PI, 0.02);
        // this._simulation._debug.gui.add(camera.rotation, 'y', 0, Math.PI, 0.02);
        // this._simulation._debug.gui.add(camera.rotation, 'z', 0, Math.PI, 0.02);
    }

    _createSteerimgWheel() { throw new Error('Steering wheel not implemented!') }

    // _createChassisShadowTexture() {
    //     this.textureLoader = new THREE.TextureLoader()
    //     const texture = this.textureLoader.load('textures/Car Shadow.png')
    //     this._shadowPlane = new THREE.Group();

    //     const scale = 1;
    //     const plane = new THREE.Mesh(
    //         new THREE.PlaneGeometry(9 * scale, 9 * scale),
    //         new THREE.MeshBasicMaterial({
    //             color: 0x000000,
    //             transparent: true,
    //             alphaMap: texture,
    //             opacity: 0.3
    //         })
    //     )
    //     plane.rotation.x = -Math.PI / 2
    //     plane.position.y = -0.24 * this._carOptions.scale // vertical
    //     // plane.position.z = -0.2
    //     // this._simulation._debug.gui.add(plane.position, 'x', 0, Math.PI, 0.02);
    //     // this._simulation._debug.gui.add(plane.position, 'y', -0.5, 1.5, 0.05);
    //     // this._simulation._debug.gui.add(plane.position, 'z', -2, 2, 0.05);
    //     // plane.scale.set(new THREE.Vector3(2.0, 2.0, 2.0))
    //     this._shadowPlane.add(plane)
    //     // this._car.add(this._shadowPlane)
    // }

    // _createTyreShadow() {
    //     if (!this.tyreShadows) this.tyreShadows = []
    //     if (!this.tyreTexture) this.tyreTexture = this.textureLoader.load('textures/Car Tyre Shadow.png')
    //     if (!this.tyreMaterial) this.tyreMaterial = new THREE.MeshBasicMaterial({
    //         color: 0x000000,
    //         transparent: true,
    //         alphaMap: this.tyreTexture,
    //         alphaTest: 0.1,
    //         opacity: 0.2,
    //         blending: THREE.CustomBlending,
    //         blendSrc: THREE.OneFactor
    //     })

    //     const plane = new THREE.Mesh(
    //         new THREE.PlaneGeometry(1.4, 1.4),
    //         this.tyreMaterial,
    //     )
    //     plane.rotation.x = -Math.PI / 2;
    //     plane.position.y = -0.34;
    //     const shadow = new THREE.Group();
    //     shadow.add(plane);
    //     this.tyreShadows.push(shadow)
    //     // this._scene.add(shadow)
        
    //     // this._simulation._debug.gui.add(plane.position, 'y', -2, 2, 0.05).name('tyre y');
    //     // this._simulation._debug.gui.add(plane.quaternion, 'x', -2, 2, 0.01).name('TyreRotation y');
    //     // this._simulation._debug.gui.add(plane.quaternion, 'y', -2, 2, 0.01).name('TyreRotation y');
    //     // this._simulation._debug.gui.add(plane.quaternion, 'z', -2, 2, 0.01).name('TyreRotation y');
    //     // this._simulation._debug.gui.add(plane.quaternion, 'w', -2, 2, 0.01).name('TyreRotation y');
    // }

    reset() {
        this._chassisBody.position.set(0, 0.2, 0);
    }

    _setHUD() {
        const mph = this._vehicle.currentVehicleSpeedKmHour / 1.6;
        const reverse = mph < 0
        const revCounter = Math.floor(Math.abs(mph) % 30 / 3);
        this._hud.revCounter.forEach((el, i) => el.classList.toggle('red', i <= revCounter))
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

    _createChassis() {
        var chassisShape = new CANNON.Box(new CANNON.Vec3(this._carOptions.size[0] / 2, this._carOptions.size[1] / 2, this._carOptions.size[2] / 2));
        var chassisBody = new CANNON.Body({ mass: this._carOptions.mass });
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
        [
            { x: this._carOptions.axleWidth, z: this._carOptions.frontAxelOffset },
            { x: -this._carOptions.axleWidth, z: this._carOptions.frontAxelOffset },
            { x: this._carOptions.axleWidth, z: this._carOptions.rearAxelOffset },
            { x: -this._carOptions.axleWidth, z: this._carOptions.rearAxelOffset }
        ].forEach(({ x, z }) => {
            this._wheelOptions.chassisConnectionPointLocal.set(x, 0.11 * this._carOptions.scale, z);
            this._vehicle.addWheel(this._wheelOptions);
        });
        this._vehicle.addToWorld(this._world);

        this._carChassis = new THREE.Mesh(new THREE.BoxGeometry(...this._carOptions.size));
        if (this._showHelper) this._scene.add(this._carChassis)

        const createWheel = isRearAxel =>
            isRearAxel
                ? this.tyreRear.clone()
                : this.tyreFront.clone();

        const carWheels = []
        const wheelBodies = [];
        const wheelPhysicsMaterial = new CANNON.Material("wheelMaterial");
        wheelPhysicsMaterial.friction = 0
        this._vehicle.wheelInfos.forEach((wheel, i) => {
            const shape = new CANNON.Cylinder(wheel.radius * this._carOptions.scale, wheel.radius * this._carOptions.scale, wheel.radius * 1.5 * this._carOptions.scale, 16);
            const body = new CANNON.Body({ mass: this._carOptions.wheelMass, material: wheelPhysicsMaterial });
            const q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            body.addShape(shape, new CANNON.Vec3(), q);
            wheelBodies.push(body);
            carWheels.push(createWheel(i >= 2));
        });
        this._scene.add(...carWheels);

        // update the wheels to match the physics
        this._world.addEventListener('postStep', () => {
            for (let i = 0; i < this._vehicle.wheelInfos.length; i++) {
                this._vehicle.updateWheelTransform(i);
                const t = this._vehicle.wheelInfos[i].worldTransform;
                // update wheel physics
                wheelBodies[i].position.copy(t.position);
                wheelBodies[i].quaternion.copy(t.quaternion);
                // update wheel visuals
                carWheels[i].position.copy(t.position);
                carWheels[i].quaternion.copy(t.quaternion);
            }
        });
    }

    /**
     * Ease Steering
     */
    _isSteering = 0;
    _steeringInterpolation(t) {
        const easeSine = t => Math.sin((t * Math.PI) / 2);
        t = easeSine(t);
        return 0 * (1 - t) + this._carOptions.maxSteeringVal * t;
    }
    /**
     * @param {number} direction (-1 = left, 1 = right)
     */
    _getSteeringValue(direction, onUpdate) {
        if (direction === undefined) {
            if (this._isSteering < 0)
                this._isSteering = Math.min(0.0, this._isSteering + 0.1 * this._carOptions.steeringSpeed)
            else if (this._isSteering > 0)
                this._isSteering = Math.max(0.0, this._isSteering - 0.1 * this._carOptions.steeringSpeed)
        } else {
            direction > 0
                ? this._isSteering = Math.min(1.0, this._isSteering + 0.1 * this._carOptions.steeringSpeed)
                : this._isSteering = Math.max(-1.0, this._isSteering - 0.1 * this._carOptions.steeringSpeed)
        }
        onUpdate(this._steeringInterpolation(this._isSteering));
    }

    _keyLoop() {
        requestAnimationFrame(() => this._setHUD())

        this._setBrakeLight(false)
        this._vehicle.setBrake(0, 0);
        this._vehicle.setBrake(0, 1);
        this._vehicle.setBrake(0, 2);
        this._vehicle.setBrake(0, 3);

        // Braking
        if (this._simulation.keys[' ']) {
            this._setBrakeLight(true)
            this._vehicle.setBrake(this._carOptions.brakeForce, 2);
            this._vehicle.setBrake(this._carOptions.brakeForce, 3);
        }

        // Acceleration
        if (this._simulation.keys['w'] || this._simulation.keys['ArrowUp']) {
            if (this._vehicle.currentVehicleSpeedKmHour / 1.6 < 200) {
                this._vehicle.applyEngineForce(-this._carOptions.engineForce, 0);
                this._vehicle.applyEngineForce(-this._carOptions.engineForce, 1);
            } else {
                this._vehicle.applyEngineForce(0, 0);
                this._vehicle.applyEngineForce(0, 1);
            }
        } else if (this._simulation.keys['s'] || this._simulation.keys['ArrowDown']) {
            if (this._vehicle.currentVehicleSpeedKmHour / 1.6 > -40) {
                this._vehicle.applyEngineForce(this._carOptions.engineForce / 2, 0);
                this._vehicle.applyEngineForce(this._carOptions.engineForce / 2, 1);
            } else {
                this._vehicle.applyEngineForce(0, 0);
                this._vehicle.applyEngineForce(0, 1);
            }
        } else {
            this._vehicle.applyEngineForce(0, 0);
            this._vehicle.applyEngineForce(0, 1);
        }

        // Steering
        if (this._simulation.keys['a'] || this._simulation.keys['ArrowLeft']) {
            this._getSteeringValue(1, steeringVal => {
                this._steeringWheel.rotation.z = -steeringVal * 10
                this._vehicle.setSteeringValue(steeringVal, 1);
                this._vehicle.setSteeringValue(steeringVal, 0);
            })
        } else if (this._simulation.keys['d'] || this._simulation.keys['ArrowRight']) {
            this._getSteeringValue(-1, steeringVal => {
                this._steeringWheel.rotation.z = -steeringVal * 10
                this._vehicle.setSteeringValue(steeringVal, 1);
                this._vehicle.setSteeringValue(steeringVal, 0);
            })
        } else {
            this._getSteeringValue(undefined, steeringVal => {
                this._steeringWheel.rotation.z = -steeringVal * 10
                this._vehicle.setSteeringValue(steeringVal, 1);
                this._vehicle.setSteeringValue(steeringVal, 0);
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

        this._car.position.copy(this._chassisBody.position);
        this._car.quaternion.copy(this._chassisBody.quaternion);
    }
}
