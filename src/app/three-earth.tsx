"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingSpinner from "./loading-spinner";

export default function ThreeEarth() {
	const mountRef = useRef<HTMLDivElement | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let earth: THREE.Object3D | null = null;
		let animationId: number | null = null;
		let starsMaterial: THREE.ShaderMaterial | null = null;

		// Scene setup
		const scene = new THREE.Scene();
		const starsScene = new THREE.Scene(); // Separate scene for stars
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 3;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0";
		renderer.domElement.style.left = "0";
		renderer.domElement.style.zIndex = "0"; // Behind text
		renderer.domElement.style.pointerEvents = "none";
		renderer.autoClear = false; // Don't auto clear so we can render multiple scenes

		const mountNode = mountRef.current;
		if (mountNode) {
			mountNode.appendChild(renderer.domElement);
		}

		// Star field shader
		const starVertexShader = `
			void main() {
				gl_Position = vec4(position, 1.0);
			}
		`;

		const starFragmentShader = `
			uniform float iTime;
			uniform vec2 iResolution;

			// 3D Gradient noise from: https://www.shadertoy.com/view/Xsl3Dl
			vec3 hash( vec3 p ) {
				p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
						  dot(p,vec3(269.5,183.3,246.1)),
						  dot(p,vec3(113.5,271.9,124.6)));

				return -1.0 + 2.0*fract(sin(p)*43758.5453123);
			}

			float noise( in vec3 p ) {
				vec3 i = floor( p );
				vec3 f = fract( p );
				
				vec3 u = f*f*(3.0-2.0*f);

				return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
							  dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
						 mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
							  dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
					mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
							  dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
						 mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
							  dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
			}

			void main() {
				// Normalized pixel coordinates (from 0 to 1)
				vec2 uv = gl_FragCoord.xy/iResolution.xy;
				
				// Stars computation:
				vec3 stars_direction = normalize(vec3(uv * 2.0 - 1.0, 1.0)); 
				float stars_threshold = 8.0; 
				float stars_exposure = 200.0; 
				float stars = pow(clamp(noise(stars_direction * 200.0), 0.0, 1.0), stars_threshold) * stars_exposure;
				stars *= mix(0.4, 1.4, noise(stars_direction * 100.0 + vec3(iTime))); 
				
				// Output to screen
				gl_FragColor = vec4(vec3(stars), 1.0);
			}
		`;

		// Create star field background
		starsMaterial = new THREE.ShaderMaterial({
			uniforms: {
				iTime: { value: 0 },
				iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
			},
			vertexShader: starVertexShader,
			fragmentShader: starFragmentShader,
			depthWrite: false, // Don't write to depth buffer
			depthTest: false   // Don't test depth
		});

		const starsGeometry = new THREE.PlaneGeometry(2, 2);
		const starsMesh = new THREE.Mesh(starsGeometry, starsMaterial);
		starsMesh.position.z = -100; // Much farther behind everything
		starsMesh.renderOrder = -1; // Render first (behind everything)
		starsScene.add(starsMesh); // Add to stars scene, not main scene

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
				// Hide loading spinner once earth is loaded
				setIsLoading(false);
			}
		}, 
		// Progress callback (optional)
		undefined,
		// Error callback
		(error: ErrorEvent) => {
			console.error('Error loading earth model:', error);
			setIsLoading(false); // Hide spinner even on error
		});

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);
			
			// Update star field time
			if (starsMaterial) {
				starsMaterial.uniforms.iTime.value = performance.now() * 0.001;
			}
			
			// Clear and render stars first (background, no scroll)
			renderer.clear();
			renderer.render(starsScene, camera);
			
			// Render main scene (earth, with scroll) on top
			renderer.clearDepth(); // Clear depth buffer but keep color buffer
			if (earth) {
				// Spin the earth
				earth.rotation.y += 0.005 + 0.01 * window.scrollY / 500;
				// Earth rotation X is a sine wave
				earth.rotation.x = 0.1 * Math.sin(earth.rotation.x);
			}
			renderer.render(scene, camera);
		}
		animate();

		// Keep canvas centered on scroll
		function onScroll() {
			// renderer.domElement.style.top = `${window.scrollY /2}px`;
		}
		window.addEventListener("scroll", onScroll);

		// Handle window resize
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			
			// Update star field resolution
			if (starsMaterial) {
				starsMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
			}
		}
		window.addEventListener('resize', onWindowResize);

		// Cleanup
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener('resize', onWindowResize);
			if (animationId) cancelAnimationFrame(animationId);
			if (starsMaterial) starsMaterial.dispose();
			if (renderer) {
				renderer.dispose();
				if (renderer.domElement && mountNode) {
					mountNode.removeChild(renderer.domElement);
				}
			}
		};
	}, []);

	// The div should be at the top level of the app, so the canvas is always behind text
	return (
		<>
			<LoadingSpinner isLoading={isLoading} />
			<div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} />
		</>
	);
}