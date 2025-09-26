"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ThreeEarth() {
	const mountRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let earth: THREE.Object3D | null = null;
		let animationId: number | null = null;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 3;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0";
		renderer.domElement.style.left = "0";
		renderer.domElement.style.zIndex = "0"; // Behind text
		renderer.domElement.style.pointerEvents = "none";

		const mountNode = mountRef.current;
		if (mountNode) {
			mountNode.appendChild(renderer.domElement);
		}

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
		directionalLight.position.set(4, 2, 4);
		scene.add(directionalLight);

		// Load earth.glb
		const loader = new GLTFLoader();
		loader.load("/objects/earth.glb", (gltf: { scene: THREE.Object3D }) => {
			earth = gltf.scene;
			if (earth) {
				earth.scale.set(1.2, 1.2, 1.2);
				earth.position.set(0, 0, 0);
				scene.add(earth);
			}
		});

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);
			if (earth) {
				// Spin the earth
				earth.rotation.y += 0.005 + 0.01 * window.scrollY / 100;
				// Earth rotation X is a sine wave
				earth.rotation.x = 0.1 * Math.sin(earth.rotation.x * 0.1);
			}
			renderer.render(scene, camera);
		}
		animate();

		// Keep canvas centered on scroll
		function onScroll() {
			renderer.domElement.style.top = `${window.scrollY /2}px`;
		}
		window.addEventListener("scroll", onScroll);

		// Cleanup
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (animationId) cancelAnimationFrame(animationId);
			if (renderer) {
				renderer.dispose();
				if (renderer.domElement && mountNode) {
					mountNode.removeChild(renderer.domElement);
				}
			}
		};
	}, []);

	// The div should be at the top level of the app, so the canvas is always behind text
	return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} />;
}