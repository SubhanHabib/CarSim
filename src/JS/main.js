import '../style.css'

import {debugUI} from './Util/debug.js';
import Simulator from './simulator';
import * as Stats from 'stats.js';

new Simulator(document.querySelector('canvas.webgl'));


var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {
	stats.begin();
	// monitored code goes here
	stats.end();
	requestAnimationFrame( animate );
}
requestAnimationFrame( animate );

/**
 * Debug
 */
// debugUI.addObject('resetCar', () => car.reset())

// const axesHelper = new THREE.AxesHelper( 15 );
// ThreeJSSimulation.scene.add( axesHelper );
