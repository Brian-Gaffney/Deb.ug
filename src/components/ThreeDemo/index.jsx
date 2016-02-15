import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'vendor/three';
import Stats from 'vendor/stats';

import styles from './styles.scss';

var stats = new Stats();

const cameraRotationStep = 0.002;
const PHANTOM_SPHERE_RADIUS = 190; // Radius of "phantom" sphere on which all points are placed
const SPHERE_COLOR = 0x6666dd;

const TOTAL_SPHERES = 150;
const TOTAL_LINES = Math.floor(TOTAL_SPHERES * 2);
const CURVE_POINTS = 50 - 1; // Determines accuracy when converting a curve to points
const LINE_COLOR = 0x7777ff;
const LINE_MIDPOINT_OFFSET = 25;


const ThreeDemo = React.createClass({

	displayName: 'ThreeDemo',

	getRandom (min, max) {
		return Math.random() * (max - min) + min;
	},

	getRandomWithBias (min, max, bias, influence) {
		let random = Math.random() * (max - min) + min;
		let difference = random - bias;
		let mixer = Math.pow(Math.random(), influence);
		let toBeRemoved = difference * mixer;

		return Math.floor(random - toBeRemoved);
	},

	randomPointOnSphere () {
		var radius = PHANTOM_SPHERE_RADIUS;

		// First get a random point along a sphere with set radius
		var u = Math.random();
		var v = Math.random();
		var theta = 2 * Math.PI * u;
		var phi = Math.acos(2 * v - 1);
		var x = (radius * Math.sin(phi) * Math.cos(theta));
		var y = (radius * Math.sin(phi) * Math.sin(theta));
		var z = (radius * Math.cos(phi));

		// Extra randomisation so as to avoid a perfect sphere
		x += this.getRandom(-(radius / 15), (radius / 15));
		y += this.getRandom(-(radius / 15), (radius / 15));
		z += this.getRandom(-(radius / 15), (radius / 15));

		return new THREE.Vector3(x, y, z);
	},

	componentDidMount () {
		this.initStats();

		document.body.appendChild(stats.domElement);

		let canvas = ReactDOM.findDOMNode(this.refs.canvas);
		
		let WIDTH = canvas.clientWidth;
		let HEIGHT = canvas.clientHeight;

		let VIEW_ANGLE = 45;
		let ASPECT = WIDTH / HEIGHT;
		let NEAR = 0.1;
		let FAR = 10000;

		let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.set(0, 20, 500);

		let renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			precision: 'highp',
			canvas
		});

		renderer.setClearColor(0xffffff, 0);
		renderer.setSize(WIDTH, HEIGHT);

		let scene = new THREE.Scene()

		this.setState({
			scene,
			camera,
			renderer
		}, this.init);
	},

	init () {
		this.centerPointSphere();
		this.initSpheres();
		this.render3D();
	},

	spheres: [], // Contains all spheres to be rendered
	initSpheres () {

		let {
			scene
		} = this.state;

		// Add a bunch of spheres to scene
		var sphereGeometry = new THREE.SphereGeometry(1.5, 20, 20);

		var sphereMaterial = new THREE.MeshBasicMaterial({
			color: SPHERE_COLOR
		});

		for (var i = 0; i < TOTAL_SPHERES; i++) {
			var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			var positionOffset = 220;

			var pos = this.randomPointOnSphere();
			sphere.position.set(pos.x, pos.y, pos.z);

			// Origin - Used for later bounds checking
			sphere.userData.originalPosition = sphere.position.clone();

			// Data for moving spheres - Used by updateSpheres()
			sphere.userData.dx = this.getRandom(-100, 100);
			sphere.userData.dy = this.getRandom(-100, 100);
			sphere.userData.dz = this.getRandom(-100, 100);

			this.spheres.push(sphere);
			scene.add(sphere);
		}
	},

	centerPointSphere () {
		console.log('centerPointSphere()');
		let scene = this.state.scene;

		let sphereGeometry = new THREE.SphereGeometry(5, 20, 20);

		let material = new THREE.MeshBasicMaterial({
			color: 0x882121
		});

		let center = new THREE.Mesh(sphereGeometry, material);
		scene.add(center);
	},

	updateCamera () {
		let {
			scene,
			camera
		} = this.state;

		let x = camera.position.x;
		let y = camera.position.y;
		let z = camera.position.z;

		camera.position.x = x * Math.cos(cameraRotationStep) + z * Math.sin(cameraRotationStep);
		camera.position.y = y * Math.cos(cameraRotationStep / 4) + z * Math.sin(cameraRotationStep / 4);
		camera.position.z = z * Math.cos(cameraRotationStep) - x * Math.sin(cameraRotationStep);

		camera.lookAt(scene.position);
	},

	render3D () {
		let {
			scene,
			camera,
			renderer
		} = this.state;

		stats.begin();

		requestAnimationFrame(this.render3D);

		this.updateCamera();

		renderer.render(scene, camera);

		stats.end();
	},

	initStats () {
		stats.setMode(0); // 0: fps, 1: ms, 2: mb
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
	},

	render () {
		return (
			<div>
				<h2>
					Three demo
				</h2>
				<canvas className={styles.canvas} ref="canvas" />
			</div>
		);
	}
});

export default ThreeDemo;