import '../style.scss'

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

document.body.classList.toggle('isMobile', !!isMobileDevice())

const iconArrow = require('../../assets/icons/caret-up.svg');
const iconStop = require('../../assets/icons/stop-solid.svg');
const iconCamera = require('../../assets/icons/camera-rotate-solid.svg');
['go', 'reverse', 'arrow-left', 'arrow-right'].forEach(dir =>
	document.querySelector(`.touch-controls .touch-controls__${dir} img`).src = iconArrow.default
);
document.querySelector(`.touch-controls .touch-controls__camera img`).src = iconCamera.default
document.querySelector(`.touch-controls .touch-controls__brake img`).src = iconStop.default


// const axesHelper = new THREE.AxesHelper( 15 );
// ThreeJSSimulation.scene.add( axesHelper );
