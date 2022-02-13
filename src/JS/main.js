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

const a = require('../../assets/icons/caret-up.svg');
console.log(a.default)
document.querySelector('.touch-controls .touch-controls__go img').src = a.default;


// const axesHelper = new THREE.AxesHelper( 15 );
// ThreeJSSimulation.scene.add( axesHelper );
