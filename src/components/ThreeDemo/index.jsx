import React from 'react';
import ReactDOM from 'react-dom';
import TWEEN from 'tween.js';
import Promise from 'bluebird';
import Stats from 'vendor/stats';
import THREE from 'utils/three';
import {
	getRandom,
	getRandomPointOnSphere
} from 'utils/maths';

import styles from './styles.scss';

const stats = new Stats();

const ORANGE = {
	hex: 0xffa500,
	r: 1,
	g: 0.64,
	b: 0,
};

const BLUE = {
	hex: 0x6666dd,
	r: 0.4,
	g: 0.4,
	b: 0.8666,
};

const cameraRotationStep = 0.002;
const PHANTOM_SPHERE_RADIUS = 190; // Radius of "phantom" sphere on which all points are placed

const TOTAL_SPHERES = 120;
const SPHERE_SIZE = 3;
const SPHERE_COLOR = BLUE.hex;
const SPHERE_SCALING_FACTOR = 2.2;

const TOTAL_LINES = Math.floor(TOTAL_SPHERES * 2);
const CURVE_POINTS = 250; // Determines accuracy when converting a curve to points
const LINE_COLOR = ORANGE.hex; // Orange
const LINE_MIDPOINT_OFFSET = 70;
const LINE_DRAW_DURATION = 1500; // How many ms it takes to animate drawing a line

const LINE_DRAW_DELAY = 500;
const COLOR_TRANSITION_DURATION = LINE_DRAW_DELAY + LINE_DRAW_DURATION;

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
		// this.centerPointSphere();
		this.initSpheres();
		this.render3D();
		this.initLineDrawing();

		document.onmousemove = this.handleMouseMove;
	},

	// Get a random sphere (that's not notThisOne)
	getRandomSphere (notThisOne) {
		let sphere = this.spheres[getRandom(0, this.spheres.length)];

		while (sphere === notThisOne) {
			sphere = this.spheres[getRandom(0, this.spheres.length)];
		}

		return sphere;
	},

	line: null,
	startingSphere: null,
	endingSphere: null,

	initLineDrawing () {

		// Initialisation step
		if (!this.startingSphere && !this.endingSphere) {
			this.startingSphere = this.getRandomSphere();
			this.endingSphere = this.getRandomSphere(this.startingSphere);

			// Make the first starting sphere orange
			this.startingSphere.material.color.r = ORANGE.r;
			this.startingSphere.material.color.g = ORANGE.g;
			this.startingSphere.material.color.b = ORANGE.b;

			// Make the first starting sphere big
			this.startingSphere.scale.x = SPHERE_SCALING_FACTOR;
			this.startingSphere.scale.y = SPHERE_SCALING_FACTOR;
			this.startingSphere.scale.z = SPHERE_SCALING_FACTOR;
		} else {
			// Update old end to be new start
			this.startingSphere = this.endingSphere;
			this.endingSphere = this.getRandomSphere(this.startingSphere);
		}

		let curvePoints = this.generateCurvePoints(this.startingSphere, this.endingSphere);

		this.drawLine(curvePoints);
	},

	generateCurvePoints (s1, s2) {
		// Set a midpoint between the two spheres
		let midPoint = new THREE.Vector3();

		midPoint.lerpVectors(s1.position, s2.position, 0.5);

		// Add some jiggle to the midpoint
		midPoint.x += getRandom(-LINE_MIDPOINT_OFFSET, LINE_MIDPOINT_OFFSET);
		midPoint.y += getRandom(-LINE_MIDPOINT_OFFSET, LINE_MIDPOINT_OFFSET);
		midPoint.z += getRandom(-LINE_MIDPOINT_OFFSET, LINE_MIDPOINT_OFFSET);

		// Create a curve from sphere 1 to 2 via the midpoint
		let curve = new THREE.CatmullRomCurve3([
			s1.position,
			midPoint,
			s2.position
		]);

		return curve.getPoints(CURVE_POINTS);
	},

	scaleSphere (sphere, down = false) {

		let scale = SPHERE_SCALING_FACTOR;
		if (down) {
			scale = 1;
		}

		new TWEEN
			.Tween(sphere.scale)
			.to({
				x: scale,
				y: scale,
				z: scale
			}, COLOR_TRANSITION_DURATION)
			.start()
		;
	},

	recolorSphere (sphere, color) {
		new TWEEN
			.Tween(sphere.material.color)
			.to({
				r: color.r,
				g: color.g,
				b: color.b
			}, COLOR_TRANSITION_DURATION)
			.start()
		;
	},

	drawLine (curvePoints) {

		// Start making the origin sphere blue 
		this.recolorSphere(this.startingSphere, BLUE);
		this.scaleSphere(this.startingSphere, true);

		this
			.animateLineDrawing(curvePoints)
			.tap(() => {
				// Start making the destination sphere orange once the line touches it
				this.recolorSphere(this.endingSphere, ORANGE);
				this.scaleSphere(this.endingSphere);
			})
			.delay(LINE_DRAW_DELAY)
			.then((curvePoints) => {
				return this.animateLineDrawing(curvePoints, true)
			})
			.delay(LINE_DRAW_DELAY * 3)
			.finally(this.initLineDrawing)
		;
	},

	animateLineDrawing (curvePoints, backward = false) {
		let {
			scene
		} = this.state;

		let counter = 1;
		if (backward) {
			counter = curvePoints.length;
			curvePoints.reverse();
		}

		return new Promise((resolve) => {

			let intervalPeriod = LINE_DRAW_DURATION / CURVE_POINTS;

			let interval = window.setInterval(() => {
				// Clone curve points into a new array
				var points = curvePoints.slice();

				// Splice out a subset of points to draw
				points.splice(counter);

				if (backward) {
					counter--;
				} else {
					counter++;
				}

				// Remove previous line
				if (this.line) {
					scene.remove(this.line);
				}

				var geometry = new THREE.Geometry();
				geometry.vertices = points;
				this.line = new THREE.Line(geometry, LINE_MATERIAL);
				scene.add(this.line);

				// Resolve promise after we reach the end of the line
				if ((backward && counter < 1) || counter === curvePoints.length) {
					window.clearInterval(interval);
					resolve(curvePoints);
				}

			}, intervalPeriod);
		});
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
		let sphereGeometry = new THREE.SphereGeometry(SPHERE_SIZE, 20, 20);


		for (let i = 0; i < TOTAL_SPHERES; i++) {
			let sphereMaterial = new THREE.MeshBasicMaterial({
				color: SPHERE_COLOR,
				opacity: 1
			});

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

		TWEEN.update();

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