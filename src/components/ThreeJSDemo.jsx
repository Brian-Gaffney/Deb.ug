import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss'
import TWEEN from 'tween.js';
import Promise from 'bluebird';

import THREE from '../utils/three';
import {
	getRandom,
	getRandomPointOnSphere
} from '../utils/maths';
import colors from '../colors';

const styles = {
	hide: {
		opacity: 0
	},
	component: {
		position: 'absolute',
		zIndex: -'50',
		bottom: '5%',
		right: '5%',
		width: '70%',
		height: '70%',
		transition: 'opacity 1000ms ease-in',
		overflow: 'hidden',

		'@media screen and (max-width: 1440px)': {
			width: '100%',
			height: '600px',
			position: 'static'
		},

		'@media screen and (max-width: 900px)': {
			width: '100%',
			height: '400px',
			position: 'static'
		}
	},
	canvas: {
		width: '100%',
		height: '100%',
	}
};

const CAMERA_ROTATION_STEP = 0.002;
const PHANTOM_SPHERE_RADIUS = 150; // Radius of "phantom" sphere on which all points are placed

const TOTAL_SPHERES = 150;
const SPHERE_SIZE = 2.2;
const SPHERE_COLOR = `rgb(${colors.secondary.rgb})`;
const SPHERE_SCALING_FACTOR = 3.5;

const MIDPOINT_COUNT = 4;

const TOTAL_LINES = TOTAL_SPHERES * 2;
const CURVE_POINTS = 250; // Determines accuracy when converting a curve to points
const LINE_COLOR = `rgb(${colors.primary.rgb})`;
const LINE_DRAW_DURATION = 1500; // How many ms it takes to animate drawing a line
const LINE_WIDTH = 3.2;

const MIDPOINT_NOISE = 100;

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

class ThreeDemo extends Component {

	spheres = [];
	line = null;
	startingSphere = null;
	endingSphere = null;
	lastMousePosition = {};
	scene = null;
	scene = null;
	camera = null;
	renderer = null;

	constructor () {
		super()

		this.state = {
			show: false,
		}
	}

	componentDidMount () {
		// Small delay so that Radium has time
		// to set the canvas size
		window.setTimeout(() => {
			this.init();
		}, 50);
	}

	init () {
		const canvas = ReactDOM.findDOMNode(this.refs.canvas);

		const WIDTH = canvas.clientWidth;
		const HEIGHT = canvas.clientHeight;

		const VIEW_ANGLE = 45;
		const ASPECT = WIDTH / HEIGHT;
		const NEAR = 0.1;
		const FAR = 10000;

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

		this.initSpheres();
		this.render3D();
		this.initLineDrawing();

		canvas.onmousemove = this.handleMouseMove;
		canvas.addEventListener('mousewheel', this.handleMouseWheel, false);

		this.setState({
			show: true
		});
	}

	// Get a random sphere (that's not notThisOne)
	getRandomSphere (notThisOne) {
		let sphere = this.spheres[getRandom(0, this.spheres.length)];

		while (sphere === notThisOne) {
			sphere = this.spheres[getRandom(0, this.spheres.length)];
		}

		return sphere;
	}

	initLineDrawing = () => {

		// Initialisation step
		if (!this.startingSphere && !this.endingSphere) {
			this.startingSphere = this.getRandomSphere();
			this.endingSphere = this.getRandomSphere(this.startingSphere);

			// Highlight the first starting sphere
			this.startingSphere.material.color.r = colors.primary.rDecimal;
			this.startingSphere.material.color.g = colors.primary.gDecimal;
			this.startingSphere.material.color.b = colors.primary.bDecimal;

			// Make the first starting sphere big
			this.startingSphere.scale.x = SPHERE_SCALING_FACTOR;
			this.startingSphere.scale.y = SPHERE_SCALING_FACTOR;
			this.startingSphere.scale.z = SPHERE_SCALING_FACTOR;
		} else {
			// Update old end to be new start
			this.startingSphere = this.endingSphere;
			this.endingSphere = this.getRandomSphere(this.startingSphere);
		}

		const curvePoints = this.generateCurvePoints(this.startingSphere, this.endingSphere);

		this.drawLine(curvePoints);
	}

	addNoiseToPoint (point, noiseFactor = 1) {
		const noise = MIDPOINT_NOISE / noiseFactor;

		point.x += getRandom(-noise, noise);
		point.y += getRandom(-noise, noise);
		point.z += getRandom(-noise, noise);

		return point;
	}

	// Create a nice curve from sphere one to sphere 2
	generateCurvePoints (s1, s2) {

		const midPoints = [...Array(MIDPOINT_COUNT)].map((o, i, source) => {
			const distanceAlongLine = (i + 1) / (source.length + 1);

			const point = new THREE.Vector3()
				.lerpVectors(s1.position, s2.position, distanceAlongLine);

			return this.addNoiseToPoint(point, i + 1);
		});

		// Create a curve from sphere 1 to 2 via the midpoints
		return new THREE.CatmullRomCurve3([
			s1.position,
			...midPoints,
			s2.position
		]).getPoints(CURVE_POINTS);
	}

