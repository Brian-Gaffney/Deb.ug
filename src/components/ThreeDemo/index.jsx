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

const CAMERA_ROTATION_STEP = 0.002;
const PHANTOM_SPHERE_RADIUS = 150; // Radius of "phantom" sphere on which all points are placed

const TOTAL_SPHERES = 150;
const SPHERE_SIZE = 1.9;
const SPHERE_COLOR = BLUE.hex;
const SPHERE_SCALING_FACTOR = 2.2;

const TOTAL_LINES = TOTAL_SPHERES * 2;
const CURVE_POINTS = 250; // Determines accuracy when converting a curve to points
const LINE_COLOR = ORANGE.hex;
const LINE_DRAW_DURATION = 1500; // How many ms it takes to animate drawing a line
const LINE_WIDTH = 2.5;

const LINE_MIDPOINT_JIGGLE = 50;
// Subsequent midpoints have less and less jiggle
// They get closer and closer to their "goal"
const LINE_MIDPOINT_JIGGLE2 = LINE_MIDPOINT_JIGGLE / 2;
const LINE_MIDPOINT_JIGGLE3 = LINE_MIDPOINT_JIGGLE / 4;
const LINE_MIDPOINT_JIGGLE4 = LINE_MIDPOINT_JIGGLE / 6;

const LINE_DRAW_DELAY = 500;
const COLOR_TRANSITION_DURATION = LINE_DRAW_DELAY + LINE_DRAW_DURATION;

const MOUSE_MOVE_STEP = 0.004;
const MOVE_WHEEL_ZOOM_STEP = 1;

const LINE_MATERIAL = new THREE.LineBasicMaterial({
	color: LINE_COLOR,
	linewidth: LINE_WIDTH
});

const SPHERE_MATERIAL = new THREE.MeshBasicMaterial({
	color: SPHERE_COLOR,
	opacity: 1
});


