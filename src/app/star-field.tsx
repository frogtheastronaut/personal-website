"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StarField() {
	const mountRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let animationId: number | null = null;
		let starsMaterial: THREE.ShaderMaterial | null = null;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		
		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0";
		renderer.domElement.style.left = "0";
		renderer.domElement.style.zIndex = "-1"; // Behind everything
		renderer.domElement.style.pointerEvents = "none";

		const mountNode = mountRef.current;
		if (mountNode) {
			mountNode.appendChild(renderer.domElement);
		}

		// Simple star shader for testing
		const starVertexShader = `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.0);
			}
		`;

		const starFragmentShader = `
			uniform float iTime;
			varying vec2 vUv;

			// Simple noise function
			float random(vec2 st) {
				return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
			}

			void main() {
				vec2 uv = vUv;
				
				// Create stars using simple noise
				float stars = 0.0;
				
				// Multiple layers of stars at different scales
				for (int i = 0; i < 3; i++) {
					float scale = pow(2.0, float(i)) * 50.0;
					vec2 grid = floor(uv * scale);
					vec2 id = grid;
					
					// Random star brightness for each grid cell
					float brightness = random(id);
					
					// Only show bright stars (threshold)
					if (brightness > 0.95) {
						// Add some flickering
						float flicker = 0.5 + 0.5 * sin(iTime * 3.0 + brightness * 100.0);
						stars += brightness * flicker * (1.0 / (float(i) + 1.0));
					}
				}
				
				// Add a subtle blue tint to match space theme
				vec3 color = vec3(stars * 0.8, stars * 0.9, stars);
				
				gl_FragColor = vec4(color, 1.0);
			}
		`;

		// Create star material
		starsMaterial = new THREE.ShaderMaterial({
			uniforms: {
				iTime: { value: 0 }
			},
			vertexShader: starVertexShader,
			fragmentShader: starFragmentShader,
			transparent: true,
			depthTest: false,
			depthWrite: false
		});

		// Create fullscreen plane
		const starsGeometry = new THREE.PlaneGeometry(2, 2);
		const starsMesh = new THREE.Mesh(starsGeometry, starsMaterial);
		scene.add(starsMesh);

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);
			
			// Update time for star flickering
			if (starsMaterial) {
				starsMaterial.uniforms.iTime.value = performance.now() * 0.001;
			}
			
			renderer.render(scene, camera);
		}
		animate();

		// Handle window resize
		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;
			renderer.setSize(width, height);
		}
		window.addEventListener('resize', onWindowResize);

		// Cleanup
		return () => {
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

	return (
		<div 
			ref={mountRef} 
			style={{ 
				position: "fixed", 
				top: 0, 
				left: 0, 
				width: "100vw", 
				height: "100vh", 
				zIndex: -1, 
				pointerEvents: "none" 
			}} 
		/>
	);
}