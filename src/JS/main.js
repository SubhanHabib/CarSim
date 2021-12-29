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


function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

if (!isMobileDevice()) document.querySelector('.touch-controls').style.display = 'none'

console.log(isMobileDevice())
/**
 * Debug
 */
// debugUI.addObject('resetCar', () => car.reset())

// const axesHelper = new THREE.AxesHelper( 15 );
// ThreeJSSimulation.scene.add( axesHelper );
