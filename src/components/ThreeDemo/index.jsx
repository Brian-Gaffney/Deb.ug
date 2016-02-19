import React from 'react';
import ReactDOM from 'react-dom';
import Stats from 'vendor/stats';
import THREE from 'utils/three';
import {
	getRandom,
	getRandomPointOnSphere
} from 'utils/maths';

import styles from './styles.scss';

const stats = new Stats();

const cameraRotationStep = 0.002;
const PHANTOM_SPHERE_RADIUS = 190; // Radius of "phantom" sphere on which all points are placed
const SPHERE_COLOR = 0x6666dd;

const TOTAL_SPHERES = 150;
const TOTAL_LINES = Math.floor(TOTAL_SPHERES * 2);
const CURVE_POINTS = 50; // Determines accuracy when converting a curve to points
const LINE_COLOR = 0xffa500;
const LINE_MIDPOINT_OFFSET = 25;

const MOUSE_MOVE_STEP = 0.004;

const LINE_MATERIAL = new THREE.LineBasicMaterial({
	color: LINE_COLOR,
	linewidth: 1.7
});



const ThreeDemo = React.createClass({

	displayName: 'ThreeDemo',

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
		this.initLineDrawing();

		document.onmousemove = this.handleMouseMove;
	},

	line: {},
	initLineDrawing () {
		window.setInterval(() => {
			this.drawLine();
		}, 1000);
	},

	drawLine () {
		let {
			scene
		} = this.state;

		// Remove the last line
		if (this.line) {
			scene.remove(this.line);
		}

		// Get two random spheres
		let s1 = this.spheres[getRandom(0, this.spheres.length)];
		let s2 = this.spheres[getRandom(0, this.spheres.length)];

		// Set a midpoint between the two spheres
		let midPoint = new THREE.Vector3();
		midPoint.lerpVectors(s1.position, s2.position, 0.5);

		// Add some jiggle to the midpoint
		midPoint.x += getRandom(-80, 80);
		midPoint.y += getRandom(-80, 80);
		midPoint.z += getRandom(-80, 80);

		// Create a curve from sphere 1 to 2 via the midpoint
		let curve = new THREE.CatmullRomCurve3([
			s1.position,
			midPoint,
			s2.position
		]);

		let geometry = new THREE.Geometry();
		geometry.vertices = curve.getPoints(CURVE_POINTS);

		this.line = new THREE.Line(geometry, LINE_MATERIAL);
		scene.add(this.line);
	},

	lastMousePosition: {},
	handleMouseMove (event) {

		let {
			scene,
			camera
		} = this.state;

		if (this.lastMousePosition.x) {
			let deltaX = this.lastMousePosition.x - event.pageX;
			let deltaY = this.lastMousePosition.y - event.pageY;

			let x = camera.position.x;
			let y = camera.position.y;
			let z = camera.position.z;

			if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
				// Left
				camera.position.x = x * Math.cos(MOUSE_MOVE_STEP) + z * Math.sin(MOUSE_MOVE_STEP);
				camera.position.y = y * Math.cos(MOUSE_MOVE_STEP / 4) + z * Math.sin(MOUSE_MOVE_STEP / 4);

			} else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
				// Right
				camera.position.x = x * Math.cos(-MOUSE_MOVE_STEP) + z * Math.sin(-MOUSE_MOVE_STEP);
				camera.position.y = y * Math.cos(-MOUSE_MOVE_STEP / 4) + z * Math.sin(-MOUSE_MOVE_STEP / 4);

			} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
				// Up
				camera.position.z = z * Math.cos(MOUSE_MOVE_STEP) - x * Math.sin(MOUSE_MOVE_STEP);

			} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
				// Down
				camera.position.z = z * Math.cos(-MOUSE_MOVE_STEP) - x * Math.sin(-MOUSE_MOVE_STEP);
			}

			camera.lookAt(scene.position);
		}

		//Update last position for next time
		this.lastMousePosition = {
			x : event.pageX,
			y : event.pageY
		};
	},

	spheres: [], // Contains all spheres to be rendered
	initSpheres () {

		let {
			scene
		} = this.state;

		// Add a bunch of spheres to scene
		let sphereGeometry = new THREE.SphereGeometry(1.5, 20, 20);

		let sphereMaterial = new THREE.MeshBasicMaterial({
			color: SPHERE_COLOR,
			opacity: 1
		});

		for (let i = 0; i < TOTAL_SPHERES; i++) {
			let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			let positionOffset = 220;

			let pos = getRandomPointOnSphere(PHANTOM_SPHERE_RADIUS);
			sphere.position.set(pos.x, pos.y, pos.z);

			// Origin - Used for later bounds checking
			sphere.userData.originalPosition = sphere.position.clone();

			// Data for moving spheres - Used by updateSpheres()
			sphere.userData.dx = getRandom(-100, 100);
			sphere.userData.dy = getRandom(-100, 100);
			sphere.userData.dz = getRandom(-100, 100);

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
			<div className={styles.component}>
				<canvas className={styles.canvas} ref="canvas" />
			</div>
		);
	}
});

export default ThreeDemo;