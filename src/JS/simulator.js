import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Debug from "./Util/debug";
import Camera from "./Core/camera";
import Renderer from "./Core/renderer";
import Environment from "./World/environment";
import Physics from './Physics/physics.js';
import KeyHandler from './Util/key-handler';
import Resources from './Util/resources';
import TouchKeyHandler from './Util/touch-key-handler';

let ThreeJSSimulation = null;

export default class Simulator {
    _sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    _scene = null;
    _canvas = null;

    constructor(canvas) {
        if (ThreeJSSimulation) return ThreeJSSimulation;
        ThreeJSSimulation = this;
        console.log(this._sizes)

        this._canvas = canvas;
        this._scene = new THREE.Scene();
        
        this._keyHandler = new KeyHandler();
        this._touchKeyHandler = new TouchKeyHandler();
        this._camera = new Camera();
        this._debug = new Debug();
        this._renderer = new Renderer();
        this._physics = new Physics();
        console.log('make env')
        this._environment = new Environment();
        
        this._resources = new Resources({ onLoad: (collection) => {
            
            this.scene.add(collection.car)
            setTimeout(() => {
                this.scene.add(collection.track)
                console.log(collection.track)
                collection.track.position.set(0.0, -10.0, 0.0)
                collection.track.scale.set(10.0, 1, 10.0)
                this._physics.createCar()
                this._debug.gui.add(collection.track.position, 'y');
            }, 1000);
        }});

        this._tick();

        window.addEventListener('resize', () => this._resize());



    }

    get keys()      { return this._keyHandler._keys;        }
    get canvas()    { return this._canvas;                  }
    get camera()    { return this._camera._cameras[this._camera._activeCamera];          }
    get scene()     { return this._scene;                   }
    get sizes()     { return this._sizes;                   }
    get world()     { return this._physics.world;           }
    get resources() { return this._resources._collection;    }

    _resize() {
        this._sizes.width = window.innerWidth;
        this._sizes.height = window.innerHeight;

        this._camera.onResize();
        this._renderer.onResize();
    }
    
    _tick() {
        this._camera.onTick();
        this._renderer.onTick();
        this._physics.onTick();
        window.requestAnimationFrame(this._tick.bind(this));
    }
}