	scaleSphere (sphere, scaleUp = true) {
		// Scale up or return to normal scale (1)
		const scale = scaleUp ? SPHERE_SCALING_FACTOR : 1;

		new TWEEN
			.Tween(sphere.scale)
			.to({
				x: scale,
				y: scale,
				z: scale
			}, COLOR_TRANSITION_DURATION)
			.start()
		;
	}

	recolorSphere (sphere, color) {
		new TWEEN
			.Tween(sphere.material.color)
			.to({
				r: color.rDecimal,
				g: color.gDecimal,
				b: color.bDecimal
			}, COLOR_TRANSITION_DURATION)
			.start()
		;
	}

	drawLine (curvePoints) {
		// Start making the origin sphere the secondary color
		this.recolorSphere(this.startingSphere, colors.secondary);
		this.scaleSphere(this.startingSphere, false);

		this
			.animateLineDrawing(curvePoints)
			.tap(() => {
				// Start highlighting the destination sphere once the line touches it
				this.recolorSphere(this.endingSphere, colors.primary);
				this.scaleSphere(this.endingSphere);
			})
			.delay(LINE_DRAW_DELAY)
			.then((curvePoints) => {
				return this.animateLineDrawing(curvePoints, false)
			})
			.delay(LINE_DRAW_DELAY * 2)
			.finally(this.initLineDrawing)
		;
	}

	animateLineDrawing (curvePoints, forward = true) {
		let counter = forward ? 1 : curvePoints.length;

		if (!forward) {
			curvePoints.reverse();
		}

		return new Promise((resolve) => {
			const intervalPeriod = LINE_DRAW_DURATION / CURVE_POINTS;

			const interval = window.setInterval(() => {
				// Clone curve points into a new array
				const points = curvePoints.slice();

				// Splice out a subset of points to draw
				points.splice(counter);

				// (inc/dec)remenent counter
				forward ? counter++ : counter--;

				// Remove previous line
				if (this.line) {
					this.scene.remove(this.line);
				}

				const geometry = new THREE.Geometry();
				geometry.vertices = points;
				this.line = new THREE.Line(geometry, LINE_MATERIAL);
				this.scene.add(this.line);

				// Resolve promise after we reach the end of the line
				if ((!forward && counter < 1) || counter === curvePoints.length) {
					window.clearInterval(interval);
					resolve(curvePoints);
				}

			}, intervalPeriod);
		});
	}

	// Camera zoom based on mouse wheel
	handleMouseWheel = (event) => {
		const up = !!(event.wheelDelta > 0);
		const zoom = up ? -MOVE_WHEEL_ZOOM_STEP : MOVE_WHEEL_ZOOM_STEP;
		this.camera.fov += zoom;
		this.camera.updateProjectionMatrix();
	}

	handleMouseMove = (event) => {
		if (this.lastMousePosition.x) {
			const deltaX = this.lastMousePosition.x - event.pageX;
			const deltaY = this.lastMousePosition.y - event.pageY;

			const x = this.camera.position.x;
			const y = this.camera.position.y;
			const z = this.camera.position.z;

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
	}

	initSpheres () {
		// Add a bunch of spheres to scene
		const sphereGeometry = new THREE.SphereGeometry(SPHERE_SIZE, 20, 20);

		for (let i = 0; i < TOTAL_SPHERES; i++) {
			const sphere = new THREE.Mesh(sphereGeometry, SPHERE_MATERIAL.clone());
			const positionOffset = 220;

			const pos = getRandomPointOnSphere(PHANTOM_SPHERE_RADIUS);
			sphere.position.set(pos.x, pos.y, pos.z);

			this.spheres.push(sphere);
			this.scene.add(sphere);
		}
	}

	updateCamera () {
		const {
			x,
			y,
			z
		} = this.camera.position;

		this.camera.position.x = x * Math.cos(CAMERA_ROTATION_STEP) + z * Math.sin(CAMERA_ROTATION_STEP);
		this.camera.position.y = y * Math.cos(CAMERA_ROTATION_STEP / 4) + z * Math.sin(CAMERA_ROTATION_STEP / 4);
		this.camera.position.z = z * Math.cos(CAMERA_ROTATION_STEP) - x * Math.sin(CAMERA_ROTATION_STEP);

		this.camera.lookAt(this.scene.position);
	}

	render3D = () => {
		requestAnimationFrame(this.render3D);

		TWEEN.update();

		this.updateCamera();

		this.renderer.render(this.scene, this.camera);
	}

	render () {
		const style = [
			styles.component,
			this.state.show ? null : styles['hide']
		];

		return (
			<div style={style}>
				<canvas style={styles.canvas} ref="canvas" />
			</div>
		);
	}
}

export default injectSheet(styles)(ThreeDemo);