const ThreeDemo = React.createClass({

	displayName: 'ThreeDemo',

	spheres: [],
	line: null,
	startingSphere: null,
	endingSphere: null,
	lastMousePosition: {},
	scene: null,
	scene: null,
	camera: null,
	renderer: null,

	getInitialState () {
		return {
			show: false
		};
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

		this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.camera.position.set(0, 20, 500);

		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas
		});

		this.renderer.setClearColor(0xffffff, 0);
		this.renderer.setSize(WIDTH, HEIGHT);

		this.scene = new THREE.Scene();

		this.init();

		this.setState({
			show: true
		});
	},

	init () {
		this.initSpheres();
		this.render3D();
		this.initLineDrawing();

		let canvas = ReactDOM.findDOMNode(this.refs.canvas);
		canvas.onmousemove = this.handleMouseMove;
		canvas.addEventListener('mousewheel', this.handleMouseWheel, false);
	},

	// Get a random sphere (that's not notThisOne)
	getRandomSphere (notThisOne) {
		let sphere = this.spheres[getRandom(0, this.spheres.length)];

		while (sphere === notThisOne) {
			sphere = this.spheres[getRandom(0, this.spheres.length)];
		}

		return sphere;
	},

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
		let midPoint2 = new THREE.Vector3();
		let midPoint3 = new THREE.Vector3();
		let midPoint4 = new THREE.Vector3();

		midPoint.lerpVectors(s1.position, s2.position, 0.2);
		midPoint2.lerpVectors(s1.position, s2.position, 0.4);
		midPoint3.lerpVectors(s1.position, s2.position, 0.6);
		midPoint4.lerpVectors(s1.position, s2.position, 0.8);

		// Add some jiggle to the midpoints
		midPoint.x += getRandom(-LINE_MIDPOINT_JIGGLE, LINE_MIDPOINT_JIGGLE);
		midPoint.y += getRandom(-LINE_MIDPOINT_JIGGLE, LINE_MIDPOINT_JIGGLE);
		midPoint.z += getRandom(-LINE_MIDPOINT_JIGGLE, LINE_MIDPOINT_JIGGLE);

		midPoint2.x += getRandom(-LINE_MIDPOINT_JIGGLE2, LINE_MIDPOINT_JIGGLE2);
		midPoint2.y += getRandom(-LINE_MIDPOINT_JIGGLE2, LINE_MIDPOINT_JIGGLE2);
		midPoint2.z += getRandom(-LINE_MIDPOINT_JIGGLE2, LINE_MIDPOINT_JIGGLE2);

		midPoint3.x += getRandom(-LINE_MIDPOINT_JIGGLE3, LINE_MIDPOINT_JIGGLE3);
		midPoint3.y += getRandom(-LINE_MIDPOINT_JIGGLE3, LINE_MIDPOINT_JIGGLE3);
		midPoint3.z += getRandom(-LINE_MIDPOINT_JIGGLE3, LINE_MIDPOINT_JIGGLE3);

		midPoint4.x += getRandom(-LINE_MIDPOINT_JIGGLE4, LINE_MIDPOINT_JIGGLE4);
		midPoint4.y += getRandom(-LINE_MIDPOINT_JIGGLE4, LINE_MIDPOINT_JIGGLE4);
		midPoint4.z += getRandom(-LINE_MIDPOINT_JIGGLE4, LINE_MIDPOINT_JIGGLE4);

		// Create a curve from sphere 1 to 2 via the midpoints
		let curve = new THREE.CatmullRomCurve3([
			s1.position,
			midPoint,
			midPoint2,
			midPoint3,
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
			.delay(LINE_DRAW_DELAY * 2)
			.finally(this.initLineDrawing)
		;
	},

	animateLineDrawing (curvePoints, backward = false) {
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
					this.scene.remove(this.line);
				}

				var geometry = new THREE.Geometry();
				geometry.vertices = points;
				this.line = new THREE.Line(geometry, LINE_MATERIAL);
				this.scene.add(this.line);

				// Resolve promise after we reach the end of the line
				if ((backward && counter < 1) || counter === curvePoints.length) {
					window.clearInterval(interval);
					resolve(curvePoints);
				}

			}, intervalPeriod);
		});
	},

	// Camera zoom based on mouse wheel
	handleMouseWheel (event) {
		let up = !!(event.wheelDelta > 0);
		let zoom = up ? -MOVE_WHEEL_ZOOM_STEP : MOVE_WHEEL_ZOOM_STEP;
		this.camera.fov += zoom;
		this.camera.updateProjectionMatrix();
	},

	handleMouseMove (event) {
		if (this.lastMousePosition.x) {
			let deltaX = this.lastMousePosition.x - event.pageX;
			let deltaY = this.lastMousePosition.y - event.pageY;

			let x = this.camera.position.x;
			let y = this.camera.position.y;
			let z = this.camera.position.z;

			if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
				// Left
				this.camera.position.x = x * Math.cos(MOUSE_MOVE_STEP) + z * Math.sin(MOUSE_MOVE_STEP);
				this.camera.position.y = y * Math.cos(MOUSE_MOVE_STEP / 4) + z * Math.sin(MOUSE_MOVE_STEP / 4);

			} else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
				// Right
				this.camera.position.x = x * Math.cos(-MOUSE_MOVE_STEP) + z * Math.sin(-MOUSE_MOVE_STEP);
				this.camera.position.y = y * Math.cos(-MOUSE_MOVE_STEP / 4) + z * Math.sin(-MOUSE_MOVE_STEP / 4);

			} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
				// Up
				this.camera.position.z = z * Math.cos(MOUSE_MOVE_STEP) - x * Math.sin(MOUSE_MOVE_STEP);

			} else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
				// Down
				this.camera.position.z = z * Math.cos(-MOUSE_MOVE_STEP) - x * Math.sin(-MOUSE_MOVE_STEP);
			}

			this.camera.lookAt(this.scene.position);
		}

		//Update last position for next time
		this.lastMousePosition = {
			x : event.pageX,
			y : event.pageY
		};
	},

	initSpheres () {
		// Add a bunch of spheres to scene
		let sphereGeometry = new THREE.SphereGeometry(SPHERE_SIZE, 20, 20);

		for (let i = 0; i < TOTAL_SPHERES; i++) {
			let sphere = new THREE.Mesh(sphereGeometry, SPHERE_MATERIAL.clone());
			let positionOffset = 220;

			let pos = getRandomPointOnSphere(PHANTOM_SPHERE_RADIUS);
			sphere.position.set(pos.x, pos.y, pos.z);

			this.spheres.push(sphere);
			this.scene.add(sphere);
		}
	},

	updateCamera () {
		let x = this.camera.position.x;
		let y = this.camera.position.y;
		let z = this.camera.position.z;

		this.camera.position.x = x * Math.cos(CAMERA_ROTATION_STEP) + z * Math.sin(CAMERA_ROTATION_STEP);
		this.camera.position.y = y * Math.cos(CAMERA_ROTATION_STEP / 4) + z * Math.sin(CAMERA_ROTATION_STEP / 4);
		this.camera.position.z = z * Math.cos(CAMERA_ROTATION_STEP) - x * Math.sin(CAMERA_ROTATION_STEP);

		this.camera.lookAt(this.scene.position);
	},

	render3D () {
		stats.begin();

		requestAnimationFrame(this.render3D);

		TWEEN.update();

		this.updateCamera();

		this.renderer.render(this.scene, this.camera);

		stats.end();
	},

	initStats () {
		stats.setMode(0); // 0: fps, 1: ms, 2: mb
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
	},

	render () {

		let className = styles.component;

		if (this.state.show) {
			className += ` ${styles.show}`;
		}

		return (
			<div className={className}>
				<canvas className={styles.canvas} ref="canvas" />
			</div>
		);
	}
});

export default ThreeDemo;