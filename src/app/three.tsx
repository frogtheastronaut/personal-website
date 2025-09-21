"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function DuckThree() {
	const mountRef = useRef(null);

	useEffect(() => {
		let renderer, scene, camera, duck, animationId;
		let spinDirection = new THREE.Vector3(0, 0, 0);
		let isSpinning = false;

		// Scene setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 3;

		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0";
		renderer.domElement.style.left = "0";
		renderer.domElement.style.zIndex = "0"; // Behind text
		renderer.domElement.style.pointerEvents = "none";

		if (mountRef.current) {
			mountRef.current.appendChild(renderer.domElement);
		}

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
		directionalLight.position.set(0, 2, 4);
		scene.add(directionalLight);

		// Load duck.glb
		const loader = new GLTFLoader();
		loader.load("/objects/duckie.glb", (gltf) => {
		duck = gltf.scene;
		duck.scale.set(0.7, 0.7, 0.7);
		scene.add(duck);
		});

		// Cursor tracking
		let target = new THREE.Vector3(0, 0, 0);
		let lastCursor = { x: 0, y: 0 };
		const onMouseMove = (e) => {
			// Convert cursor to normalized device coordinates
			const x = (e.clientX / window.innerWidth) * 2 - 1;
			const y = -(e.clientY / window.innerHeight) * 2 + 1;
			target.x = x * 1.5;
			target.y = y * 1.2;
			lastCursor.x = x;
			lastCursor.y = y;
		};
		window.addEventListener("mousemove", onMouseMove);

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);
			if (duck) {
				// Move duck towards cursor
				duck.position.lerp(target, 0.18);
				// If duck is close to cursor, spin randomly
				const dist = duck.position.distanceTo(target);
				if (dist < 0.05) {
					if (!isSpinning) {
						// Random spin axis
						spinDirection = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
						isSpinning = true;
					}
					duck.rotateOnAxis(spinDirection, 0.08);
				} else {
					isSpinning = false;
				}
			}
			renderer.render(scene, camera);
		}
		animate();

		// Cleanup
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			if (animationId) cancelAnimationFrame(animationId);
			if (renderer) {
				renderer.dispose();
				if (renderer.domElement && mountRef.current) {
					mountRef.current.removeChild(renderer.domElement);
				}
			}
		};
	}, []);

	// The div should be at the top level of the app, so the canvas is always behind text
	return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} />;
}
